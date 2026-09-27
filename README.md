# Prathamesh Kadam — Portfolio & Resume

<p align="left">
  <a href="https://github.com/Pratham-1229/Portfolio/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="MIT License" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS v4" /></a>
</p>

A clean, minimalist personal portfolio and interactive resume website built with **Next.js 16 (App Router & Turbopack)**, **Tailwind CSS v4**, and **Motion**.

→ **GitHub Profile**: [@Pratham-1229](https://github.com/Pratham-1229)  
→ **Education**: Computer Engineering @ Pune Institute of Computer Technology (PICT)

---

## ⚡ Highlights & Features

- **Interactive Procedural Isometric Hero**: Real-time cursor-tracking isometric "PK" letter geometry generator with custom sound effects and haptic feedback.
- **Pixel-Art Brand Mark**: Custom vector pixelated "PK" header logo inspired by retro computing aesthetics.
- **Command Palette (`⌘K` / `Ctrl+K`)**: Fast keyboard-first navigation and quick action launcher.
- **GitHub Contribution Graph**: Live visual contribution heatmap and statistics.
- **Dark & Light Mode**: Seamless theme switching with persistent user preference.
- **Curated Sections**:
  - **Stack**: Core technologies, frameworks, tools, and languages (C++, Python, TypeScript, FastAPI, Docker, etc.).
  - **Experience & Leadership**: Technical roles, student leadership, and volunteering.
  - **Education**: Coursework, credentials, and achievements at PICT.
  - **Projects**: Highlights of systems engineering, AI/ML, and scalable web apps.
  - **Recognition**: Hackathon achievements and competitive milestones.
- **SEO & AI-Ready**: Complete OpenGraph meta tags, JSON-LD structured schema, dynamic sitemap, and [/llms.txt](https://llmstxt.org) endpoint.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Animations**: [Motion](https://motion.dev) (Framer Motion)
- **Components**: [Base UI](https://base-ui.com) & custom UI primitives
- **Icons**: [Lucide React](https://lucide.dev)
- **Package Manager**: [pnpm](https://pnpm.io)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or later
- **pnpm**: `v9.x` or later (`npm install -g pnpm`)

### 1. Clone the repository

```bash
git clone https://github.com/Pratham-1229/Portfolio.git
cd Portfolio
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment configuration

Copy the sample environment file:

```bash
cp .env.example .env.local
```

Configure any optional keys inside `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL=https://github-contributions-api.jogruber.de/v4
# GITHUB_API_TOKEN=your_token_here (optional, for star count rate limits)
```

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your site.

---

## 📦 Building for Production

To test the production build locally:

```bash
pnpm build
pnpm start
```

---

## ☁️ Deployment (Vercel)

The easiest way to deploy this portfolio is using [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `Portfolio` repository.
4. Set framework to **Next.js** (detected automatically).
5. Add any environment variables from `.env.local` in the project settings.
6. Click **Deploy**.

---

## 📄 License & Attribution

This project is open-source under the [MIT License](./LICENSE).

Built upon the portfolio template by [Nguyễn Chánh Đại](https://github.com/ncdai/chanhdai.com), customized and personalized with original branding, content, and geometry for **Prathamesh Kadam**.
