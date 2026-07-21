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
    
    const { nameTable } = req.params; 
    const valorString = Array.isArray(nameTable) ? nameTable[0] : nameTable;
    
    try {
        const dados = await service.fetchGenericData(valorString);
        res.json(dados);
    } catch (error: any) {
        console.error("❌ Erro em /api/admins:", error);
        res.status(500).json({ error: error.message });
    }
}

export const getTables = async (req: Request, res: Response): Promise<void> => {
    try {
        const dados = await service.getTables();
        res.json(dados);
    } catch (error: any) {
        console.error("❌ Erro em /api/tables", error);
        res.status(500).json({ error: error.message });
    }
}

export const getChamados = async (req: Request, res: Response): Promise<void> => {
     try {
        const dados = await service.fetchChamados();
        res.json(dados);
    } catch (error: any) {
        console.error("❌ Erro em /api/chamados:", error);
        res.status(500).json({ error: error.message });
    }
}