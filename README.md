# My Video Vault - Project Documentation

This document outlines the development process, architecture, troubleshooting steps, and instructions for running the **My Video Vault** application (Frontend + Backend).

## 1. Project Structure

The project is divided into two main directories:

- **`/frontend`**: Contains the existing React application (User Interface).
- **`/backend`**: Contains the newly created Spring Boot application (API & Logic).
- **`docker-compose.yml`**: Configuration for the isolated PostgreSQL database.

## 2. Development Log (Steps Taken)

### Phase 1: Organization
1.  Moved all existing frontend files into the `/frontend` directory to separate concerns.
2.  Analyzed the frontend to understand requirements (User Authentication, Video Management).

### Phase 2: Backend Setup
1.  **Spring Boot Initialization**: Created a new Spring Boot project using Maven with the following dependencies:
    - `Spring Web` (REST API)
    - `Spring Data JPA` (Database Interaction)
    - `Spring Security` (Authentication)
    - `PostgreSQL Driver` (Database Connectivity)
    - `Lombok` (Boilerplate reduction)
2.  **Database Configuration**:
    - Created a `docker-compose.yml` file to run a PostgreSQL 15 container.
    - Configured `application.yaml` to connect to this database.

### Phase 3: Backend Implementation
1.  **Models**: Created `User` and `Video` entities with JPA annotations.
2.  **Repositories**: Created `UserRepository` and `VideoRepository` interfaces extending `JpaRepository`.
3.  **Service**: Implemented `FileStorageService` to handle saving video files to the local file system (`uploads/` directory).
4.  **Security**: Configured `SecurityConfig` to:
    - Enable CORS (for frontend communication).
    - Disable CSRF (for REST API).
    - Password encoding using `BCrypt`.
5.  **Controllers**:
    - `AuthController`: Handles Signup and Login.
    - `VideoController`: Handles Video Upload, Metadata saving, and Deletion.
    - `FileController`: Serves the actual video files to the frontend.

## 3. Troubleshooting & Issues Resolved

During the setup, we encountered and solved the following issues:

### Issue 1: `pom.xml` Parsing Error
- **Problem**: The `pom.xml` file had an unclosed `<dependency>` tag for `spring-boot-starter-test`.
- **Solution**: Manually corrected the XML structure to ensure all tags were properly closed.

### Issue 2: Missing Maven Wrapper
- **Problem**: Running `./mvnw` failed with "No such file or directory" for `maven-wrapper.properties`.
- **Solution**: Ran the following command to regenerate the wrapper files:
  ```bash
  mvn wrapper:wrapper
  ```

### Issue 3: Database Port Conflict
- **Problem**: Port `5432` was already in use by a local PostgreSQL instance on the host machine, causing the Docker container to fail or the app to connect to the wrong DB.
- **Solution**: Modified `docker-compose.yml` and `application.yaml` to use port **5433** for this project.
  - **Docker**: `5433:5432`
  - **App Config**: `jdbc:postgresql://localhost:5433/videovault`
  - **Command**: `lsof -i :5432` (to identify the conflict) and `docker-compose down && docker-compose up -d` (to apply changes).

## 4. Backend Architecture

- **Database**: PostgreSQL (Stores User and Video metadata).
- **File Storage**: Local File System (Stores actual video files in `uploads/`).
- **API Style**: RESTful API.
- **Security**: Stateless (currently returning User object, scalable to JWT).

## 5. How to Run the Backend

### Prerequisites
- Docker & Docker Compose
- Java 21 (SDK)

### Step 1: Start the Database
Run the PostgreSQL container using Docker Compose:
```bash
docker-compose up -d
```
*This starts the database on port 5433.*

### Step 2: Build the Backend
Navigate to the backend directory and build the project (skipping tests for speed):
```bash
cd backend
./mvnw clean package -DskipTests
```

### Step 3: Run the Application
Start the Spring Boot application:
```bash
./mvnw spring-boot:run
```
The server will start at `http://localhost:8080`.

## 6. API Endpoints

- **POST** `/api/auth/signup`: Create a new user.
- **POST** `/api/auth/login`: Authenticate user.
- **POST** `/api/videos/{userId}`: Upload a video (Multipart File).
- **GET** `/uploads/{filename}`: Stream/View a video file.
