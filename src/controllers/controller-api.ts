import { Request, Response } from 'express';
import * as service from '../services';
const ACESS_TOKEN_KEY = process.env.ACESS_TOKEN_KEY || '';
import jwt from 'jsonwebtoken'
import { IHistoricoAgosto  } from '../models/historicoModel';

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

export const postLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, senha } = req.body
        const acessToken = await service.fetchLogin(email, senha);
        res.status(200).json({ token: acessToken });
    } catch (error: any) {
        console.error("❌ Erro em /api/login:", error);
        res.status(403).json({ error: error.message });
    }
}

export const getValidation = async (req: Request, res: Response): Promise<void> => {

    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        res.status(403).json({ message: 'Acesso nao autorizado!' })
        return;
    }

    jwt.verify(token, ACESS_TOKEN_KEY, (err: any, email: any) => {

        if (err) return res.status(403).json({ message: 'Acesso nao autorizado!' })
        

        res.status(200).json({message: 'Acesso autorizado', email})
    })
}

export const postContagem = async (req: Request, res: Response): Promise<void> => {
    // LOG DE ENTRADA: Se a requisição chegar, isso VAI aparecer no terminal do seu backend
    console.log("📥 Requisição recebida no POST /historico. Corpo recebido:", req.body);

    try {
        const dadosInput: IHistoricoAgosto = req.body;

        // Validação corrigida: Aceita os campos obrigatórios tratando strings vazias ou nulas
        if (!dadosInput.CODIGO_CLIENTE || !dadosInput.N_SERIE || !dadosInput.DATA_CONTAGEM || dadosInput.CONTAGEM === null || dadosInput.CONTAGEM === undefined) {
             console.log("❌ Validação falhou: Campos obrigatórios ausentes.");
             res.status(400).json({ error: 'Campos obrigatórios ausentes: CODIGO_CLIENTE, N_SERIE, DATA_CONTAGEM e CONTAGEM.' });
             return;
        }

        console.log("🚀 Enviando dados validados para o Service do Firebird...");
        const resultado = await service.cadastroContagem(dadosInput);
        
        console.log("✅ Inserção concluída com sucesso no Firebird!");
        res.status(201).json(resultado);
    
    } catch (error: any) {
        console.error("💥 Erro capturado no Controller:", error);
        res.status(500).json({ error: error.message });
    }
};
