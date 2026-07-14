// app.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { fetchProdutosFiltrados, fetchGenericData } from './services';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/filter', async (req: Request, res: Response): Promise<void> => {
    
    const {nome} = req.body

    if (!nome) {
        res.status(400).json({ erro: "Nome é obrigatório"})
        return;
    } 
    res.status(400).json({ erro: "Nome é obrigatório"})
})

app.get('/api/filter', async (req: Request, res: Response): Promise<void> => {
    try {
        const dados = await fetchProdutosFiltrados();
        res.json(dados);
    } catch (error: any) {
        console.error("❌ Erro em /api/filter:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admins', async (req: Request, res: Response): Promise<void> => {
    try {
        const dados = await fetchGenericData("VENDEDORES");
        res.json(dados);
    } catch (error: any) {
        console.error("❌ Erro em /api/admins:", error);
        res.status(500).json({ error: error.message });
    }
});

app.route('/api/clientes')
    .get(async (req: Request, res: Response): Promise<void> => {
        try {
            const dados = await fetchGenericData("CLIENTES");
            res.json(dados);
        } catch (error: any) {
            console.error("❌ Erro em GET /api/clientes:", error);
            res.status(500).json({ error: error.message });
        }
    })

app.get('/api/equipamentos', async (req: Request, res: Response): Promise<void> => {
    try {
        const dados = await fetchGenericData("EQUIPAMENTOS");
        res.json(dados);
    } catch (error: any) {
        console.error("❌ Erro em /api/equipamentos:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log('🚀 Servidor TypeScript rodando em http://localhost:3001');
    console.log('📁 Banco de dados: C:/Program Files (x86)/Alteck/Construtor Firebird/SISTEMA.FDB');
    console.log('📋 Endpoints disponíveis:');
    console.log('  GET /api/filter');
    console.log('  GET /api/admins');
    console.log('  GET/POST /api/clientes');
    console.log('  GET /api/equipamentos');
    console.log('\nPressione CTRL+C para parar');
});
