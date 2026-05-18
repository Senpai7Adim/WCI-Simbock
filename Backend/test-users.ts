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

async function run() {
  try {
    const db = getFirestore(process.env.FIREBASE_DATABASE_ID);
    console.log("DB connected");
    const snapshot = await db.collection('users').get();
    console.log("Documents found:", snapshot.docs.length);
  } catch (e: any) {
    console.log("Error:", e.message);
  }
}
run();
