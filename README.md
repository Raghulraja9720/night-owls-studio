# NightOwls — Digital Flagship & Web Engineering Collective

A modern, high-performance React web application built with **Vite**, **React 18**, **Lucide React**, and bespoke CSS design tokens.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## 🚀 Push to GitHub

To push this project to your GitHub repository:

```bash
# Initialize git if not already initialized
git init

# Add all files to staging
git add .

# Commit your changes
git commit -m "feat: complete NightOwls React website with Call Now button and WhatsApp integration"

# Rename branch to main
git branch -M main

# Add your remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/Raghulraja9720/night-owls-website.git

# Push to GitHub
git push -u origin main --force
```

---

## 🌐 Deploy to Vercel

### Option 1: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New…** → **Project**.
3. Import your repository (`night-owls-website`).
4. Vercel automatically detects:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your site will be live on a fast global edge network in seconds!

### Option 2: Via Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts (press Enter for defaults), then run `npx vercel --prod` for production.

---

## 📧 How to Setup EmailJS (Receive Inquiries to Gmail)

1. **Sign Up**: Create a free account at [emailjs.com](https://www.emailjs.com/) (200 free emails/month).
2. **Add Email Service**:
   - In the EmailJS dashboard, go to **Email Services** → **Add New Service** → choose **Gmail**.
   - Connect your address: `contact.nightowls.team@gmail.com`.
   - Copy your **Service ID** (e.g. `service_xxxxxxx`).
3. **Create Email Template**:
   - Go to **Email Templates** → **Create New Template**.
   - Set Subject: `New Client Enquiry from {{fullName}} - NightOwls`
   - In the content body, use:
     ```text
     You have received a new inquiry on NightOwls:

     - Name: {{fullName}}
     - Email: {{email}}
     - Phone / WhatsApp: {{phone}}
     - Business / Website: {{businessName}}
     - Service Required: {{serviceRequired}}
     - Project Overview: {{message}}
     ```
   - Click **Save** and copy your **Template ID** (e.g. `template_xxxxxxx`).
4. **Get Public Key**:
   - Go to **Account** → **API Keys** → copy your **Public Key** (e.g. `user_xxxxxxx`).
5. **Add to Vercel or `.env`**:
   - In your `.env` file locally or in **Vercel Project Settings > Environment Variables**:
     ```env
     VITE_EMAILJS_SERVICE_ID=your_service_id
     VITE_EMAILJS_TEMPLATE_ID=your_template_id
     VITE_EMAILJS_PUBLIC_KEY=your_public_key
     ```

---

## 📞 Configuration
- **Direct Phone**: `+91 85318 07705` (`8531807705`)
- **Official Email**: `nightowlsstudio.info@gmail.com`
- **WhatsApp**: `+91 85318 07705`
