# DEVGRAPH — Developer Intelligence Platform

DEVGRAPH is a graph-based developer intelligence platform built with React, NestJS, and CognoDB using the Neo4j driver. It models relationships between developers, skills, technologies, projects, and job opportunities to enable developer discovery, graph exploration, and intelligent job matching through Cypher-based graph queries.

**Live Demo:** [Frontend Link]  
**GitHub Repository:** [Your Repo Link]

---

## 🎯 Use Case

DEVGRAPH solves the developer discovery and job matching problem by building a knowledge graph of:
- **Developers** with profiles and experience
- **Skills** and technologies developers possess
- **Projects** developers have worked on
- **Job opportunities** looking for specific skill combinations

The platform enables:
1. **Developer Discovery**: Find developers with specific skill sets and experience
2. **Profile Exploration**: Deep dive into a developer's background, projects, and connections
3. **Intelligent Job Matching**: Match job openings to the best-fit developers based on multi-dimensional criteria
4. **Skills Analysis**: Identify skill trends, gaps, and connections across the developer community

---

## 💡 Why a Graph Database?

### The Graph Database Advantage

A relational database would struggle with DEVGRAPH's core queries:

**Problem 1: Complex Relationship Queries**
- *Question:* "Find developers who have worked on projects using similar technologies to a job opening"
- *Relational:* Requires 5-6 table joins with complex GROUP BY logic
- *Graph:* Single multi-hop traversal with clear relationship semantics

**Problem 2: Discovering Hidden Connections**
- *Question:* "Show me developers connected through shared skills, projects, and technologies"
- *Relational:* Expensive cross-joins and subqueries
- *Graph:* Native relationship traversal; queries read like the problem statement

**Problem 3: Real-time Relationship Analysis**
- *Question:* "Which skills connect developers to available opportunities?"
- *Relational:* Requires expensive analytical queries
- *Graph:* Instant traversal and recommendation generation

**Graph Benefits Applied:**
✅ Relationship queries are **first-class** operations (not afterthoughts)  
✅ **Multi-hop traversals** are efficient and intuitive  
✅ **Recommendation engines** naturally fall out of graph patterns  
✅ **Connection patterns** are explicit in schema and queries  

---

## 📊 Data Model

```
┌──────────────┐
│  Developer   │
└──────┬───────┘
       │
       ├─── HAS_SKILL ──→ [Skill]
       ├─── WORKED_ON ──→ [Project]
       │                     │
       │                     └─── USES_TECHNOLOGY ──→ [Technology]
       │
       └─── SEEKING_ROLE ──→ [Job]


[Job] ──REQUIRES_SKILL──→ [Skill]
      ──USES_TECHNOLOGY──→ [Technology]
```

### Node Types

| Node | Properties |
|------|------------|
| **Developer** | `id`, `name`, `email`, `bio`, `yearsExperience`, `createdAt` |
| **Skill** | `id`, `name`, `category`, `proficiencyLevel` |
| **Project** | `id`, `title`, `description`, `duration`, `year` |
| **Technology** | `id`, `name`, `category`, `popularityScore` |
| **Job** | `id`, `title`, `description`, `salary`, `location`, `level`, `postedAt` |

### Relationship Types

| Relationship | Source | Target | Properties |
|---|---|---|---|
| **HAS_SKILL** | Developer | Skill | `yearsOfExperience`, `proficiency` |
| **WORKED_ON** | Developer | Project | `role`, `startDate`, `endDate` |
| **USES_TECHNOLOGY** | Project | Technology | `percentage` |
| **REQUIRES_SKILL** | Job | Skill | `required` (boolean) |
| **USES_TECHNOLOGY** | Job | Technology | `essential` (boolean) |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- CognoDB Cloud account (free tier)

### 1. Set Up CognoDB

1. Sign up at [console.cognodb.com](https://console.cognodb.com/signup)
2. Create a free (c0) instance
3. Copy your connection URI and password
4. Keep them safe — you'll need them in step 3

### 2. Clone the Repository

```bash
git clone <your-repo-url>
cd devgraph
```

### 3. Backend Setup

```bash
cd backend
pnpm install

# Create .env file with your CognoDB credentials
cat > .env << EOF
COGNO_URI=bolt+s://<your-instance-id>.databases.cognodb.cloud
COGNO_USER=cognodb
COGNO_PASSWORD=<your-password>
PORT=3000
FRONTEND_URL=http://localhost:5173
EOF

# Load seed data
pnpm run seed

# Start the server
pnpm run start
```

### 4. Frontend Setup

```bash
cd frontend
pnpm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:3000
EOF

# Start dev server
pnpm run dev
```

### 5. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

---

## 🔍 Key Cypher Queries

### Query 1: Multi-Hop Traversal — Find Developers by Skill Match

```cypher
MATCH (job:Job {id: $jobId})-[:REQUIRES_SKILL]->(skill:Skill)
MATCH (dev:Developer)-[:HAS_SKILL]->(skill)
RETURN dev, 
       COUNT(skill) as skillMatches, 
       COLLECT(skill.name) as matchedSkills
ORDER BY skillMatches DESC
LIMIT 10
```

**Why Multi-hop?** Traverses: Job → Skills → Developers (2 hops)

---

### Query 2: Complex Relationship Query — Skills Connected to Opportunities

```cypher
MATCH (dev:Developer)-[:HAS_SKILL]->(skill:Skill),
      (job:Job)-[:REQUIRES_SKILL]->(skill)
WHERE dev.id = $developerId
RETURN job.title, 
       COLLECT(skill.name) as commonSkills,
       COUNT(skill) as matchCount
ORDER BY matchCount DESC
```

**Relational Challenge:** Requires multiple joins (Developer → Skills → Jobs)  
**Graph Advantage:** Single pattern-match query expressing natural relationships

---

### Query 3: Hidden Connections — Developers Connected Through Projects

```cypher
MATCH (dev1:Developer {id: $dev1Id})-[:WORKED_ON]->(project:Project)
      <-[:WORKED_ON]-(dev2:Developer)
WHERE dev1 <> dev2
RETURN dev2.name, 
       project.title,
       COUNT(*) as sharedProjects
ORDER BY sharedProjects DESC
```

**Why Graph?** Direct relationship traversal; relational would need complex joins

---

### Query 4: Recommendation Engine — Multi-Criteria Job Matching

```cypher
MATCH (dev:Developer {id: $devId})-[:HAS_SKILL]->(skill:Skill),
      (job:Job)-[:REQUIRES_SKILL]->(skill)
OPTIONAL MATCH (dev)-[:WORKED_ON]->(p:Project)-[:USES_TECHNOLOGY]->(tech:Technology),
               (job)-[:USES_TECHNOLOGY]->(tech)
RETURN job.title,
       job.salary,
       COUNT(DISTINCT skill) as skillMatches,
       COUNT(DISTINCT tech) as techMatches,
       (COUNT(DISTINCT skill) + COUNT(DISTINCT tech)) as totalScore
ORDER BY totalScore DESC
LIMIT 5
```

**Relational Equivalent:** Complex subqueries with multiple GROUP BY and WHERE clauses  
**Graph Advantage:** Clear, readable, and performant multi-criteria matching

---

## 🏗️ Project Structure

```
devgraph/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client service
│   │   └── App.tsx
│   ├── .env                 # Environment variables (NOT in git)
│   └── vercel.json          # Vercel SPA routing config
│
├── backend/                 # NestJS application
│   ├── src/
│   │   ├── app.module.ts    # Main application module
│   │   ├── main.ts          # Bootstrap & CORS config
│   │   ├── controllers/     # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── db/              # Database connection
│   │   │   └── neo4j.service.ts  # Neo4j driver
│   │   └── seeds/           # Data loading scripts
│   ├── .env                 # Environment variables (NOT in git)
│   ├── .env.example         # Template for environment variables
│   └── Cypher/              # Raw Cypher query files
│
└── README.md                # This file
```

---

## 🌐 Environment Variables

### Backend (.env)
```env
NEO4J_URI=bolt+s://<instance-id>.databases.cognodb.cloud
NEO4J_USER=cognodb
NEO4J_PASSWORD=<your-secure-password>
PORT=3000
FRONTEND_URL=https://graph-dev-frontend.vercel.app/
```

### Frontend (.env)
```env
VITE_API_URL=https://graph-dev-backend.vercel.app/
```

**Security:** Never commit `.env` files to Git. Use `.env.example` as a template.

---

## ✨ Features

- ✅ **Developer Profiles**: Explore developer backgrounds, skills, and experience
- ✅ **Skill Graph**: Visualize skill relationships and trends
- ✅ **Project Timeline**: Browse projects and technologies used
- ✅ **Job Matching**: Intelligent matching powered by graph relationships
- ✅ **Relationship Discovery**: Find connections between developers and opportunities
- ✅ **Error Handling**: Graceful fallbacks when database is unreachable
- ✅ **Loading States**: Clear indicators for data loading
- ✅ **Responsive Design**: Works on desktop and mobile

---

## 📸 Screenshots

[Add screenshots of:]
1. Developer discovery page
2. Developer profile with skill graph
3. Job matching results
4. Skill relationship visualization

---

## 🛠️ Tech Stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Frontend       | React, TypeScript, Tailwind CSS, Vite |
| Backend        | NestJS, TypeScript                    |
| Database       | CognoDB                               |
| Graph Driver   | Neo4j JavaScript Driver               |
| Query Language | Cypher                                |
| Deployment     | Vercel                                |


---

## 📝 How to Run Seed Data

The seed script creates sample developers, skills, projects, jobs, and relationships:

```bash
cd backend
pnpm run seed
```

This creates:
- 4 developers with varied backgrounds
- 10 skills across different categories
- 4 projects with technology stacks
- 3 job openings

---

## 🔗 Important Links

- **CognoDB Console**: https://console.cognodb.com
- **Neo4j Driver Docs**: https://neo4j.com/docs/driver-manual/current/
- **Cypher Manual**: https://neo4j.com/docs/cypher-manual/current/

---

## 📧 Submission

**Submitted to:** hr@wexa.ai  
**Subject:** CognoDB Assignment 2 – Ganiyu Olamide

**Includes:**
- GitHub repository URL
- Hosted demo link
- Screen recording of the application

---

## 🙏 Notes

- The application requires CognoDB to be running
- Keep your CognoDB instance active until feedback is received
- All credentials are read from environment variables and never committed to Git
- The application handles gracefully when the database is unreachable

---

## 📄 License

MIT