# Video Conferencing Monorepo

This project was created as part of an internship at BARC.

> ⚠️ **Disclaimer:** This repository is provided for demonstration purposes. It is *not* an exact replica of the confidential project developed at BARC.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture & Workflow](#architecture--workflow)
4. [Folder Structure](#folder-structure)
5. [Prerequisites](#prerequisites)
6. [Setup & Installation](#setup--installation)
7. [Usage](#usage)
8. [Contributing](#contributing)
9. [License](#license)

---

## Project Overview
This monorepo contains a full-stack video conferencing application built using the LiveKit media platform. It includes:

- **LiveKit Server** (Windows) in development mode, handling real-time audio/video routing.
- **Egress Service** with Docker, generating composite MP4 recordings of meetings.
- **Backend** (Node.js + Express) for room management, access token generation, and egress control.
- **Frontend** (React) with LiveKit components for joining rooms, in-meeting controls, chat, virtual backgrounds, and history.

While this demo covers the core features of a conferencing app, the actual BARC project includes additional proprietary integrations and is not published here.

---

## Tech Stack
- **LiveKit**
  - Media Server (local dev mode)
  - Egress Service (Docker container)
  - `livekit-server-sdk` & `livekit-client`
- **Backend**
  - Node.js
  - Express.js
  - `dotenv`, `cors`, `axios`
- **Frontend**
  - React (v18)
  - React Router (v7)
  - LiveKit React Components & Styles
  - MediaPipe (Selfie Segmentation) for background blur/virtual backgrounds
  - LocalStorage for chat persistence & meeting history
- **Containerization & Services**
  - Docker (Redis, LiveKit Egress)
- **Utilities**
  - Custom hooks (`useLiveKitToken.js`)
  - Utility functions for meeting history (`meetingHistory.js`)

---

## Architecture & Workflow
1. **Startup**
   - Spin up Redis and LiveKit Egress via Docker.
   - Launch LiveKit media server (Windows executable) in dev mode.
   - Run backend server (`node server.js`) on port **3000**.
   - Run React frontend (`npm start`) on port **3001**.

2. **Room Management**
   - **Backend** exposes `/createRoom`, `/rooms`, `/getToken`, `/deleteRoom`, and `/record` endpoints.
   - **Frontend** allows users to create new rooms or join existing ones.

3. **Token & Join Flow**
   - After creating or selecting a room, the backend issues a JWT access token with appropriate grants.
   - Frontend uses the token to connect to LiveKit.

4. **In-Meeting Features**
   - **Controls**: microphone, camera, screen share, leave.
   - **Chat**: toggleable panel, messages stored in LocalStorage per room.
   - **Background Effects**: blur & virtual background via MediaPipe + `@livekit/track-processors`.
   - **Room Info**: participant list, connection quality, mute indicators.

5. **Recording**
   - Composite recording started/stopped via backend egress endpoints.
   - Output `.mp4` and metadata `.json` files appear in `livekit-egress/`.

6. **Meeting History**
   - `meetingHistory.js` tracks join/leave times and durations in LocalStorage.
   - Displayed on the meeting selection page.

---

## Folder Structure
```
PROJECTS AND SERVER/
├── livekit-egress/           # Egress config & recording outputs
├── Livekit-server-windows/   # LiveKit server binary & config
└── Project/
    ├── livekit-backend/      # Node.js + Express backend (port 3000)
    └── livekit-frontend/     # React frontend (port 3001)
```  

Detailed structure is maintained in this repo alongside this README.

---

## Prerequisites
- **Docker & Docker Desktop** (for Redis & Egress)
- **Redis** (via Docker container)
- **LiveKit Server** (Windows executable)
- **Node.js** (v18 or later)
- **npm** (v8 or later)


---

## Setup & Installation
1. **Clone the repo**:
   ```bash
   git clone <your-repo-url>
   cd "PROJECTS AND SERVER"
   ```

2. **Egress & Redis**:
   ```bash
   cd livekit-egress
   docker run -d --name livekit-redis -p 6379:6379 redis:6-alpine
   docker run --rm \
     --cap-add SYS_ADMIN \
     -e EGRESS_CONFIG_FILE=/out/config.yaml \
     -v ${PWD}:/out \
     livekit/egress:latest
   ```

3. **LiveKit Media Server**:
   ```powershell
   cd ../Livekit-server-windows
   .\livekit-server.exe --config .\livekit.yaml --bind 0.0.0.0
   ```

4. **Backend**:
   ```bash
   cd ../Project/livekit-backend
   npm install
   node server.js
   ```

5. **Frontend**:
   ```bash
   cd ../livekit-frontend
   npm install
   npm start   # opens on http://localhost:3001
   ```

---

## Usage
1. Navigate to `http://localhost:3001` in your browser.
2. Create or join a room.
3. Grant camera/microphone permissions.
4. Use in-meeting controls, chat, and background effects.
5. Start/stop recording as needed; find output in `livekit-egress/`.

---

## Development Status
This project is still under development and is being worked upon each and every day, over a period of **4 months (January 15 — May 15, 2025)**.

---

## References

- [LiveKit Documentation](https://docs.livekit.io/home/)
- [LiveKit Egress Service (GitHub)](https://github.com/livekit/egress)
- [LiveKit Track Processors JS (GitHub)](https://github.com/livekit/track-processors-js)

---

## Future Improvements
This project was developed over a period of **4 months (January 15 — May 15, 2025)**. Planned future enhancements include:

- **Role-Based Access Control**: Introduce Admin, Moderator, and Participant roles with granular permissions.
- **Database Integration**: Persist chat history, meeting metadata, and user profiles using a database (e.g., MongoDB or PostgreSQL).
- **Authentication & Authorization**: Add user authentication (OAuth, JWT) and secure room access via private keys or passwords.
- **Automated Testing**: Implement unit, integration, and end-to-end tests (Jest, Cypress) for reliability.
- **Continuous Integration / Deployment (CI/CD)**: Set up pipelines for automated builds, tests, and deployments.
- **Scalability & Performance**: Optimize media server scaling (horizontal sharding, autoscaling), caching, and load balancing.
- **Mobile Responsiveness**: Improve UI/UX for mobile browsers and potentially build native mobile clients.
- **UI/UX Enhancements**: Add theming support, dark/light mode toggle, customizable layouts, and accessibility improvements.
- **Expanded Egress Options**: Support additional recording formats, live streaming (RTMP), and cloud storage export.
- **Analytics & Monitoring**: Integrate real-time analytics dashboards, logging, and monitoring (Prometheus, Grafana).

---

