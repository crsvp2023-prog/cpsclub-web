import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse .env.local file
const envLines = envContent.split('\n');
const envVars = {};
for (const line of envLines) {
  const trimmedLine = line.trim();
  if (!trimmedLine || trimmedLine.startsWith('#')) continue;
  
  const [key, ...valueParts] = trimmedLine.split('=');
  let value = valueParts.join('=').trim();
  
  // Remove quotes if present
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  
  envVars[key] = value;
}

// Initialize Firebase Admin SDK
const serviceAccountStr = envVars.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountStr) {
  console.error('❌ Error: FIREBASE_SERVICE_ACCOUNT not found in .env.local');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountStr);
} catch (e) {
  console.error('❌ Error parsing FIREBASE_SERVICE_ACCOUNT JSON:', e.message);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

async function seedPredictions() {
  const predictions = [
    {
      id: '1',
      question: 'Who will win: CPSC vs Old Ignatians?',
      options: [
        { name: 'CPSC', votes: 234 },
        { name: 'Old Ignatians', votes: 156 },
      ],
      totalVotes: 390,
      matchDate: 'Jan 10, 2026',
    },
    {
      id: '2',
      question: 'Highest Run Scorer?',
      options: [
        { name: 'Player A', votes: 145 },
        { name: 'Player B', votes: 98 },
        { name: 'Player C', votes: 112 },
      ],
      totalVotes: 355,
      matchDate: 'Jan 10, 2026',
    },
    {
      id: '3',
      question: 'Will we see a century?',
      options: [
        { name: 'Yes', votes: 187 },
        { name: 'No', votes: 142 },
      ],
      totalVotes: 329,
      matchDate: 'Jan 15, 2026',
    },
  ];

  for (const pred of predictions) {
    try {
      await db.collection('predictions').doc(pred.id).set(pred);
      console.log(`✓ Created prediction: ${pred.id}`);
    } catch (error) {
      console.error(`✗ Error creating prediction ${pred.id}:`, error.message);
    }
  }

  console.log('✓ Seeding complete!');
  process.exit(0);
}

seedPredictions().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
