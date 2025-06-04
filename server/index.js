const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Level = require('./models/Level'); // Снова импортируем модель Level

// Local MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/dgtl_miniapp';
const PORT = 3001;

const app = express();

app.use(cors());
app.use(express.json());

// Configure mongoose
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => { // <--- Снова делаем колбэк асинхронным
  console.log('MongoDB connected successfully');
  // ЗАКОММЕНТИРОВАНО: Принудительная очистка коллекции levels для диагностики
  /*
  try {
    console.log('[SERVER STARTUP] Attempting to delete all documents from levels collection...');
    const deleteResult = await Level.deleteMany({});
    console.log(`[SERVER STARTUP] Successfully deleted ${deleteResult.deletedCount} documents from levels collection.`);
  } catch (deleteErr) {
    console.error('[SERVER STARTUP] Error deleting documents from levels collection:', deleteErr);
  }
  */
})
.catch(err => {
  console.error('MongoDB connection error details:', {
    error: err.message,
    code: err.code,
    name: err.name,
    stack: err.stack
  });
});

// Import routes
const userRoutes = require('./routes/users');
const mineralRoutes = require('./routes/minerals');
const levelRoutes = require('./routes/levels');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/minerals', mineralRoutes);
app.use('/api/levels', levelRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 