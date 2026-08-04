import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import routes from './src/infrastructure/routes/index.routes.js';
    
    dotenv.config();
    
    const app = express();
    
    app.use(cors());
    app.use(express.json());
    app.use('/api', routes);
    
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`servidor corriendo en el puerto ${PORT}`);
    });