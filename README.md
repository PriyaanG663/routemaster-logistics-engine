# RouteMaster | Logistics & Tracking Engine

RouteMaster is a containerized end-to-end logistics management system built with the MERN stack. It features a responsive dashboard for registering shipments and tracking their real-time status across different locations.

![RouteMaster Dashboard](./display/image.png)

## 🚀 Key Features
- **Automated Routing:** Automatically synchronizes the initial shipment location with the source city upon registration.
- **Microservices Architecture:** Fully containerized using Docker and orchestrated with Docker Compose.
- **Live Tracking Feed:** A split-screen UI featuring a fixed control panel and a scrollable real-time tracking feed.
- **Data Persistence:** Integrated MongoDB with Docker Volumes to ensure data survives container restarts.

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite), Axios, CSS3 (Flexbox/Grid)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose (ODM)
- **Infrastructure:** Docker, Docker Compose

## 🏗️ DevOps Overview
The system is built as a set of decoupled services:
1. **Client:** React application optimized for modern browsers.
2. **API:** Express server handling CRUD operations and data validation.
3. **Database:** MongoDB instance running on a private Docker network for enhanced security.

## 🚦 Getting Started

### Prerequisites
- Docker & Docker Compose installed

### Installation & Execution
1. Clone the repository:
   ```bash
   git clone [https://github.com/PriyaanG663/routemaster-logistics-engine.git](https://github.com/PriyaanG663/routemaster-logistics-engine.git)
   cd routemaster-logistics-engine
2. Run it by : docker-compose up --build