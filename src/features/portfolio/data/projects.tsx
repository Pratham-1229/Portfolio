import type { Project } from "@/features/portfolio/types/projects"

export const PROJECTS: Project[] = [
  {
    id: "gekko-compiler",
    title: "Gekko — C++ Compiler",
    period: {
      start: "08.2026",
      end: "09.2026",
    },
    skills: ["C++", "x86-64", "NASM", "Linux", "GitHub Actions"],
    description: `A compiler written in C++ that translates a custom C-style language into x86-64 assembly, assembled with NASM and linked with ld into standalone Linux ELF64 executables.

- Lexer, precedence-climbing parser producing an AST, and a stack-based code generator supporting variables, nested scopes, arithmetic, and if/elif/else control flow.
- Custom arena allocator (contiguous buffer, O(1) pointer-bump allocation, bulk free) for AST nodes, removing per-node malloc/free overhead and improving cache locality.
- Line-numbered diagnostics and scope tracking to catch syntax errors and undeclared identifiers; 5 automated unit and integration tests run on every push via GitHub Actions CI.`,
    isExpanded: true,
  },
  {
    id: "baymax-pharmacy",
    title: "BAYMAX — AI Pharmacy Assistant",
    period: {
      start: "02.2026",
      end: "03.2026",
    },
    skills: [
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "LangGraph",
      "Pinecone",
      "Twilio",
      "RAG",
    ],
    description: `Backend REST APIs in FastAPI backed by PostgreSQL and Redis, serving patients across web, WhatsApp, SMS, and voice channels (via Twilio) with JWT-based authentication.

- Integrated Twilio to deliver SMS and WhatsApp messaging channels for patient communication and reminders.
- LLM-powered agentic clinical engine using LangGraph for symptom triage, drug-safety checks, prescription guidance, and follow-up question generation, with RAG retrieval via Pinecone.
- Prescription OCR, medication reminders, adherence tracking, vital logging, FDA recall monitoring, controlled-drug abuse prevention, and admin dashboards.`,
    isExpanded: true,
  },
  {
    id: "pneumonia-detection",
    title: "AI-Based Pneumonia Detection System",
    period: {
      start: "01.2025",
      end: "05.2025",
    },
    skills: ["Python", "DenseNet201", "CNN", "Deep Learning"],
    description: `Trained and optimized a DenseNet201 CNN for pneumonia detection from chest X-rays, achieving 90% accuracy.

- Built a responsive web interface for X-ray upload and real-time prediction, integrating the model to support healthcare professionals in low-resource settings.`,
    isExpanded: true,
  },
]
