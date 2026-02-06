require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// ------------------- EMAIL SETUP -------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// ------------------- ROUTES -------------------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/services", (req, res) => {
  res.sendFile(__dirname + "/public/services.html");
});

app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/public/contact.html");
});


// ------------------- FORM API -------------------
app.post("/submit-form", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.json({ success: false, message: "कृपया सर्व माहिती भरा" });
  }

  const sql =
    "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, phone, message], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "डेटाबेस त्रुटी" });
    }

    // EMAIL NOTIFICATION
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "📩 New Contact Form Submission",
      html: `
        <h3>नवीन संदेश</h3>
        <p><b>नाव:</b> ${name}</p>
        <p><b>ईमेल:</b> ${email}</p>
        <p><b>फोन:</b> ${phone}</p>
        <p><b>संदेश:</b> ${message}</p>
      `
    });

    res.json({
      success: true,
      message: "✅ संदेश यशस्वीरीत्या पाठवला!"
    });
  });
});


// ------------------- ADMIN DASHBOARD API -------------------
app.get("/api/admin/contacts", (req, res) => {
  db.query("SELECT * FROM contacts ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});


// ------------------- START SERVER -------------------
app.listen(PORT, () => {
  console.log("🚀 Server running at http://localhost:" + PORT);
});
