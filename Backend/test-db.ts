import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import 'dotenv/config';

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

try {
  const db = getFirestore('ai-studio-e8558fad-a857-49e6-9314-3593cef406a0');
  console.log("Success with 1 arg string!");
} catch (e: any) {
  console.log("Failed with 1 arg string:", e.message);
  try {
     const { getApp } = require('firebase-admin/app');
     const db2 = getFirestore(getApp(), 'ai-studio-e8558fad-a857-49e6-9314-3593cef406a0');
     console.log("Success with 2 args!");
  } catch (e2: any) {
     console.log("Failed with 2 args:", e2.message);
  }
}
