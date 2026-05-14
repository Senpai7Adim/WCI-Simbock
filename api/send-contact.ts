import type { VercelRequest, VercelResponse } from '@vercel/node';
import { contactEmailHtml, createTransporter, EMAIL_USER, CHURCH_NAME } from './_emailHelpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('🔥 Contact Email Route Error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to send contact email', 
      message: error.message 
    });
  }
}
