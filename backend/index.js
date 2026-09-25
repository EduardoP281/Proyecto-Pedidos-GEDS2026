import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './src/infrastructure/routes/index.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 

app.get('/api/test', (req, res) => {
    res.json({ message: 'El backend de Node.js funciona correctamente' });
});

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});