# ⚖️ Due Process AI

**Due Process AI** is a powerful, AI-driven legal assistant designed to help everyday people understand their legal rights, generate court filings, and manage legal cases without needing a lawyer. The platform uses OpenAI and OCR technologies to analyze evidence, draft documents, and guide users through complex legal processes—making access to justice faster, smarter, and more affordable.

---

## 📦 Features

- 🔐 **User Authentication & Roles**
  - Role-based access: General User, Paralegal, Admin
  - Subscription tiers: Free, Trial, Premium

- 📁 **Case Management**
  - Start and track legal cases
  - Input key details (plaintiff/defendant, violations, etc.)
  - Generate downloadable case bundles

- 📤 **Evidence Upload**
  - Supports PDF, image, video, and audio files
  - OCR & AI-powered evidence interpretation
  - Automatically tied to each case

- 🧠 **Due Process Analyzer (AI)**
  - AI chatbot powered by Azure OpenAI
  - Suggests legal strategies
  - Flags procedural errors
  - Summarizes legal violations

- 📄 **Smart Document Generator**
  - Auto-generates legal filings:
    - §1983 Complaints
    - Motions to Quash
    - Civil Cover Sheets, etc.
  - PDF export

- 🧰 **Filing Toolkit**
  - Court & form dropdowns (state > court > form)
  - Deadline calculator
  - Upload + Generate filing bundles
  - AI auto-fills legal forms

- 📊 **Case Summary Dashboard**
  - Timeline view
  - Download all documents + evidence
  - Export case as CSV or PDF

---

## 🚀 Live Demo / Deployment

You can deploy this app using **Render** or **Heroku**. It includes a `Procfile` and `requirements.txt` for simple Python web deployment.

---

## 🔧 Installation

To run locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/due-process-ai.git
cd due-process-ai

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
