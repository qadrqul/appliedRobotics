# ACPDR (Advanced Car Plate Detection and Recognition System)

## Overview

The **ACPDR** is our final project for Applied Robotics class, which automates the detection and recognition of car license plates at checkpoints. It provides a backend for managing users, vehicles, and recognition logs, with role-based functionality for administrators and operators. A frontend dashboard integrates with the backend to display real-time vehicle data and logs.

## Core Features
 - Authentication: Login for system access.
 - User Management: CRUD operations for users (Admin only).
 - Vehicle Management: CRUD operations for vehicle data (Admin only).
 - Recognition Logs: Logs recognition events with plate numbers and status (Admin/Operator).
 - Frontend Integration: Displays real-time data via a React + Vite frontend.
 - Database: PostgreSQL stores users, vehicles, and logs.

## How to Run the Web-app

### 1. Clone the Repository

```bash
git clone <repository-url>
cd appliedRobotics
```
### 2. Environment Setup
In the root directory of the project, create a .env file with the following variables:

```.dotenv
CAMERA_PATH=<camera-path>
JWT_SECRET=<your-jwt-secret>
PG_URL=postgres://<postgres-user>:<postgres-password>@<localhost>:<postgres-port>/<postgres-db>
POSTGRES_USER=<postgres-user>
POSTGRES_PASSWORD=<postgres-password>
POSTGRES_DB=<postgres-db>
ADMIN_PASSWORD=<admin-password>
FRONT_URL=<frontend-url>
VITE_API_URL=<backend-api-url>
VITE_CAMERA_URL=<camera-url>
```

#### Placeholder Explanation:
- **CAMERA_PATH:** The path to the camera device (e.g., /dev/video1).
- **JWT_SECRET:** The secret used for generating JWT tokens.
- **PG_URL:** The connection URL for PostgreSQL.
- **POSTGRES_USER:** PostgreSQL username.
- **POSTGRES_PASSWORD:** PostgreSQL password.
- **POSTGRES_DB:** PostgreSQL database name.
- **ADMIN_PASSWORD:** Admin password for the system.
- **FRONT_URL:** The URL for the frontend (e.g., http://192.168.178.149).
- **VITE_API_URL:** The URL for the backend API.
- **VITE_CAMERA_URL:** The URL for the camera feed.

### 3. Run the Project with Docker Compose
```bash
docker-compose up --build
```

### 4. Access the Application
```
Frontend: http://localhost:8000
Backend API: http://localhost:5000
```
## How to Run the Car Plate Detection

### 1. Clone the Repository and go to folder `yolov7_car_plate_detection`
```bash
git clone <repository-url>
cd appliedRobotics/yolov7_car_plate_detection
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install all requirements and dependencies:
```bash
pip install -r requirements.txt
sudo apt-get install -y python3-smbus python3-dev i2c-tools
sudo apt install tesseract-ocr
sudo apt-get install -y i2c-tools
pip install RPi.GPIO
```

### 3. Run the file `detect_and_crop` by command:

```bash
python detect_and_crop.py --weights {best_weights_from_folder} --conf 0.25 --img-size 640 --source 0 --device 0
```
`--source 0` here is your camera. You can also analyze video or photos like `--source link/to/video/or/photo`

`--device 0` here you choose `cpu`=cpu or `0`=gpu

## Screenshots
![image](https://github.com/user-attachments/assets/f7f6c9cc-183e-488d-a0ac-2c97e33d9c31)
![image](https://github.com/user-attachments/assets/43475c7c-e994-4b3f-9b0e-9e2091f3a052)
![image](https://github.com/user-attachments/assets/0d344fb4-cd15-412d-bb7a-aceaebbce6c5)
![image](https://github.com/user-attachments/assets/5a6d4ba2-5fb0-4bdd-b556-71303d200c2a)
![image](https://github.com/user-attachments/assets/2ad3438f-c8c0-44bf-a721-dda6c57c564c)
![image](https://github.com/user-attachments/assets/7aab5659-7802-44ed-9e59-6df6ee81061c)
![image](https://github.com/user-attachments/assets/e9199782-01ec-4d70-8999-6e65b920987a)
![IMG_4636](https://github.com/user-attachments/assets/a18e4983-eea9-40e4-a09f-73fbc5add3d3)

## Deployment
- https://acpdr.netlify.app/
- backend is offline now


## Authors
- [@qadrqul](https://github.com/qadrqul)
- [@ya903040](https://github.com/ya903040)
- [@Ye1nurN](https://github.com/Ye1nurN)
  
### If you encounter any issues, feel free to reach out to me on Telegram @qadrqul.
