import argparse
import time
from pathlib import Path
import os
import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random
import pytesseract
from concurrent.futures import ThreadPoolExecutor

from models.experimental import attempt_load
from utils.datasets import LoadStreams, LoadImages
from utils.general import check_img_size, check_requirements, check_imshow, non_max_suppression, apply_classifier, \
    scale_coords, xyxy2xywh, strip_optimizer, set_logging, increment_path
from utils.plots import plot_one_box
from utils.torch_utils import select_device, load_classifier, time_synchronized, TracedModel
from scipy.ndimage import rotate
import numpy as np
import logging
from RPLCD.i2c import CharLCD
import RPi.GPIO as GPIO
import re

lcd = CharLCD('PCF8574', 0x27)
SERVO_PIN = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(SERVO_PIN, GPIO.OUT)

pwm = GPIO.PWM(SERVO_PIN, 50)
pwm.start(0)


def open_gate():
    pwm.ChangeDutyCycle(7.5)
    time.sleep(7)
    pwm.ChangeDutyCycle(2.5)
    time.sleep(1)


def close_gate():
    pwm.ChangeDutyCycle(2.5)
    time.sleep(1)


def display_on_lcd(license_plate, access_status):
    lcd.clear()
    lcd.write_string(f"Number: {license_plate}")
    lcd.crlf()
    lcd.write_string(f"Status: {access_status}")
    time.sleep(3)
    lcd.clear()


def setup_logger():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    return logging.getLogger("DetectionLogger")


logger = setup_logger()


def check_access(license_plate_text, database):
    """Checks if a license plate is in the allowed database."""
    if license_plate_text in database:
        return "Access Granted"
    else:
        return "Access Denied"


def detect_and_analyze(save_img=False):
    source, weights, view_img, save_txt, imgsz, trace = opt.source, opt.weights, opt.view_img, opt.save_txt, opt.img_size, not opt.no_trace
    save_img = not opt.nosave and not source.endswith('.txt')
    webcam = source.isnumeric() or source.endswith('.txt') or source.lower().startswith(
        ('rtsp://', 'rtmp://', 'http://', 'https://'))

    # Create folders
    os.makedirs("crop", exist_ok=True)
    os.makedirs("results", exist_ok=True)

    crp_cnt = 0

    save_dir = Path(increment_path(Path(opt.project) / opt.name, exist_ok=opt.exist_ok))
    (save_dir / 'labels' if save_txt else save_dir).mkdir(parents=True, exist_ok=True)

    set_logging()
    device = select_device(opt.device)
    half = device.type != 'cpu'

    model = attempt_load(weights, map_location=device)
    stride = int(model.stride.max())
    imgsz = check_img_size(imgsz, s=stride)

    if trace:
        model = TracedModel(model, device, opt.img_size)

    if half:
        model.half()

    classify = False

    vid_path, vid_writer = None, None
    if webcam:
        view_img = check_imshow()
        cudnn.benchmark = True
        dataset = LoadStreams(source, img_size=imgsz, stride=stride)
    else:
        dataset = LoadImages(source, img_size=imgsz, stride=stride)

    names = model.module.names if hasattr(model, 'module') else model.names
    colors = [[random.randint(0, 255) for _ in range(3)] for _ in names]

    allowed_database = {"ABC123", "XYZ789", "TEST456", "TX-9000", "ABCD 012", "SN66 XMZ"}

    if device.type != 'cpu':
        model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(model.parameters())))

    t0 = time.time()

    def process_crop(crop_file_path, crp_cnt):
        try:
            license_plate_text = analyze_text(crop_file_path)
            access_status = check_access(license_plate_text, allowed_database)
            with open("results/license_plates.txt", "a", encoding="utf-8") as f:
                f.write(f"Crop {crp_cnt}: {license_plate_text} - {access_status}\n")
            display_on_lcd(license_plate_text, access_status)

            if access_status == "Access Granted":
                open_gate()

            logger.info(f"Processed crop {crp_cnt}, text: {license_plate_text}, status: {access_status}")
        except Exception as e:
            logger.error(f"Error processing crop {crp_cnt}: {e}")

    with ThreadPoolExecutor(max_workers=4) as executor:
        for path, img, im0s, vid_cap in dataset:
            img = torch.from_numpy(img).to(device)
            img = img.half() if half else img.float()
            img /= 255.0
            if img.ndimension() == 3:
                img = img.unsqueeze(0)

            pred = model(img, augment=opt.augment)[0]
            pred = non_max_suppression(pred, opt.conf_thres, opt.iou_thres, classes=opt.classes,
                                       agnostic=opt.agnostic_nms)

            for i, det in enumerate(pred):
                if webcam:
                    p, s, im0, frame = path[i], f'{i}: ', im0s[i].copy(), dataset.count
                else:
                    p, s, im0, frame = path, '', im0s, getattr(dataset, 'frame', 0)

                p = Path(p)
                save_path = str(save_dir / p.name)
                txt_path = str(save_dir / 'labels' / p.stem) + ('' if dataset.mode == 'image' else f'_{frame}')
                gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]

                if len(det):
                    det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

                    for c in det[:, -1].unique():
                        n = (det[:, -1] == c).sum()
                        s += f"{n} {names[int(c)]}{'s' * (n > 1)}, "

                    for *xyxy, conf, cls in reversed(det):
                        object_coordinates = [int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])]
                        cropobj = im0[int(xyxy[1]):int(xyxy[3]), int(xyxy[0]):int(xyxy[2])]

                        crop_file_path = os.path.join("crop", f"{crp_cnt}.jpg")
                        cv2.imwrite(crop_file_path, cropobj)
                        executor.submit(process_crop, crop_file_path, crp_cnt)
                        crp_cnt += 1

                        if save_txt:
                            xywh = (xyxy2xywh(torch.tensor(xyxy).view(1, 4)) / gn).view(-1).tolist()
                            line = (cls, *xywh, conf) if opt.save_conf else (cls, *xywh)
                            with open(txt_path + '.txt', 'a') as f:
                                f.write(('%.6f ' * len(line)).rstrip() % line + '\n')

                        if save_img or view_img:
                            label = f'{names[int(cls)]} {conf:.2f}'
                            plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=1)

                if view_img:
                    cv2.imshow(str(p), im0)
                    cv2.waitKey(1)

                if save_img:
                    if dataset.mode == 'image':
                        cv2.imwrite(save_path, im0)
                        logger.info(f"Saved result image to {save_path}")
                    else:
                        if vid_path != save_path:
                            vid_path = save_path
                            if isinstance(vid_writer, cv2.VideoWriter):
                                vid_writer.release()
                            if vid_cap:
                                fps = vid_cap.get(cv2.CAP_PROP_FPS)
                                w = int(vid_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                                h = int(vid_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                            else:
                                fps, w, h = 30, im0.shape[1], im0.shape[0]
                                save_path += '.mp4'
                            vid_writer = cv2.VideoWriter(save_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))
                        vid_writer.write(im0)

    logger.info(f'Detection and analysis completed in {(time.time() - t0):.3f}s.')


def preprocess_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    corrected = correct_skew(gray)

    denoised = cv2.fastNlMeansDenoising(corrected, None, h=30, templateWindowSize=7, searchWindowSize=21)

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(denoised)

    binary = cv2.adaptiveThreshold(enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

    sharpen_kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
    sharpened = cv2.filter2D(binary, -1, sharpen_kernel)

    return sharpened


def correct_skew(img):
    def _find_score(arr, angle):
        data = rotate(arr, angle, reshape=False, order=0)
        hist = np.sum(data, axis=1)
        score = np.sum((hist[1:] - hist[:-1]) ** 2)
        return hist, score

    def _find_angle(img, delta=0.5, limit=10):
        angles = np.arange(-limit, limit + delta, delta)
        scores = []
        for angle in angles:
            hist, score = _find_score(img, angle)
            scores.append(score)
        best_score = max(scores)
        best_angle = angles[scores.index(best_score)]
        logger.info(f'Best skew angle: {best_angle}')
        return best_angle

    best_angle = _find_angle(img)
    data = rotate(img, best_angle, reshape=False, order=0)
    return data


def analyze_text(image_path):
    try:
        img = cv2.imread(image_path)
        preprocessed_img = preprocess_image(img)

        text = pytesseract.image_to_string(preprocessed_img, config='--psm 8')
        cleaned_text = re.sub(r'[^A-Za-z0-9 ]', '', text)
        cleaned_text = cleaned_text.strip()

        return cleaned_text
    except Exception as e:
        logger.error(f"Error analyzing text: {e}")
        return ""


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--weights', nargs='+', type=str, default='yolov7.pt', help='model.pt path(s)')
    parser.add_argument('--source', type=str, default='inference/images', help='source')
    parser.add_argument('--img-size', type=int, default=640, help='inference size (pixels)')
    parser.add_argument('--conf-thres', type=float, default=0.25, help='object confidence threshold')
    parser.add_argument('--iou-thres', type=float, default=0.45, help='IOU threshold for NMS')
    parser.add_argument('--device', default='', help='cuda device, i.e. 0 or 0,1,2,3 or cpu')
    parser.add_argument('--view-img', action='store_true', help='display results')
    parser.add_argument('--save-txt', action='store_true', help='save results to *.txt')
    parser.add_argument('--save-conf', action='store_true', help='save confidences in --save-txt labels')
    parser.add_argument('--nosave', action='store_true', help='do not save images/videos')
    parser.add_argument('--classes', nargs='+', type=int, help='filter by class: --class 0, or --class 0 2 3')
    parser.add_argument('--agnostic-nms', action='store_true', help='class-agnostic NMS')
    parser.add_argument('--augment', action='store_true', help='augmented inference')
    parser.add_argument('--project', default='runs/detect', help='save results to project/name')
    parser.add_argument('--name', default='exp', help='save results to project/name')
    parser.add_argument('--exist-ok', action='store_true', help='existing project/name ok, do not increment')
    parser.add_argument('--no-trace', action='store_true', help='don`t trace model')
    opt = parser.parse_args()

    with torch.no_grad():
        detect_and_analyze()

try:
    pwm.stop()
    GPIO.cleanup()
    lcd.clear()
except RuntimeError as e:
    logger.error(f"Error during GPIO cleanup: {e}")
