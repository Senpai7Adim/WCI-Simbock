import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const diagnostic: any = { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    steps: []
  };

  try {
    diagnostic.steps.push('Checking env vars...');
    diagnostic.env = {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      hasFirebaseId: !!process.env.FIREBASE_PROJECT_ID,
    };

    diagnostic.steps.push('Testing nodemailer import...');
    const nodemailer = await import('nodemailer');
    diagnostic.nodemailerVersion = nodemailer.default ? 'found' : 'not found';

    diagnostic.steps.push('Testing firebase-admin import...');
    const firebaseAdmin = await import('firebase-admin/app');
    diagnostic.firebaseAdminVersion = firebaseAdmin.getApps ? 'found' : 'not found';

    return res.status(200).json(diagnostic);
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      lastStep: diagnostic.steps[diagnostic.steps.length - 1],
      message: err.message,
      stack: err.stack
    });
  }
}
