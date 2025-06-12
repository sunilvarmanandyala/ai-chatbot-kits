
console.log("🔍 MONGODB_URI at build/runtime:", process.env.MONGODB_URI);
import { MongoClient } from 'mongodb';


const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient>;

declare global {
  // Allows us to reuse the client across module reloads in dev
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  console.warn(
    '⚠️  MONGODB_URI environment variable not set. Database operations will fail at runtime.'
  );
  clientPromise = Promise.reject(
    new Error('Missing MONGODB_URI environment variable')
  );
} else if (process.env.NODE_ENV === 'development') {
  // In dev, reuse a global promise so we don’t spin up many connections
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In prod/preview, create a new client
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
