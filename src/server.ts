import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const PORT = 3001;

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'] 
}));

app.use(express.json());

app.use('/api', router)

app.listen(PORT, () => {
    console.log('  GET /api/filter');
    console.log('  GET /api/table/ (nome da tabela)');
});
