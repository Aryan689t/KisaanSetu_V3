/**
 * Vercel Serverless Function Entry Point for KisanSetu Backend REST API
 * Routes all /api/* requests (excluding /api/chat) to the Express application in backend/src/app.js.
 */
import app from '../backend/src/app.js';

export default function handler(req, res) {
  return app(req, res);
}
