import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { testimonyEmailHtml, createTransporter, EMAIL_USER, CHURCH_NAME } from './_emailHelpers';

// Initialize Firebase Admin (only once)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { title, name, text, img } = req.body;
  if (!title || !name || !text) return res.status(400).json({ error: 'Missing testimony data' });

  try {
    const db = getFirestore();
    const snapshot = await db.collection('users').get();
    const emails = snapshot.docs.map(d => d.data().email as string).filter(Boolean);

    if (emails.length === 0) return res.status(200).json({ success: true, sent: 0 });

    const transporter = createTransporter();
    const html = testimonyEmailHtml(title, name, text, img);
    const chunks = chunkArray(emails, 50);

    for (const chunk of chunks) {
      await transporter.sendMail({
        from: `"${CHURCH_NAME}" <${EMAIL_USER}>`,
        bcc: chunk,
        subject: `✨ New Testimony: "${title}" | WCI Simbock`,
        html,
      });
    }

    console.log(`✅ Testimony notification sent to ${emails.length} users.`);
    return res.status(200).json({ success: true, sent: emails.length });
  } catch (error) {
    console.error('Error sending testimony email:', error);
    return res.status(500).json({ error: 'Failed to send emails' });
  }
}
