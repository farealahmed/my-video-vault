# Video Vault Backend

This is the backend service for the Video Vault application, built with Java Spring Boot and PostgreSQL. It handles user authentication, video metadata management, and file storage.

## 🚀 Development Journey & Setup

### 1. Project Initialization
- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Build Tool**: Maven
- **Dependencies**:
  - Spring Web (REST API)
  - Spring Data JPA (Database Interaction)
  - PostgreSQL Driver (Database Connection)
  - Spring Security (Authentication & Password Hashing)
  - Lombok (Boilerplate reduction)

### 2. Database Setup (Docker)
We used **Docker Compose** to set up an isolated PostgreSQL database environment.
- **Image**: `postgres:15`
- **Container Name**: `videovault_db`
- **Volume**: `postgres_data` (for data persistence)

### 3. Architecture & Implementation
We followed a standard layered architecture:
- **Models (`/model`)**: JPA Entities `User` and `Video` defining the database schema.
- **Repositories (`/repository`)**: Interfaces extending `JpaRepository` for DB operations.
- **Services (`/service`)**: `FileStorageService` for handling file uploads to the local disk.
- **Controllers (`/controller`)**: REST endpoints:
  - `AuthController`: User Signup/Login.
  - `VideoController`: Upload, List, Delete videos.
  - `FileController`: Serve video files to the frontend.
- **Config (`/config`)**: `SecurityConfig` for handling CORS (allowing frontend access) and Password Encoding (BCrypt).

---

## 🛠️ Problems Faced & Solutions

During the setup, we encountered and resolved the following issues:

### 1. Port Conflict (5432)
*   **Issue**: The default PostgreSQL port `5432` was already in use by a local PostgreSQL installation on the host machine.
*   **Diagnosis**: Ran `lsof -i :5432` which confirmed `postgres` was listening on that port.
*   **Solution**: Modified `docker-compose.yml` to map the container's port `5432` to host port `5433`. Updated `application.yaml` to connect to port `5433`.

### 2. Maven Wrapper Missing
*   **Issue**: Running `./mvnw clean package` failed with `No such file or directory` for `maven-wrapper.properties`.
*   **Solution**: Regenerated the wrapper files using the installed Maven version.
    ```bash
    mvn wrapper:wrapper
    ```

### 3. XML Parse Error in `pom.xml`
*   **Issue**: The `pom.xml` had a malformed dependency tag (unclosed `<dependency>`).
*   **Solution**: Manually corrected the XML structure to ensure valid dependency declarations.

---

## 🏃‍♂️ How to Run the Backend

### Prerequisites
- Docker & Docker Compose
- Java 21 SDK
- Maven (optional, wrapper provided)

### Step 1: Start the Database
Run the PostgreSQL container using Docker Compose:
```bash
# From the project root
docker-compose up -d
```
*   **Port**: 5433 (Host) -> 5432 (Container)
*   **Credentials**: user=`postgres`, password=`password`, db=`videovault`

### Step 2: Build the Application
Navigate to the backend directory and build the project:
```bash
cd backend
./mvnw clean package -DskipTests
```

### Step 3: Run the Server
Start the Spring Boot application:
```bash
./mvnw spring-boot:run
```
The server will start on **http://localhost:8080**.

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Authenticate user.

### Videos
- `GET /api/videos/{userId}`: Get all videos for a user.
- `POST /api/videos/{userId}`: Upload a new video (Multipart File).
- `DELETE /api/videos/{videoId}`: Delete a video.

### Files
- `GET /uploads/{filename}`: Stream/Download a video file.
