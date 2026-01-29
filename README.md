# 🤖 Multi-Agent Production Job Optimizer

> **AI-Powered Pharmaceutical Manufacturing Scheduler** using LangChain, LangGraph & Groq LLMs

A sophisticated multi-agent system that optimizes production job scheduling across manufacturing machines using coordinated AI agents. Built with **LangGraph orchestration**, **Groq's Llama models**, and **FastAPI + React**, this system intelligently handles complex constraints like rush orders, machine downtime, setup times, and shift patterns.

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Agent Roles](#-agent-roles)
- [How It Works](#-how-it-works)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Capabilities
- **Multi-Agent Coordination**: 4 specialized AI agents working together via LangGraph orchestration
- **Supervisor Intelligence**: Autonomous decision-making that selects optimal schedules using weighted KPI analysis
- **Real-time Optimization**: Handles dynamic constraints (rush orders, machine failures, downtime windows)
- **Explainable AI**: Generates executive-level explanations for scheduling decisions
- **Comparative Analysis**: Run and compare multiple scheduling strategies side-by-side

### 📊 Optimization Strategies
1. **Baseline (FCFS)**: Simple First-Come-First-Serve scheduling
2. **Batching Agent**: AI-powered setup time minimization through intelligent job grouping
3. **Bottleneck Agent**: Load balancing across machines to eliminate production bottlenecks
4. **Orchestrated Mode**: Supervisor Agent coordinates all strategies and selects the best outcome

### 🔍 Key Metrics Tracked
- Total Tardiness (deadline adherence)
- Setup Time & Product Switches
- Machine Utilization & Load Balance
- Makespan (total production time)
- Constraint Violations
- Weighted Efficiency Score

### 🎨 User Interface
- Interactive Gantt Chart visualization
- Job Allocation Tables
- KPI Dashboard with real-time metrics
- Constraint Violation Reports
- AI-generated explanations
- CSV upload/download support
- Machine failure simulation

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
│  Job Input | Downtime Panel | Optimization Controls | Dashboard │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTP REST API
┌────────────────────────────▼─────────────────────────────────────┐
│                    FASTAPI BACKEND (Port 8000)                   │
│         /api/optimize/* | /api/data/* | /api/simulate/*         │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│              ORCHESTRATOR + SUPERVISOR AGENT                     │
│   • Coordinates specialist agents (parallel execution)          │
│   • Validates schedules via Constraint Agent                    │
│   • Scores & ranks using weighted KPIs                          │
│   • Generates LLM explanations (Groq llama-3.3-70b)            │
└────┬────────────────┬────────────────┬──────────────────────────┘
     │                │                │
     ▼                ▼                ▼
┌─────────┐    ┌──────────┐    ┌─────────────┐
│ BASELINE│    │ BATCHING │    │ BOTTLENECK  │
│  Agent  │    │  Agent   │    │   Agent     │
│ (Rule)  │    │  (LLM)   │    │   (LLM)     │
└────┬────┘    └────┬─────┘    └──────┬──────┘
     │              │                  │
     └──────────────┴──────────────────┘
                    │
            ┌───────▼────────┐
            │  CONSTRAINT    │
            │     AGENT      │
            │  (Validator)   │
            └────────────────┘
```

**Key Components:**
- **Orchestrator**: Manages workflow, delegates tasks, consolidates results
- **Supervisor Logic**: Integrated decision-making and schedule selection
- **Specialist Agents**: Batching (setup optimization), Bottleneck (load balancing), Baseline (FCFS)
- **Constraint Agent**: Validates against shift times, downtimes, priorities, machine compatibility
- **KPI Calculator**: Computes tardiness, setup time, balance variance, weighted scores

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **AI Orchestration**: LangChain + LangGraph
- **LLM Provider**: Groq API (llama-3.3-70b-versatile, llama-3.1-8b-instant)
- **Validation**: Pydantic v2
- **Tracing**: LangSmith (optional observability)

### Frontend
- **Framework**: React 19 + Vite
- **UI Components**: Custom components with Lucide icons
- **Charts**: Recharts for visualizations
- **HTTP Client**: Axios
- **Styling**: CSS3 with CSS Variables (dark/light theme support)

### Development Tools
- **Package Manager**: npm (frontend), pip (backend)
- **Hot Reload**: Uvicorn (backend), Vite (frontend)
- **API Testing**: FastAPI Swagger UI at `/docs`

---

## 📦 Prerequisites

Ensure you have the following installed:

- **Python**: 3.10 or higher
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Groq API Key**: Sign up at [https://console.groq.com](https://console.groq.com)
- **LangSmith API Key** (optional): For tracing - [https://smith.langchain.com](https://smith.langchain.com)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/multi-agent-job-optimizer.git
cd multi-agent-job-optimizer
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Create virtual environment (recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

#### Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Frontend Setup

#### Navigate to frontend directory
```bash
cd ../frontend
```

#### Install dependencies
```bash
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# REQUIRED: Groq API Key
GROQ_API_KEY=your_groq_api_key_here

# OPTIONAL: LangSmith Tracing (for debugging/monitoring)
LANGSMITH_API_KEY=your_langsmith_api_key_here
LANGSMITH_PROJECT=multi-agent-job-optimizer
LANGCHAIN_TRACING_V2=true

# MODEL CONFIGURATION (already set in config.py, but can override)
# MODEL_NAME=llama-3.3-70b-versatile
# FAST_MODEL_NAME=llama-3.1-8b-instant
```

**Getting API Keys:**
1. **Groq API Key**: 
   - Sign up at [https://console.groq.com](https://console.groq.com)
   - Navigate to API Keys section
   - Create new key and copy it

2. **LangSmith API Key** (optional):
   - Sign up at [https://smith.langchain.com](https://smith.langchain.com)
   - Create new API key in settings

### Frontend Configuration

The frontend is pre-configured to connect to `http://localhost:8000/api`. If you need to change this:

Edit `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

---

## 🎮 Running the Application

### Method 1: Manual Start (Recommended for Development)

#### Terminal 1 - Start Backend
```bash
cd backend
python main.py
```
Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using StatReload
```

#### Terminal 2 - Start Frontend
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Method 2: Using PowerShell (Windows)

```powershell
# Start Backend (in one terminal)
Set-Location "path\to\backend"
python main.py

# Start Frontend (in another terminal)
Set-Location "path\to\frontend"
npm run dev
```

### Access the Application

Once both servers are running:
- **Frontend UI**: http://localhost:5173 (or 5174 if 5173 is occupied)
- **Backend API Docs**: http://localhost:8000/docs (Swagger UI)
- **API Root**: http://localhost:8000/api

---

## 📖 Usage Guide

### Step 1: Generate or Upload Data

#### Option A: Generate Random Data
1. Click **"Generate Random Data"** button
2. Adjust parameters (job count, rush probability, downtime count)
3. System generates sample pharmaceutical production jobs

#### Option B: Upload CSV Files
1. Prepare CSV files following the format in `sample_jobs.csv` and `sample_downtime.csv`
2. Click **"Upload Jobs CSV"** 
3. Click **"Upload Downtime CSV"** (optional)

**Job CSV Format:**
```csv
job_id,product_type,machine_options,processing_time,due_time,priority
J001,Tablet_A,"M1,M2",45,14:30,Normal
J002,Capsule_B,"M2,M3",60,12:00,Rush
```

**Downtime CSV Format:**
```csv
machine_id,start_time,end_time,reason
M1,10:00,11:00,Planned Maintenance
M3,14:00,15:30,Calibration
```

### Step 2: Run Optimization

Click one of the optimization strategies:

1. **Baseline (FCFS)**: Quick, rule-based scheduling
2. **Batching (AI)**: LLM-optimized setup reduction
3. **Bottleneck (AI)**: LLM-optimized load balancing
4. **Orchestrated**: Supervisor selects best strategy automatically
5. **Compare All**: Runs all 4 and shows side-by-side comparison

### Step 3: Review Results

The dashboard displays:
- **Gantt Chart**: Visual timeline of job assignments per machine
- **Job Allocation Table**: Detailed schedule with start/end times
- **KPI Summary**: Metrics cards showing performance indicators
- **Explanation Panel**: AI-generated reasoning for decisions
- **Violation Report**: Any constraint breaches (should be zero for valid schedules)

### Step 4: Simulate Failures (Optional)

1. Click **"Simulate Failure"** button
2. Select a machine and downtime window
3. System re-optimizes schedule around the failure
4. Compare before/after metrics

---

## 🔌 API Documentation

### Data Endpoints

#### Generate Random Data
```http
POST /api/data/generate-random?job_count=20&rush_prob=0.2&downtime_count=0&machine_count=4
```

#### Upload Jobs CSV
```http
POST /api/data/upload-jobs
Content-Type: multipart/form-data
Body: file=jobs.csv
```

#### Upload Downtime CSV
```http
POST /api/data/upload-downtime
Content-Type: multipart/form-data
Body: file=downtime.csv
```

### Optimization Endpoints

#### Run Baseline Optimization
```http
POST /api/optimize/baseline
Content-Type: application/json

{
  "jobs": [...],
  "downtimes": [...],
  "shift": {"start_time": "08:00", "end_time": "16:00"}
}
```

#### Run Batching Optimization
```http
POST /api/optimize/batching
```

#### Run Bottleneck Optimization
```http
POST /api/optimize/bottleneck
```

#### Run Orchestrated (Supervisor Selection)
```http
POST /api/optimize/orchestrated
```

#### Compare All Strategies
```http
POST /api/optimize/compare-all
```

**Response Format (AgentResult):**
```json
{
  "agent_name": "Batching Agent",
  "schedules": {
    "M1": [{"job_id": "J001", "start_time": "08:00", "end_time": "08:45", ...}],
    "M2": [...]
  },
  "kpis": {
    "total_tardiness": 15,
    "total_setup_time": 30,
    "product_switches": 3,
    "score": 87.5,
    ...
  },
  "explanation": "As the Supervisor Agent, I have selected...",
  "violations": []
}
```

### Simulation Endpoints

#### Simulate Machine Failure
```http
POST /api/simulate/machine-failure?machine_id=M1
```

---

## 📁 Project Structure

```
Multi-agent-main/
│
├── backend/                          # FastAPI Backend
│   ├── agents/                       # Multi-agent system
│   │   ├── base_agent.py            # Abstract base class
│   │   ├── baseline_agent.py        # FCFS scheduler
│   │   ├── batching_agent.py        # Setup optimization (LLM)
│   │   ├── bottleneck_agent.py      # Load balancing (LLM)
│   │   ├── constraint_agent.py      # Validation logic
│   │   └── orchestrator.py          # Supervisor + Coordination
│   │
│   ├── models/                       # Data models & generators
│   │   ├── schemas.py               # Pydantic models
│   │   ├── job.py                   # Job entity
│   │   ├── machine.py               # Machine entity
│   │   └── data_generator.py       # Random data creation
│   │
│   ├── routes/                       # API endpoints
│   │   ├── data_routes.py           # Data upload/generation
│   │   ├── optimization_routes.py   # Agent execution
│   │   └── simulation_routes.py     # Failure simulation
│   │
│   ├── utils/                        # Helper modules
│   │   ├── kpi_calculator.py        # Metrics computation
│   │   ├── csv_handler.py           # CSV parsing
│   │   └── baseline_scheduler.py    # FCFS implementation
│   │
│   ├── config.py                     # Settings & environment
│   ├── main.py                       # FastAPI app entry
│   ├── requirements.txt              # Python dependencies
│   └── .env                          # API keys (create this)
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/              # UI components
│   │   │   ├── control/
│   │   │   │   └── OptimizationPanel.jsx
│   │   │   ├── input/
│   │   │   │   ├── JobInputPanel.jsx
│   │   │   │   └── DowntimePanel.jsx
│   │   │   └── output/
│   │   │       ├── GanttChart.jsx
│   │   │       ├── KPISummary.jsx
│   │   │       ├── ExplanationPanel.jsx
│   │   │       └── ComparisonTable.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Main application
│   │   │   └── ModeSelection.jsx    # Landing page
│   │   │
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   │
│   │   ├── App.jsx                  # Root component
│   │   └── main.jsx                 # Entry point
│   │
│   ├── package.json                  # npm dependencies
│   └── vite.config.js               # Vite configuration
│
├── agents-architecture.md            # Architecture documentation
├── concept-note.md                   # POC design document
├── sample_jobs.csv                   # Example job data
├── sample_downtime.csv              # Example downtime data
└── README.md                         # This file
```

---

## 🤖 Agent Roles

### 1. Supervisor Agent (Embedded in Orchestrator)
**Model**: Groq llama-3.3-70b-versatile  
**Temperature**: 0.2 (low for consistent decisions)

**Responsibilities:**
- Coordinates all specialist agents via parallel execution
- Validates candidate schedules using Constraint Agent
- Scores schedules using weighted KPI formula:
  ```
  final_score = kpi_score - (violations × 100)
  ```
- Selects best schedule (prioritizes zero violations)
- Generates executive-level explanations via LLM prompt

**Decision Criteria:**
1. ✅ Zero constraint violations (mandatory)
2. ✅ Minimum total tardiness (deadline adherence)
3. ✅ Balanced machine utilization
4. ✅ Fewer setup transitions

### 2. Batching & Setup Minimization Agent
**Model**: Groq llama-3.3-70b-versatile  
**Temperature**: 0.3

**Strategy:**
- Groups jobs by `product_type` to minimize changeovers
- Reduces setup time penalties (10 min per product switch)
- Uses LLM to optimize batching sequence

### 3. Bottleneck Relief Agent
**Model**: Groq llama-3.1-8b-instant (faster)  
**Temperature**: 0.4

**Strategy:**
- Detects machines with excessive load
- Redistributes jobs to underutilized machines
- Balances load variance across all machines

### 4. Baseline Agent (FCFS)
**Model**: Rule-based (no LLM)

**Strategy:**
- Simple First-Come-First-Serve scheduling
- Assigns jobs to first available compatible machine
- Provides baseline for comparison

### 5. Constraint Agent (Validator)
**Model**: Rule-based (no LLM)

**Validation Rules:**
- ❌ Jobs outside shift hours (08:00-16:00)
- ❌ Jobs during machine downtime windows
- ❌ Jobs assigned to incompatible machines
- ❌ Rush jobs not prioritized
- ❌ Invalid time overlaps

---

## 🔄 How It Works

### Optimization Flow (Orchestrated Mode)

```
1. User Input
   ↓
2. Frontend sends OptimizationRequest → FastAPI
   ↓
3. Orchestrator receives request
   ↓
4. Parallel Execution (asyncio.gather):
   ├─→ Baseline Agent → Schedule A
   ├─→ Batching Agent (LLM) → Schedule B
   └─→ Bottleneck Agent (LLM) → Schedule C
   ↓
5. Each schedule → KPI Calculator → Metrics
   ↓
6. Orchestrator → Constraint Agent → Validate A, B, C
   ↓
7. Supervisor Scoring:
   For each candidate:
     violation_penalty = violations × 100
     final_score = kpi_score - violation_penalty
   ↓
8. Select highest scoring candidate
   ↓
9. Generate LLM Explanation:
   "You are Supervisor Agent for Pharmaceutical Production..."
   ↓
10. Return AgentResult → Frontend
    ↓
11. Render Gantt Chart + KPIs + Explanation
```

### KPI Calculation Formula

```python
# Setup Time: 10 minutes per product type switch
total_setup_time = product_switches × 10

# Tardiness: Minutes late beyond due_time
total_tardiness = sum(max(0, end_time - due_time))

# Load Balance: Variance in machine utilization
variance = Σ(load - mean_load)² / machine_count

# Weighted Score (higher is better):
completion_bonus = (scheduled_jobs / total_jobs) × 40
tardiness_penalty = min(total_tardiness × 0.3, 30)
setup_penalty = min(total_setup_time × 0.2, 20)
balance_penalty = min(variance × 0.01, 10)

score = completion_bonus + 60 - penalties
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
python test_complete_system.py
```

### Manual API Testing
1. Start backend server
2. Navigate to http://localhost:8000/docs
3. Use Swagger UI to test endpoints interactively

### Frontend Testing
```bash
cd frontend
npm run lint
```

---

## 🐛 Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'langchain'`
```bash
# Solution: Install dependencies
pip install -r requirements.txt
```

**Issue**: `groq.error.AuthenticationError`
```bash
# Solution: Check .env file has valid GROQ_API_KEY
# Verify key at https://console.groq.com
```

**Issue**: Port 8000 already in use
```bash
# Solution: Kill existing process or change port in main.py
uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
```

### Frontend Issues

**Issue**: `Network Error` when calling API
```bash
# Solution 1: Ensure backend is running on port 8000
# Solution 2: Check CORS configuration in backend/main.py
# Solution 3: Verify API_BASE_URL in frontend/src/services/api.js
```

**Issue**: Port 5173 already in use
```bash
# The frontend will automatically try port 5174
# Or kill existing Vite process
```

### LangSmith Tracing Issues

If you don't want tracing:
```env
# In .env file, set:
LANGCHAIN_TRACING_V2=false
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Add docstrings to new functions/classes
- Update README.md for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **LangChain Team** for the amazing orchestration framework
- **Groq** for lightning-fast LLM inference
- **FastAPI** for the excellent web framework
- **React Team** for the UI library

---

## 📞 Support

For issues, questions, or feature requests:
- Open an [Issue](https://github.com/yourusername/multi-agent-job-optimizer/issues)
- Email: your.email@example.com
- Documentation: See `agents-architecture.md` and `concept-note.md`

---

## 🚀 Future Enhancements

- [ ] RAG integration for historical scheduling patterns
- [ ] Real-time WebSocket updates
- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] Multi-shift support (24/7 operations)
- [ ] Advanced visualizations (3D Gantt, heatmaps)
- [ ] Export to PDF/Excel reports
- [ ] User authentication & role-based access
- [ ] Mobile responsive design
- [ ] Docker containerization
- [ ] Kubernetes deployment manifests

---

**Built with ❤️ for Pharmaceutical Manufacturing Excellence**
