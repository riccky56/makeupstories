/**
 * MAKEUP STORIES BY RIYA — Enquiry form → Google Sheet
 *
 * This script catches form submissions from enquire.html and adds
 * each lead as a new row in this Google Sheet.
 *
 * ──────────────────────────────────────────────
 *  SETUP (10 minutes, one-time):
 * ──────────────────────────────────────────────
 *  1. Create a new Google Sheet (sheets.google.com → blank).
 *     Name it "Makeup Stories Enquiries" (or anything you like).
 *
 *  2. In that sheet: Extensions → Apps Script.
 *     A new tab opens with a code editor.
 *
 *  3. Delete the placeholder "function myFunction() {}" code.
 *     Paste THIS ENTIRE FILE into the editor.
 *
 *  4. (Optional) To get an email every time a new bride enquires,
 *     fill in your email below where it says NOTIFY_EMAIL.
 *     Leave it as '' to skip emails.
 *
 *  5. Click the floppy-disk save icon. Name the project anything.
 *
 *  6. Click "Deploy" (top-right) → "New deployment".
 *     • Click the gear icon ⚙ → choose "Web app".
 *     • Description: "Enquiry form"
 *     • Execute as: Me
 *     • Who has access: Anyone   ← important, must be "Anyone"
 *     • Click "Deploy"
 *     • Authorize when prompted ("Advanced" → "Go to project (unsafe)"
 *       — it's safe, it's your own script; Google warns because
 *       it's not verified, which is normal for personal projects).
 *
 *  7. Copy the "Web app URL" it gives you. Looks like:
 *     https://script.google.com/macros/s/AKfycb.../exec
 *
 *  8. Open enquire.html in a text editor (Notepad works).
 *     Find the line that says:
 *        var SCRIPT_URL = "PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE";
 *     Replace the placeholder text with the URL you copied.
 *     Save the file.
 *
 *  9. Upload index.html, enquire.html, thanks.html together
 *     (as a folder or ZIP) to your hosting (tiiny.host / Netlify).
 *
 *  10. Test it! Open the live site → click "Enquire now" →
 *      fill the form → submit. A new row should appear in
 *      your sheet within 2–3 seconds.
 *
 * ──────────────────────────────────────────────
 *  UPDATING the script later:
 * ──────────────────────────────────────────────
 *  If you edit this code: Deploy → Manage deployments →
 *  pencil icon → Version: "New version" → Deploy.
 *  The URL stays the same.
 */


// ============================================================
//  EDIT THIS LINE  ←  (or leave blank to skip email alerts)
// ============================================================
var NOTIFY_EMAIL = 'riyatiwari73111@gmail.com';   // e.g. 'riya@example.com'
// ============================================================


function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter;

    // Add header row the first time
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Name', 'Phone', 'Wedding date', 'City / Venue',
        'Functions', 'The look she wants', 'Service interested in',
        'Ad source', 'Campaign'
      ]);
      sheet.getRange(1, 1, 1, 10)
           .setFontWeight('bold')
           .setBackground('#f1ddd2');
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, 10, 150);
      sheet.setColumnWidth(7, 280);  // wider for "the look" column
    }

    sheet.appendRow([
      new Date(),
      data.name      || '',
      data.phone     || '',
      data.date      || '',
      data.city      || '',
      data.functions || '',
      data.look      || '',
      data.service   || '',
      data.source    || 'Direct',
      data.campaign  || ''
    ]);

    // Email notification (only if NOTIFY_EMAIL is set above)
    if (NOTIFY_EMAIL) {
      var subject = '✨ New bride enquiry: ' + (data.name || 'unknown');
      var body =
        'A new enquiry just came in from your website.\n\n' +
        '• Name:     ' + (data.name      || '—') + '\n' +
        '• Phone:    ' + (data.phone     || '—') + '\n' +
        '• Date:     ' + (data.date      || '—') + '\n' +
        '• Venue:    ' + (data.city      || '—') + '\n' +
        '• Functions:' + (data.functions || '—') + '\n' +
        '• Service:  ' + (data.service   || '—') + '\n' +
        '• Source:   ' + (data.source    || 'Direct') + '\n\n' +
        'The look she described:\n' + (data.look || '—') + '\n\n' +
        '— Full list of leads is in your Google Sheet.';
      try { MailApp.sendEmail(NOTIFY_EMAIL, subject, body); } catch (mailErr) {}
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// If someone visits the URL in a browser (instead of POSTing), show a friendly note
function doGet() {
  return ContentService.createTextOutput(
    'Enquiry endpoint is live. Submit via the website form.'
  );
}
