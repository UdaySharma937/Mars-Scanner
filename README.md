<p align="center">
  <h1 align="center">FilteristicWeb</h1>
  <p align="center">Aggressive Subdomain & Directory Scanner for Bug Bounty & Pentesting</p>
  <p align="center">
    <img src="https://img.shields.io/badge/Status-Active-brightgreen" />
    <img src="https://img.shields.io/badge/Wordlist-1M+-blue" />
    <img src="https://img.shields.io/badge/Tech-FastAPI%20%2B%20React-orange" />
  </p>
</p>

---

### 🚀 About FilteristicWeb

**FilteristicWeb** is a powerful, open-source web scanner built for Bug Bounty Hunters, Penetration Testers, and Cybersecurity Researchers.

It helps you find hidden `subdomains` and `directories` from any target domain to map the complete attack surface. With 1,000,000+ auto-generated wordlists and recursive scanning, you can discover admin panels, APIs, backup files, and forgotten assets in minutes.

No paid tools. No manual wordlist downloads. 100% Free to deploy.

### ✨ Key Features

-  **Dual Scanner Engine**  
  Separate tabs for `Subdomain Scanner` and `Directory Scanner` for better workflow.
-  **1,000,000+ Wordlist**  
  Auto-generates 500k Subdomains + 500k Directories on first run. No setup needed.
-  **Recursive Scanning**  
  Goes 1 level deep. If `/admin` is found, it scans `/admin/login` automatically.
-  **Blazing Fast**  
 150 concurrent async requests with Python `aiohttp` and `asyncio`.
-  **Live Results & Filters**  
  Filter by status codes: `200`, `301`, `403`. Search and sort in real-time.
-  **One-Click Export**  
  Download your results as `TXT`, `CSV`, or `PDF` report instantly.
-  **Modern UI**  
  Clean, dark, mobile-responsive dashboard built with React + TailwindCSS.
-  **Free Hosting**  
  Deploy in 5 minutes on `Vercel` Frontend + `Render` Backend.

### 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Backend** | Python, FastAPI, aiohttp, asyncio, aiodns |
| **Frontend** | React 18, Vite, TailwindCSS, shadcn/ui, Axios |
| **Export** | jsPDF, jsPDF-AutoTable |
| **Deployment** | Vercel, Render |

### ⚡ Quick Start - Deploy in 5 Minutes

#### 1. Clone & Setup
```bash
git clone https://github.com/your-username/filteristicweb
cd filteristicweb
