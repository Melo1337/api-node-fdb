import { Request, Response } from 'express';
import * as service from '../services';

export const produtosFiltradosController = async (req: Request, res: Response): Promise<void> => {
    try {
        const dados = await service.fetchProdutosFiltrados();
        res.json(dados);
    } catch (error: any) {
        console.error("❌ Erro em /api/filter:", error);
        res.status(500).json({ error: error.message });
    }
}

export const genericDataController = async (req: Request, res: Response): Promise<void> => {
    
    const tableName = req.params
    
    try {
        const dados = await service.fetchGenericData(tableName);
        res.json(dados);
    } catch (error: any) {
        console.error("❌ Erro em /api/admins:", error);
        res.status(500).json({ error: error.message });
    }
}