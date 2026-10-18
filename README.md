# Frontal Smile Assessment — Standalone Analytics Dashboard

This folder contains a **completely self-contained, standalone web analytics dashboard** designed for Dr. Nehmedo's Frontal Smile Assessment study.

It connects **directly to your Google Spreadsheet** in real time, computes all totals and demographics, and provides **dedicated curvature charts for each of the 6 click-to-rate ranking questions (Q1 to Q6)**.

---

## 📁 What's Inside This Folder?

- `index.html` — The main dashboard page with KPI cards, separate curvature charts for questions 1–6, demographics, and data tables.
- `style.css` — Modern, separated CSS styling with responsive design, glassmorphism, and dark/light modes.
- `app.js` — Client-side application logic that syncs with Google Sheets, calculates metrics, and renders interactive Chart.js graphs.
- `photos/` — Complete local directory of all smile photos (0mm to 3mm exposures, green & red levels) so the dashboard works anywhere without broken image links.

---

## 🌐 How to Publish This Anywhere

Because this folder is **100% self-contained** (pure HTML, CSS, JavaScript, and images), you can take this entire folder and publish it in seconds to any platform:

### Option 1: GitHub Pages (Free)
1. Push this folder to a GitHub repository.
2. Go to **Settings** > **Pages** in GitHub.
3. Select the branch and folder (root or `/docs`), and click **Save**.
4. Your live dashboard is immediately accessible online with HTTPS!

### Option 2: Netlify (Drag & Drop in 10 Seconds)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this `analytics-dashboard` folder into the browser.
3. Done! Netlify gives you an instant live URL.

### Option 3: Vercel / Cloudflare Pages / Shared Web Host
- Upload or deploy the folder as a static website to Vercel, Cloudflare Pages, cPanel/Apache, or AWS S3.

### Option 4: Local Offline / On Your Laptop
- Simply **double-click `index.html`** in your file manager to open it in Chrome, Edge, Safari, or Firefox!

---

## 📊 Connecting with Your Google Spreadsheet

The dashboard connects to your Google Sheet:
- **Sheet ID**: `1luj9ZvFhZI52_0mHeZ2dlhcVBt0gU0dZy71yWF35R8A`
- **Target Tab**: `Responses`

### Ensuring Google Sheets Allows Public Sync:
1. Open your Google Spreadsheet:
   `https://docs.google.com/spreadsheets/d/1luj9ZvFhZI52_0mHeZ2dlhcVBt0gU0dZy71yWF35R8A/edit`
2. Click the green **Share** button in the top right.
3. Under **General access**, make sure it is set to **"Anyone with the link"** as **"Viewer"**.
4. That's it! The dashboard uses Google's official Visualization API to pull live rows directly with CORS enabled.

### Changing the Sheet ID
- You can change the Sheet ID at any time by clicking the **"Sheet Settings"** button in the top header of the dashboard, pasting your new Google Sheet ID, and clicking **Connect Sheet**. The ID is saved automatically in your browser's local storage.

---

## 📈 Curvature Question Charts (Questions 1 to 6)

The dashboard organizes each of the 6 click-to-rate ranking questions separately:
- **Q1**: Straight Curvature (Green Gingival Margin Exposure: 0mm, 1mm, 2mm, 3mm)
- **Q2**: Slight Curvature (Green Gingival Margin Exposure: 0mm, 1mm, 2mm, 3mm)
- **Q3**: Reverse / Banana Curvature (Green Gingival Margin Exposure: 0mm, 1mm, 2mm, 3mm)
- **Q4**: Straight Curvature (Upper Lip Line Red Exposure: 0mm, 1mm, 2mm, 3mm)
- **Q5**: Slight Curvature (Upper Lip Line Red Exposure: 0mm, 1mm, 2mm, 3mm)
- **Q6**: Reverse / Banana Curvature (Upper Lip Line Red Exposure: 0mm, 1mm, 2mm, 3mm)

Each question shows:
- **Rank Distribution Chart** (1st, 2nd, 3rd, and 4th preference breakdown)
- **Profession Perception Comparison** (Orthodontists vs Dentists vs Non-Dental)
- **Visual Photo Cards** with winner badges, average rank, and % 1st choice votes.
