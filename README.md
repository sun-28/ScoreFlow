# ScoreFlow

## Overview

ScoreFlow is an online coding assessment platform designed to streamline the evaluation process for universities and organizations. It provides automated code execution, real-time monitoring, and robust analytics to ensure fair and efficient assessments.

## **Live Application:** [scoreflow.live](https://scoreflow.live)


---

Code Execution Flow - 

![diagram-export-24-12-2024-14_14_06](https://github.com/user-attachments/assets/e9311bd4-dda8-4a60-ba70-bb8684d858df)


---

## Features

- **Automated Code Execution and Scoring**: Supports multiple programming languages with dynamic test case evaluation.
- **Plagiarism Detection**: Ensures integrity with advanced code similarity algorithms.
- **Proctoring and Monitoring**: Includes live video analysis and real-time monitoring to detect suspicious activities.
- **Customizable Test Environment**: Flexible settings for tailored assessments.
- **Detailed Analytics and Reporting**: Provides insights into student performance and test outcomes.
- **Secure and Scalable Infrastructure**: Built with modern technologies to handle high concurrent users efficiently.

---

## Tech Stack

**Frontend:** ReactJS\
**Backend:** Node.js, Express.js\
**Database:** MongoDB\
**Authentication:** Passport.js ( Google auth 2.0 )\
**Task Management:** Bull Queues (Redis) \
**Session Store:** Redis\
**Code Execution & Containerization:** Docker\
**Deployment:** AWS EC2\
**Hosting:** Nginx\
**CI/CD:** GitHub Actions

---

## Installation

To run the application locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/<your-repo>/scoreflow.git
   cd scoreflow
   ```

2. **Install Dependencies:**
   - Navigate to the backend folder and install dependencies:
     ```bash
     cd backend
     npm install
     ```
   - Navigate to the frontend folder and install dependencies:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Set Up Environment Variables:**
   - In the `backend` folder, create a `.env` file and add:
     ```env
     MONGO_URI=<your-mongodb-uri>
     API_PORT=<your-api-port>
     SOCKET_PORT=<your-socket-port>
     FRONTEND_URL=<your-frontend-url>
     GOOGLE_CLIENT_ID=<your-google-client-id>
     GOOGLE_CLIENT_SECRET=<your-google-client-secret>
     ```
   - In the `frontend` folder, create a `.env` file and add:
     ```env
     VITE_SOCKET_SERVER_URL=<your-socket-server-url>
     VITE_API_SERVER_URL=<your-api-server-url>
     ```

4. **Run the Application:**
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend development server:
     ```bash
     cd ../frontend
     npm run dev
     ```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

---


