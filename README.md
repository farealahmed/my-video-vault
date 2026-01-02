# Video Vault

A full-stack web application for uploading, organizing, and streaming your personal video library. Built with a modern React frontend and a robust Spring Boot backend, Video Vault provides a secure and intuitive platform for managing your video collection.

## Overview

Video Vault allows users to create personal accounts, upload videos with metadata (title, description, duration), and stream them directly in the browser. The application features a responsive dashboard that displays your video library in a clean grid layout, with built-in video player functionality.

### Key Highlights

- **Secure Authentication**: User registration and login with BCrypt password hashing
- **Video Management**: Upload, organize, and delete videos from your personal library
- **Streaming Playback**: Watch videos directly in the browser with a modal video player
- **Modern UI**: Clean, responsive interface with dark/light theme support
- **RESTful API**: Well-structured backend API for all operations

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  CLIENT                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        React Frontend (Port 8081)                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │   Login     │  │  Dashboard  │  │   Upload    │  │   Player    │   │  │
│  │  │   Page      │  │    Page     │  │   Dialog    │  │   Modal     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP/REST
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  SERVER                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    Spring Boot Backend (Port 8080)                     │  │
│  │                                                                        │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐ │  │
│  │  │                         Controllers                               │ │  │
│  │  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐      │ │  │
│  │  │  │ AuthController │  │ VideoController│  │ FileController │      │ │  │
│  │  │  │  /api/auth/*   │  │  /api/videos/* │  │   /uploads/*   │      │ │  │
│  │  │  └────────────────┘  └────────────────┘  └────────────────┘      │ │  │
│  │  └──────────────────────────────────────────────────────────────────┘ │  │
│  │                                │                                       │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐ │  │
│  │  │                          Services                                 │ │  │
│  │  │              ┌─────────────────────────────┐                      │ │  │
│  │  │              │    FileStorageService       │                      │ │  │
│  │  │              │   (Handles file uploads)    │                      │ │  │
│  │  │              └─────────────────────────────┘                      │ │  │
│  │  └──────────────────────────────────────────────────────────────────┘ │  │
│  │                                │                                       │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐ │  │
│  │  │                        Repositories                               │ │  │
│  │  │     ┌──────────────────┐        ┌──────────────────┐             │ │  │
│  │  │     │  UserRepository  │        │  VideoRepository │             │ │  │
│  │  │     └──────────────────┘        └──────────────────┘             │ │  │
│  │  └──────────────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                          │                           │
                          ▼                           ▼
              ┌───────────────────┐       ┌───────────────────┐
              │    PostgreSQL     │       │   File System     │
              │   (Port 5433)     │       │    /uploads/      │
              │                   │       │                   │
              │  ┌─────────────┐  │       │  ┌─────────────┐  │
              │  │    Users    │  │       │  │ video1.mp4  │  │
              │  ├─────────────┤  │       │  │ video2.mp4  │  │
              │  │   Videos    │  │       │  │ video3.mp4  │  │
              │  └─────────────┘  │       │  └─────────────┘  │
              └───────────────────┘       └───────────────────┘
```

## Request Flow

### User Authentication Flow

```
┌────────┐      ┌────────────┐      ┌────────────────┐      ┌──────────────┐
│  User  │      │  Frontend  │      │    Backend     │      │  PostgreSQL  │
└───┬────┘      └─────┬──────┘      └───────┬────────┘      └──────┬───────┘
    │                 │                     │                      │
    │  Enter credentials                    │                      │
    ├────────────────>│                     │                      │
    │                 │                     │                      │
    │                 │  POST /api/auth/login                      │
    │                 ├────────────────────>│                      │
    │                 │                     │                      │
    │                 │                     │  Query user by email │
    │                 │                     ├─────────────────────>│
    │                 │                     │                      │
    │                 │                     │  Return user data    │
    │                 │                     │<─────────────────────┤
    │                 │                     │                      │
    │                 │                     │  Verify BCrypt hash  │
    │                 │                     ├──────┐               │
    │                 │                     │      │               │
    │                 │                     │<─────┘               │
    │                 │                     │                      │
    │                 │  Return user object │                      │
    │                 │<────────────────────┤                      │
    │                 │                     │                      │
    │                 │  Store in localStorage                     │
    │                 ├──────┐              │                      │
    │                 │      │              │                      │
    │                 │<─────┘              │                      │
    │                 │                     │                      │
    │  Redirect to Dashboard               │                      │
    │<────────────────┤                     │                      │
    │                 │                     │                      │
```

### Video Upload Flow

```
┌────────┐      ┌────────────┐      ┌────────────────┐      ┌──────────┐      ┌────────────┐
│  User  │      │  Frontend  │      │    Backend     │      │ Database │      │ FileSystem │
└───┬────┘      └─────┬──────┘      └───────┬────────┘      └────┬─────┘      └─────┬──────┘
    │                 │                     │                    │                  │
    │  Select video file                    │                    │                  │
    ├────────────────>│                     │                    │                  │
    │                 │                     │                    │                  │
    │  Fill metadata  │                     │                    │                  │
    ├────────────────>│                     │                    │                  │
    │                 │                     │                    │                  │
    │                 │  POST /api/videos/{userId}               │                  │
    │                 │  (multipart/form-data)                   │                  │
    │                 ├────────────────────>│                    │                  │
    │                 │                     │                    │                  │
    │                 │                     │  Save file to disk │                  │
    │                 │                     ├───────────────────────────────────────>
    │                 │                     │                    │                  │
    │                 │                     │                    │   Return filename│
    │                 │                     │<───────────────────────────────────────
    │                 │                     │                    │                  │
    │                 │                     │  Save video metadata                  │
    │                 │                     ├───────────────────>│                  │
    │                 │                     │                    │                  │
    │                 │                     │   Return saved video                  │
    │                 │                     │<───────────────────┤                  │
    │                 │                     │                    │                  │
    │                 │  Return video object│                    │                  │
    │                 │<────────────────────┤                    │                  │
    │                 │                     │                    │                  │
    │  Update video grid                    │                    │                  │
    │<────────────────┤                     │                    │                  │
```

### Video Streaming Flow

```
┌────────┐      ┌────────────┐      ┌────────────────┐      ┌────────────┐
│  User  │      │  Frontend  │      │    Backend     │      │ FileSystem │
└───┬────┘      └─────┬──────┘      └───────┬────────┘      └─────┬──────┘
    │                 │                     │                     │
    │  Click play     │                     │                     │
    ├────────────────>│                     │                     │
    │                 │                     │                     │
    │                 │  Open video modal   │                     │
    │                 ├──────┐              │                     │
    │                 │      │              │                     │
    │                 │<─────┘              │                     │
    │                 │                     │                     │
    │                 │  GET /uploads/{filename}                  │
    │                 ├────────────────────>│                     │
    │                 │                     │                     │
    │                 │                     │  Read video file    │
    │                 │                     ├────────────────────>│
    │                 │                     │                     │
    │                 │                     │  Return file bytes  │
    │                 │                     │<────────────────────┤
    │                 │                     │                     │
    │                 │  Stream video/mp4   │                     │
    │                 │<────────────────────┤                     │
    │                 │                     │                     │
    │  Play video     │                     │                     │
    │<────────────────┤                     │                     │
```

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router DOM
- TanStack React Query

**Backend:**
- Spring Boot 4.0 (Java 21)
- Spring Data JPA
- Spring Security
- PostgreSQL 15

**Infrastructure:**
- Docker & Docker Compose

## Prerequisites

- Java 21 SDK
- Node.js 18+
- Docker & Docker Compose

## Getting Started

### 1. Start the Database

```bash
docker-compose up -d
```

This starts PostgreSQL on port `5433`.

### 2. Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The API server starts at `http://localhost:8080`.

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:8081`.

## Project Structure

```
my-video-vault/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   └── types/            # TypeScript types
│   └── package.json
├── backend/                  # Spring Boot application
│   ├── src/main/java/com/videovault/demo/
│   │   ├── config/           # Security configuration
│   │   ├── controller/       # REST controllers
│   │   ├── model/            # JPA entities
│   │   ├── repository/       # Data repositories
│   │   └── service/          # Business logic
│   └── pom.xml
└── docker-compose.yml        # PostgreSQL container
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create a new user |
| POST | `/api/auth/login` | Authenticate user |

### Videos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos/{userId}` | Get all videos for a user |
| POST | `/api/videos/{userId}` | Upload a new video |
| DELETE | `/api/videos/{videoId}` | Delete a video |
| GET | `/uploads/{filename}` | Stream a video file |

## Database Schema

```
┌──────────────────────────────┐       ┌──────────────────────────────────┐
│            users             │       │             videos               │
├──────────────────────────────┤       ├──────────────────────────────────┤
│ id          UUID (PK)        │       │ id            UUID (PK)          │
│ email       VARCHAR (unique) │       │ title         VARCHAR            │
│ password    VARCHAR          │◄──────│ description   VARCHAR            │
│ name        VARCHAR          │   FK  │ url           VARCHAR            │
└──────────────────────────────┘       │ thumbnail     VARCHAR            │
                                       │ duration      VARCHAR            │
                                       │ uploaded_at   TIMESTAMP          │
                                       │ user_id       UUID (FK)          │
                                       └──────────────────────────────────┘
```

## Features

- User authentication (signup/login)
- Video upload with metadata
- Video streaming playback
- Responsive dashboard with video grid
- Dark/light theme support

## Configuration

**Database** (docker-compose.yml):
- Port: `5433`
- Database: `videovault`
- User: `postgres`
- Password: `password`

**Backend** (backend/src/main/resources/application.yaml):
- Server port: `8080`
- Database connection configured for Docker PostgreSQL

**Frontend** (frontend/src/config.ts):
- API URL: `http://localhost:8080/api`

## Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/*.jar
```

## License

MIT
