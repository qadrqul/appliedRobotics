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

## How to Run the Project

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

## Authors
- [@qadrqul](https://github.com/qadrqul)
- [@qadrqul](https://github.com/qadrqul)
- [@qadrqul](https://github.com/qadrqul)

