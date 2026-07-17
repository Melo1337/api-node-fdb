// app.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { fetchProdutosFiltrados, fetchGenericData } from './services';
import router from './routes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api', router)


app.listen(PORT, () => {
    console.log('  GET /api/filter');
    console.log('  GET /api/admins');
    console.log('  GET/POST /api/clientes');
    console.log('  GET /api/equipamentos');
});
