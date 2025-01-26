import cv2
import numpy as np
from flask import Flask, Response
from dotenv import load_dotenv
import os
import time

load_dotenv()

app = Flask(__name__)

camera_path = int(os.getenv("CAMERA_PATH", 0))
frame_delta = None
motion_detected = False

net = cv2.dnn.readNetFromCaffe("model/deploy.prototxt", "model/mobilenet_iter_73000.caffemodel")

class_labels = ["bicycle", "bus", "car", "cat", "person"]
class_ids_to_detect = [2, 6, 7, 8, 15]  # Corresponding class IDs for "bicycle", "bus", "car", "cat", "person"

frame_counter = 0


def generate_frames():
    global frame_delta, motion_detected, frame_counter

    cap = None
    while True:
        if cap is None or not cap.isOpened():
            cap = cv2.VideoCapture(camera_path)
            if not cap.isOpened():
                print("Error: Unable to access the camera. Retrying...")
                time.sleep(5)
                continue

        success, frame = cap.read()
        if not success:
            print("Error: Failed to capture frame.")
            cap.release()
            cap = None
            continue

        frame_counter += 1

        if frame_counter % 5 != 0:
            continue

        h, w = frame.shape[:2]

        blob = cv2.dnn.blobFromImage(frame, 0.007843, (300, 300), (127.5, 127.5, 127.5), swapRB=True, crop=False)
        net.setInput(blob)
        detections = net.forward()

        for i in range(detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            class_id = int(detections[0, 0, i, 1])

            if confidence > 0.2 and class_id in class_ids_to_detect:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")

                label = "{}: {:.2f}%".format(class_labels[class_ids_to_detect.index(class_id)], confidence * 100)
                cv2.rectangle(frame, (startX, startY), (endX, endY), (0, 255, 0), 2)
                y = startY - 15 if startY - 15 > 15 else startY + 15
                cv2.putText(frame, label, (startX, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        if frame_delta is None:
            frame_delta = gray
            continue

        delta_frame = cv2.absdiff(frame_delta, gray)
        thresh = cv2.threshold(delta_frame, 25, 255, cv2.THRESH_BINARY)[1]
        thresh = cv2.dilate(thresh, None, iterations=2)

        contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        motion_detected = False
        for contour in contours:
            if cv2.contourArea(contour) < 500:
                continue
            motion_detected = True

        frame_delta = gray

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/camera/stream')
def camera_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/motion-detected')
def check_motion():
    if motion_detected:
        return "Motion detected", 200
    else:
        return "No motion detected", 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
