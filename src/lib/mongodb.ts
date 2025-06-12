// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient>;

// Declare a global so we can reuse the client in dev (avoid hot-reload spins):
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  // If the URI is missing, we still assign a rejecting promise so build-time import doesn't crash
  console.warn(
    '⚠️  MONGODB_URI environment variable not set. Database operations will fail at runtime.'
  );
  clientPromise = Promise.reject(
    new Error('Missing MONGODB_URI environment variable')
  );
} else if (process.env.NODE_ENV === 'development') {
  // In development, reuse the global promise
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production/preview, create a fresh client for each deployment
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
