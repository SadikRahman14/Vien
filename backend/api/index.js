// backend/api/index.js  (TEMP DIAGNOSTIC)
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import { app } from '../src/app.js';

// cache Mongo across cold starts
let cached = globalThis._mongoose;
if (!cached) cached = globalThis._mongoose = { conn: null, promise: null };

async function connectMongo() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const { MONGODB_URI, MONGODB_DB } = process.env;
    if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB })
                             .then(m => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  // ✅ let /api/health work even if DB/env are wrong
  if (req.url?.startsWith('/api/health')) {
    const hasUri = Boolean(process.env.MONGODB_URI);
    const hasDb  = Boolean(process.env.MONGODB_DB);
    return res.status(200).json({ ok: true, env: { MONGODB_URI: hasUri, MONGODB_DB: hasDb } });
  }

  await connectMongo();              // everything else still uses DB
  const h = serverless(app);
  return h(req, res);
}
