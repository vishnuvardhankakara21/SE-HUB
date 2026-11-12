import mongoose from "mongoose";
import dns from "dns";

// Ensure SRV DNS records resolve reliably across Windows, local networks, and cloud serverless
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Graceful fallback if DNS server configuration is restricted
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/se-learning-platform";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 100, // Handle high concurrent student & faculty requests without starvation
      minPoolSize: 10, // Maintain warm connection pool to eliminate TCP/TLS latency spikes
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
      maxIdleTimeMS: 30000,
      autoIndex: process.env.NODE_ENV !== "production", // Avoid blocking boots on production
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectToDatabase;

