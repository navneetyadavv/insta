import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection string
const CONNECTION_URL = 'mongodb+srv://navsinsta:xPWn8iFc10UnKel9@cluster0.4uavqs3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(CONNECTION_URL).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.log('Error connecting to MongoDB Atlas:', error.message);
});

// Define a schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// Create a model
const User = mongoose.model('User', userSchema);

// Routes
app.post('/users', async (req, res) => {
    const { email, password } = req.body;

    const newUser = new User({ email, password });

    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
