import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getFirestore } from 'firebase-admin/firestore';
import { 
  initAdmin, 
  createTransporter, 
  welcomeEmailHtml, 
  eventEmailHtml, 
  testimonyEmailHtml, 
  contactEmailHtml,
  EMAIL_USER,
  CHURCH_NAME
} from './emailHelpers.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check and environment diagnostic
app.get('/api/test', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      hasFirebaseId: !!process.env.FIREBASE_PROJECT_ID,
    },
    nodeVersion: process.version,
    serverType: 'Express'
  });
});

// 1. Welcome Email
app.post('/api/send-welcome', async (req, res) => {
  const { email, displayName } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"${CHURCH_NAME}" <${EMAIL_USER}>`,
      to: email,
      subject: `Welcome to WCI Simbock — You're Part of the Family! 🙏`,
      html: welcomeEmailHtml(displayName || email.split('@')[0]),
    });
    console.log(`✅ Welcome email sent to: ${email}`);
    res.json({ success: true });
  } catch (error: any) {
    console.error('🔥 Send Welcome Error:', error.message);
    res.status(500).json({ error: 'Failed to send welcome email', message: error.message });
  }
});

// 2. Event Notification
app.post('/api/send-event', async (req, res) => {
  const { date, text, img } = req.body;
  if (!date || !text) return res.status(400).json({ error: 'Missing event data' });

  try {
    await initAdmin();
    const db = getFirestore(process.env.FIREBASE_DATABASE_ID || '(default)');
    const snapshot = await db.collection('users').get();
    const emails = snapshot.docs.map(d => d.data().email as string).filter(Boolean);

    if (emails.length === 0) return res.json({ success: true, sent: 0 });

    const transporter = createTransporter();
    const html = eventEmailHtml(date, text, img);
    
    // Chunking to avoid SMTP limits/timeouts
    const chunks = [];
    for (let i = 0; i < emails.length; i += 50) chunks.push(emails.slice(i, i + 50));

    for (const chunk of chunks) {
      await transporter.sendMail({
        from: `"${CHURCH_NAME}" <${EMAIL_USER}>`,
        bcc: chunk,
        subject: `📅 New Event — ${date} | WCI Simbock`,
        html,
      });
    }

    console.log(`✅ Event notification sent to ${emails.length} users.`);
    res.json({ success: true, sent: emails.length });
  } catch (error: any) {
    console.error('🔥 Send Event Error:', error.message);
    res.status(500).json({ error: 'Failed to send event emails', message: error.message });
  }
});

// 3. Testimony Notification
app.post('/api/send-testimony', async (req, res) => {
  const { title, name, text, img } = req.body;
  if (!title || !name || !text) return res.status(400).json({ error: 'Missing testimony data' });

  try {
    await initAdmin();
    const db = getFirestore(process.env.FIREBASE_DATABASE_ID || '(default)');
    const snapshot = await db.collection('users').get();
    const emails = snapshot.docs.map(d => d.data().email as string).filter(Boolean);

    if (emails.length === 0) return res.json({ success: true, sent: 0 });

    const transporter = createTransporter();
    const html = testimonyEmailHtml(title, name, text, img);
    
    const chunks = [];
    for (let i = 0; i < emails.length; i += 50) chunks.push(emails.slice(i, i + 50));

    for (const chunk of chunks) {
      await transporter.sendMail({
        from: `"${CHURCH_NAME}" <${EMAIL_USER}>`,
        bcc: chunk,
        subject: `✨ New Testimony: "${title}" | WCI Simbock`,
        html,
      });
    }

    console.log(`✅ Testimony notification sent to ${emails.length} users.`);
    res.json({ success: true, sent: emails.length });
  } catch (error: any) {
    console.error('🔥 Send Testimony Error:', error.message);
    res.status(500).json({ error: 'Failed to send testimony emails', message: error.message });
  }
});

// 4. Contact Form
app.post('/api/send-contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"${CHURCH_NAME} Bot" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email,
      subject: `📩 New Website Message from ${name}`,
      html: contactEmailHtml(name, email, message),
    });

    console.log(`✅ Contact message from ${name} sent to admin.`);
    res.json({ success: true });
  } catch (error: any) {
    console.error('🔥 Send Contact Error:', error.message);
    res.status(500).json({ error: 'Failed to send contact email', message: error.message });
  }
});

// 5. Announcements
app.post('/api/send-announcement', async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) return res.status(400).json({ error: 'Missing announcement data' });

  try {
    await initAdmin();
    const db = getFirestore(process.env.FIREBASE_DATABASE_ID || '(default)');
    const snapshot = await db.collection('users').get();
    const emails = snapshot.docs.map(d => d.data().email as string).filter(Boolean);

    if (emails.length === 0) return res.json({ success: true, sent: 0 });

    const transporter = createTransporter();
    const { announcementEmailHtml, EMAIL_USER, CHURCH_NAME } = await import('./emailHelpers.js');
    const html = announcementEmailHtml(subject, message);
    
    // Chunking to avoid SMTP limits/timeouts
    const chunks = [];
    for (let i = 0; i < emails.length; i += 50) chunks.push(emails.slice(i, i + 50));

    for (const chunk of chunks) {
      await transporter.sendMail({
        from: `"${CHURCH_NAME}" <${EMAIL_USER}>`,
        bcc: chunk,
        subject: `📢 ${subject} | WCI Simbock`,
        html,
      });
    }

    console.log(`✅ Announcement sent to ${emails.length} users.`);
    res.json({ success: true, sent: emails.length });
  } catch (error: any) {
    console.error('🔥 Send Announcement Error:', error.message);
    res.status(500).json({ error: 'Failed to send announcements', message: error.message });
  }
});

// Standalone execution for local testing
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Backend local server running on http://localhost:${PORT}`);
    console.log(`📝 Test health check: http://localhost:${PORT}/api/test`);
  });
}

export default app;
