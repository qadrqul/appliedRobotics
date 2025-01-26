import cv from 'opencv4nodejs';

const startCameraStream = (req, res) => {
    const wCap = new cv.VideoCapture(0); // 0 for the default camera
    const frameWidth = wCap.get(cv.CAP_PROP_FRAME_WIDTH);
    const frameHeight = wCap.get(cv.CAP_PROP_FRAME_HEIGHT);

    const processFrame = () => {
        let frame = wCap.read();
        if (frame.empty) {
            wCap.reset();
            return;
        }

        const grayFrame = frame.bgrToGray();

        // Convert to JPEG format for sending to client
        const encodedFrame = cv.imencode('.jpg', grayFrame);
        const base64Frame = encodedFrame.toString('base64');

        res.write(`data:image/jpeg;base64,${base64Frame}\n`);
        res.flush();

        setTimeout(processFrame, 1000 / 30);
    };

    res.setHeader('Content-Type', 'text/plain');
    processFrame();
};

export { startCameraStream };
