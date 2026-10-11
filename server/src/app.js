import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import generationRoutes from './routes/generation.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { isGeminiConfigured, getModelName } from './config/gemini.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectoryPath = path.resolve(__dirname, '../../public');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and utility middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static frontend file serving
app.use(express.static(publicDirectoryPath));

// API Routes
app.use('/api', generationRoutes);

// Fallback to index.html for SPA page loads
app.use((req, res, next) => {
  // If it's a GET request not matching static files or /api, serve index.html
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(publicDirectoryPath, 'index.html'));
  }
  next();
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server if executed directly as entrypoint
const isDirectEntry = process.argv[1] && (
  path.resolve(process.argv[1]) === path.resolve(__filename)
);

if (isDirectEntry) {
  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🎬 CineDirector AI Studio Server running on port ${PORT}`);
    console.log(`📡 Website Link: http://localhost:${PORT}`);
    console.log(`👉 Open in browser: http://localhost:${PORT}`);
    console.log(`🤖 AI Engine: ${getModelName()}`);
    console.log(
      `🔑 Gemini Status: ${
        isGeminiConfigured()
          ? 'Configured & Active'
          : '⚠️ GEMINI_API_KEY missing - configure in .env file'
      }`
    );
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n⚠️ Port ${PORT} is already in use by another instance.`);
      console.error(`📡 The website is already live at: http://localhost:${PORT}\n`);
    } else {
      console.error('Server error:', err);
    }
  });
}

export default app;
