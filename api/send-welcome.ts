import type { VercelRequest, VercelResponse } from '@vercel/node';
import { welcomeEmailHtml, createTransporter, EMAIL_USER, CHURCH_NAME } from './_emailHelpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('🔥 Welcome Email Route Error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to send welcome email', 
      message: error.message 
    });
  }
}
