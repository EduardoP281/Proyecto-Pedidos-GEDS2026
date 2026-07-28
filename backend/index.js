import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// carga de variables
dotenv.config();

const app = express();

app.use(cors()); // conexion de cors con vue
app.use(express.json()); // uso de json

app.get('/api/test', (req, res) => {
    res.json({ message: 'El backend de Node.js funciona correctamente' });
});

// configuración del puerto para local y railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});