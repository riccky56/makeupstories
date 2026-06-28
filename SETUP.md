# Setup Guide — Makeup Stories by Riya

This package contains the full ad landing site plus tools to manage it.

## Files in this package

### Goes on the live website (upload all four):

| File | Purpose |
|---|---|
| `index.html` | The main landing page (what brides see when they click your ad) |
| `enquire.html` | The form page (where they fill in their details) |
| `thanks.html` | The confirmation page (shown after they submit the form) |
| `privacy.html` | The privacy policy (required by Meta & Google for ad approval) |

### Stays on your computer only — never upload these:

| File | Purpose |
|---|---|
| `riya-admin.html` | Image manager — change site photos and generate a new `index.html` |
| `apps-script.js` | Code that you'll paste into Google Sheets (one-time setup) |
| `SETUP.md` | This guide |

---

## Part A — Get the website live (one-time, ~30 minutes)

### Step 1 — Buy a domain on Hostinger

Search for your domain (e.g. `makeupstoriesbyriya.in`). The `.in` extension is fine and cheaper than `.com`. Skip the upsells at checkout (you don't need "Domain protection" or the AI website builder).

### Step 2 — Choose hosting

**Easiest:** Use Netlify's free hosting and point your Hostinger domain at it.

- Sign up at netlify.com (free)
- Drag the folder containing `index.html`, `enquire.html`, `thanks.html`, `privacy.html` onto `app.netlify.com/drop`
- Get a temporary `.netlify.app` URL — confirm everything works
- In Netlify: Site settings → Domain management → add your Hostinger domain
- In Hostinger hPanel: Domains → DNS → add the records Netlify shows you (or change nameservers to Netlify's)
- DNS takes 1-24 hours to propagate, then HTTPS turns on automatically

**Or just use Hostinger:** Get their Premium plan (~₹149-249/month). In hPanel → File Manager → upload all four files into `public_html/`. Enable SSL under hPanel → SSL → Install. Toggle Force HTTPS on.

### Step 3 — Set up the Google Sheet for enquiries

1. Open sheets.google.com → new blank sheet, name it "Makeup Stories Enquiries"
2. Extensions → Apps Script
3. Delete the placeholder code, paste in everything from `apps-script.js`
4. (Optional) Near the top, fill in `NOTIFY_EMAIL` to get email alerts for each enquiry
5. Save (Ctrl+S)
6. Deploy (top right) → New deployment → gear icon → Web app
7. Settings: **Execute as: Me**, **Who has access: Anyone** *(critical — must be "Anyone")*
8. Click Deploy, authorise when prompted (click "Advanced" → "Go to project (unsafe)" → Allow — it's your own script)
9. Copy the Web App URL
10. Open `enquire.html` in Notepad, find `PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE`, replace with your URL. Save.
11. Re-upload `enquire.html` to your host

### Step 4 — Update the phone/WhatsApp number

In `index.html`, `enquire.html`, and `thanks.html`, find these two lines near the bottom:

```js
var WHATSAPP = "917222911995";
var PHONE_DISPLAY = "+91 72229 11995";
```

Update if needed. Re-upload all three.

### Step 5 — Test before spending on ads

1. Open your live URL on a phone
2. Tap **Enquire now** → fill the form → submit
3. A new row should appear in your sheet within 2-3 seconds
4. Tap **Book on WhatsApp** → should open a chat to Riya's real number
5. Tap **Call Riya** → should open the phone dialler

If the sheet doesn't update: re-check that "Who has access" was set to "Anyone" in step 3.7.

### Step 6 — Add tracking pixels before running ads

In all four HTML files, find and replace:
- `YOUR_PIXEL_ID` → your Meta Pixel ID (from business.facebook.com → Events Manager)
- `AW-XXXXXXXXXX` → your Google Ads or Analytics ID

Re-upload the files after editing.

---

## Part B — Using the admin tool to manage images

This is how you change site photos without touching code.

### What it does

`riya-admin.html` lets you:
- Swap any of the 3 hero photos or 6 portfolio photos
- Either upload from your computer (gets auto-compressed) or paste a URL
- Preview the result
- Download an updated `index.html` ready to upload to your host

### One-time setup

1. Save `riya-admin.html` to your computer somewhere convenient (e.g. Desktop or Documents)
2. **Do not upload this file to your hosting.** It's only for you, on your device.
3. Double-click to open it in any browser
4. Default password is `riya-admin` — change it immediately using the 🔒 Password button at the top

### Workflow for swapping images

1. Open `riya-admin.html` on your computer
2. For each image you want to change:
   - Click **📷 Choose image** to upload a file from your computer (recommended for new photos), OR
   - Paste an image URL (recommended for larger/heavier images — host on imgbb.com or similar)
3. Click **Save draft** as you go (keeps your changes if you close the tab)
4. Click **Preview** to see the live site with your changes in a new tab
5. When happy, click **⬇ Download index.html**
6. Take that downloaded file and upload it to your host:
   - **On Netlify:** drag-and-drop the file onto the existing deployment
   - **On Hostinger:** in File Manager, delete the old `index.html`, upload the new one to `public_html/`
7. Your live site updates within seconds

### Image size guidance

Photos uploaded through the admin get auto-compressed to ~1100-1400px wide at 82% JPEG quality. A typical phone photo (3-5MB) becomes ~100-200KB after compression.

The status next to each image shows you the final size. If you see a warning (anything over ~350KB), consider:
- Cropping or shrinking the photo first
- Hosting on imgbb.com / postimages.org and pasting the URL instead (keeps your `index.html` file lean)

Total size of all 9 images embedded should ideally stay under 1.5MB for good ad-page load times.

### Pasting URLs from imgbb (recommended for galleries)

1. Go to imgbb.com (free, no signup needed)
2. Upload your image
3. After upload, copy the "Direct link" (the one ending in `.jpg` or `.png`)
4. Paste into the URL field for the relevant image slot
5. Save and download

### If you get locked out

If you forget the admin password, just edit `riya-admin.html` in Notepad and delete this line near the top of the script section:

```js
var PW_KEY = 'riya_admin_pw_v2';
```

Replace with:
```js
var PW_KEY = 'riya_admin_pw_v3';
```

(any new key resets it back to the default `riya-admin`).

---

## How the data flow works (for reference)

When a bride fills the enquiry form:

```
She fills enquire.html
    ↓
JS sends form data to your Google Apps Script URL
    ↓
Apps Script appends a row to your Google Sheet
    ↓
(Optional) Apps Script sends you an email notification
    ↓
She lands on thanks.html
    ↓
Thanks page fires "Lead" conversion to Meta & Google Ads
```

This means: even if she doesn't continue to WhatsApp, you have her details in your sheet to follow up on.

The columns in your sheet:

| Column | What's there |
|---|---|
| Timestamp | When the enquiry came in |
| Name, Phone, Date, City | Direct from the form |
| Functions | Which functions she selected |
| The look she wants | Free-text description |
| Service interested in | Which package she clicked (Bridal / HD / Party / Pre-functions) |
| Ad source | Where the click came from (utm_source param) |
| Campaign | Which ad campaign (utm_campaign param) |

### Tagging ads for per-city tracking

When you set up ads in Meta / Google, use UTM parameters in the destination URL:

```
https://yourdomain.com/?utm_source=meta&utm_campaign=bhilai_jan
https://yourdomain.com/?utm_source=meta&utm_campaign=pune_jan
https://yourdomain.com/?utm_source=google&utm_campaign=hyderabad_jan
```

The form picks these up automatically. After a couple of weeks you can sort your sheet by Campaign and see which city/ad is performing best.

### Linking from ads to a specific service

You can also pre-select a service by linking to:

```
https://yourdomain.com/enquire.html?service=Bridal+Makeup
https://yourdomain.com/enquire.html?service=HD+Makeup
```

The form will show "Enquiring for: Bridal Makeup" and tag the row accordingly.

---

## Common issues

**"Form submits but nothing in sheet"**
→ "Who has access" wasn't set to "Anyone" when deploying. Redo Step 3.7.

**"Form button just spins forever"**
→ Check the Web App URL is pasted correctly in `enquire.html`, with no extra spaces or quotes inside.

**"My ad is rejected"**
→ Make sure HTTPS is on (green padlock in browser) and `privacy.html` is linked from your footer. Most rejections are for one of these two.

**"I want to test the form without sending real data"**
→ Submit with name "TEST" and delete that row from the sheet after.

**"The admin won't open the downloaded file properly"**
→ Make sure you're opening `index.html` (not `riya-admin.html`) and that all four website files are in the same folder.
