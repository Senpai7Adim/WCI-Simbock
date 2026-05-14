import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getFirestore } from 'firebase-admin/firestore';
import { testimonyEmailHtml, createTransporter, EMAIL_USER, CHURCH_NAME, initAdmin } from './_emailHelpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { title, name, text, img } = req.body;
  if (!title || !name || !text) return res.status(400).json({ error: 'Missing testimony data' });

  try {
    // Robust initialization with logging
    try {
      await initAdmin();
    } catch (err: any) {
      console.error('🔥 Firebase Admin Init Error:', err.message);
      return res.status(500).json({ error: 'Configuration Error (Firebase Admin)', message: err.message });
    }

    const db = getFirestore();
    const snapshot = await db.collection('users').get();
    const emails = snapshot.docs.map(d => d.data().email as string).filter(Boolean);

    if (emails.length === 0) return res.status(200).json({ success: true, sent: 0 });

    const transporter = createTransporter();
    const html = testimonyEmailHtml(title, name, text, img);
    const chunks = (arr: string[], size: number) => {
      const result = [];
      for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
      return result;
    };
    
    const emailChunks = chunks(emails, 50);

    for (const chunk of emailChunks) {
      await transporter.sendMail({
        from: `"${CHURCH_NAME}" <${EMAIL_USER}>`,
        bcc: chunk,
        subject: `✨ New Testimony: "${title}" | WCI Simbock`,
        html,
      });
    }

    console.log(`✅ Testimony notification sent to ${emails.length} users.`);
    return res.status(200).json({ success: true, sent: emails.length });
  } catch (error: any) {
    console.error('🔥 Testimony Email Route Error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to send emails', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
