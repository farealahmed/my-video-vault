# Video Vault Frontend

This is the frontend client for the Video Vault application, built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It interacts with the Java Spring Boot backend to provide a complete user experience.

## 🚀 Integration Journey & Implementation

Here is a step-by-step breakdown of how we transformed the static prototype into a fully integrated application.

### 1. Project Organization
*   **Action**: Moved all frontend-related files into a dedicated `/frontend` directory.
*   **Why**: To cleanly separate the Client (UI) from the Server (Java Backend). This allows them to be developed, built, and deployed independently.

### 2. API Configuration
*   **Action**: Created `src/config.ts`.
*   **Why**: To centralize the Backend URL (`http://localhost:8080/api`).
*   **Benefit**: If the backend URL changes (e.g., when deploying to the cloud), we only need to update it in one place instead of hunting through every file.

### 3. Authentication Integration
*   **Action**: Updated `AuthContext.tsx`, `useAuth.ts`, and `Login.tsx`.
*   **Change**: Replaced `localStorage` mock logic with `fetch()` calls to:
    *   `POST /api/auth/signup`
    *   `POST /api/auth/login`
*   **Why**: Security and Persistence. User credentials should be verified by the server, not stored in the browser's plain text storage.

### 4. Video Management & File Uploads
*   **Action**: Updated `useVideos.ts` and `AddVideoDialog.tsx`.
*   **Change**:
    *   **Fetching**: `GET /api/videos/{userId}` replaces the hardcoded sample array.
    *   **Uploading**: `POST /api/videos/{userId}` using `FormData`.
    *   **Input**: Changed the "Video URL" text input to a **File Input** (`type="file"`).
*   **Why**: The original prototype only allowed pasting links. We needed to support *actual* file uploads so the backend can store the video files on the disk.

---

## 🛠️ Challenges & Solutions

### 1. Cross-Origin Resource Sharing (CORS)
*   **Problem**: The Frontend runs on port `8081` (or `5173`), but the Backend runs on `8080`. Browsers block requests between different ports by default for security.
*   **Solution**: We updated the Backend's `SecurityConfig.java` to explicitly allow requests from our frontend URLs:
    ```java
    configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8081"));
    ```

### 2. Handling Binary Data
*   **Problem**: JSON is great for text, but you can't easily send video files as JSON.
*   **Solution**: We switched from `JSON.stringify()` to `FormData()` in `useVideos.ts`. This allows the browser to package the video file correctly as a `multipart/form-data` request that the backend expects.

---

## 🏃‍♂️ How to Run the Frontend

### Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

### Step 1: Install Dependencies
Navigate to the frontend directory and install the required packages:
```bash
cd frontend
npm install
```

### Step 2: Start the Development Server
Run the local dev server:
```bash
npm run dev
```
The application will start (usually at `http://localhost:8081` or `http://localhost:5173`).

### Step 3: Verify Connection
1.  Open the browser to the provided URL.
2.  **Sign Up** for a new account.
3.  **Upload** a video file.
4.  If the video appears in your dashboard, the connection to the backend is successful!
