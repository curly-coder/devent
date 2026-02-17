import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Define the shape of our cached connection
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Extend the NodeJS global type to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Use cached connection in development to prevent multiple connections during hot reloads
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connects to MongoDB using Mongoose.
 * Caches the connection to reuse across hot reloads in development.
 * @returns The Mongoose connection instance
 */
async function dbConnect(): Promise<Connection> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if none exists
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  // Wait for connection and cache it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
