# ⚡ ZenCode — AI-Powered Coding Platform

ZenCode is a full-stack coding platform designed to make problem-solving more interactive through AI-powered assistance, automated code evaluation, video editorials, and real-time 1v1 coding battles.

Solve coding problems, get AI-generated hints and explanations, debug your code, and compete with other developers in live coding challenges.

## 🚀 Features

### 💻 Coding Practice & Problem Management
- Browse coding problems categorized by difficulty and topic.
- View problem descriptions, constraints, and test cases.
- Write and edit code using an interactive coding editor.
- Submit solutions and track submission results.
- Support for multiple programming languages through Judge0.

### ⚔️ Real-Time 1v1 Coding Battles
- **Live Coding Battles:** Compete against another user in real-time coding challenges.
- **Room-Based Battles:** Join a battle using a unique room code.
- **Real-Time Communication:** Use Socket.IO to manage battle rooms and synchronize battle events.
- **Automated Code Execution:** Execute submitted solutions through Judge0.
- **Submission Evaluation:** Evaluate solutions against test cases and process execution results.
- **Competitive Experience:** Solve coding problems head-to-head and compare your progress with your opponent.

### 🤖 AI-Powered Coding Assistant
- **AI Hints:** Get hints to approach a problem without immediately revealing the complete solution.
- **Code Explanations:** Understand algorithms, logic, and implementation details.
- **Debugging Assistance:** Identify potential errors and receive suggestions to improve your code.
- **Learning Support:** Use AI assistance to understand problems and improve problem-solving skills.

Powered by the Gemini API.

### ⚙️ Automated Code Execution
- Integrate Judge0 for multi-language code compilation and execution.
- Evaluate solutions against test cases.
- Process code submissions asynchronously using BullMQ and Redis.
- Separate submission processing from the main request-handling flow.
- Retrieve execution results and handle submission statuses.

### 🎥 Video Editorials
- Access video-based explanations for coding problems.
- Understand problem-solving approaches and algorithmic concepts.
- Supplement coding practice with visual learning resources.

### 🔐 Authentication & Admin Features
- Secure user authentication using JWT.
- Protected routes and authenticated API access.
- Administrative functionality for managing coding problems.
- Support for creating and maintaining problem descriptions, test cases, and reference solutions.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5 and CSS3
- Interactive code editor

### Backend
- Node.js
- Express.js
- RESTful APIs
- JSON Web Tokens (JWT)

### Database & Background Processing
- MongoDB
- Redis
- BullMQ

### Code Execution & Real-Time Communication
- Judge0 API
- Socket.IO

### Artificial Intelligence
- Google Gemini API

---

## 🏗️ System Architecture

ZenCode uses a modular architecture to handle API requests, code execution, AI assistance, and real-time coding battles.

### Asynchronous Code Execution

```text
          User submits code
                  |
                  v
          Express API Server
                  |
                  v
          Create submission
                  |
                  v
             BullMQ Queue
                  |
                  v
           Redis Backend
                  |
                  v
          Background Worker
                  |
                  v
              Judge0 API
                  |
                  v
       Execution and Test Results
                  |
                  v
         Update Submission Status
                  |
                  v
         Return Results to User
```

The background-processing flow helps keep code execution separate from the main API request lifecycle and supports more scalable submission handling.

### Real-Time Coding Battles

```text
             User A
                |
                v
         React Frontend
                |
                v
            Socket.IO
                |
                v
         Battle Room Server
                |
                v
        Shared Battle Events
                |
                v
             User B
```

During a battle, Socket.IO manages real-time communication and room participation. Code submissions are evaluated through Judge0, and the resulting execution data supports the competitive coding experience.

---

## 🔄 How It Works

### 1. Coding Practice
Users browse problems, review constraints and examples, and implement solutions in the coding editor.

### 2. Code Submission
When a user submits code, the backend creates a submission and processes it through the code execution pipeline.

### 3. Automated Evaluation
Judge0 compiles and executes the code. The platform processes the execution result and evaluates the submission against the relevant test cases.

### 4. AI Assistance
Users can request hints, explanations, or debugging assistance through the Gemini API.

### 5. Real-Time Battles
Users join a battle room and compete in coding challenges. Socket.IO handles real-time battle communication, while Judge0 executes submitted solutions.

### 6. Learning & Improvement
Users can review coding problems, examine their submission results, and learn from video editorials and AI-powered explanations.

---

## 📁 Project Structure

The project contains frontend and backend components. The exact directory names may vary depending on the current repository structure.

```text
ZenCode/
├── frontend/          # React application
├── backend/           # Node.js and Express server
│   ├── controllers/   # Request handling and business logic
│   ├── models/        # MongoDB data models
│   ├── routes/        # REST API routes
│   ├── middleware/    # Authentication and request middleware
│   ├── workers/       # Background submission processing
│   └── config/        # Database and service configuration
├── README.md
└── .gitignore
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed or configured:

- Node.js and npm
- MongoDB
- Redis
- A Judge0 API endpoint and credentials, if required by your provider
- A Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/shivam20234158/Zencode.git
cd Zencode
```

### 2. Install Dependencies

Navigate to the frontend and backend directories and install their dependencies.

```bash
cd frontend
npm install
```

```bash
cd ../backend
npm install
```

Adjust these directory names if your repository uses a different structure.

### 3. Configure Environment Variables

Create the appropriate `.env` files based on the configuration used by your frontend and backend.

Example configuration:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_connection_url
JUDGE0_API_URL=your_judge0_api_url
JUDGE0_API_KEY=your_judge0_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Use the exact variable names expected by your application. Some services may not require API keys, depending on their configuration.

**Important:** Never commit your `.env` files, API keys, database credentials, or JWT secrets to GitHub.

### 4. Start the Application

Start the backend using the script defined in its `package.json`. For example:

```bash
npm run dev
```

Start the frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

If BullMQ workers run as a separate process in your implementation, start the worker using its configured script as well.

Make sure MongoDB and Redis are accessible before testing the application.

---

## 🔑 Key Technologies & Their Roles

| Technology | Purpose |
|---|---|
| React.js | Interactive user interface and coding experience |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API development |
| MongoDB | Persistent application data |
| JWT | Authentication and protected access |
| Judge0 | Multi-language code execution |
| BullMQ | Asynchronous job processing |
| Redis | Queue infrastructure and supporting backend operations |
| Socket.IO | Real-time communication for coding battles |
| Gemini API | AI-powered hints, explanations, and debugging assistance |

---

## 🎯 Project Objectives

- Make coding practice more interactive and engaging.
- Provide AI-powered assistance for learning and debugging.
- Support automated code evaluation across multiple languages.
- Enable real-time competitive programming through 1v1 battles.
- Improve backend responsiveness through asynchronous processing.
- Combine problem-solving, competition, and guided learning in one platform.

## 🔮 Future Improvements

- ELO-based ratings and competitive leaderboards.
- Random matchmaking and ranked battle queues.
- Battle history and detailed performance statistics.
- More advanced AI-generated test cases and hints.
- Improved submission analytics and execution feedback.
- Enhanced scaling and monitoring for background workers.

## 👨‍💻 Author

**Shivam Panwar**
**Raunak Singh**

- GitHub: [@shivam20234158](https://github.com/shivam20234158)
- Project Repository: [ZenCode](https://github.com/shivam20234158/Zencode)

---

If you find ZenCode interesting, consider giving the repository a ⭐ on GitHub!
