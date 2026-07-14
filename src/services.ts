// services.ts
import { getConnection } from './database';

const CAMPOS_PARA_REMOVER_PRODUTOS = new Set<string>([
    'codigo_barra', 'fornecedor', 'embalagem', 'comissao', 'venda_sem_estoque', 
    'inativo', 'localizacao', 'ultima_compra', 'ultima_venda', 'preco_venda_minimo', 
    'preco_custo', 'preco_custo_medio', 'preco_custo_dolar', 'frete', 'custo_anterior', 
    'venda_anterior', 'margem', 'estoque_minimo', 'estoque_regulador', 'peso', 'ipi', 
    'situac_tributaria', 'ultima_alteracao', 'imagem', 'foto', 'figura', 'picture'
]);

// Interface estrutural para agrupar os itens por categorias string
export interface CategoriaDados {
    [key: string]: Record<string, any>[];
}

// Remove espaços em branco comuns no Firebird (Equivalente ao .strip() do Python)
function limparValor(valor: any): any {
    if (typeof valor === 'string') {
        return valor.trim();
    }
    return valor;
}

export async function fetchProdutosFiltrados(): Promise<CategoriaDados> {
    const db = await getConnection();
    
    const sql = `
        SELECT * FROM PRODUTOS 
        WHERE UPPER(GRUPO) IN ('CILINDROS', 'CARTUCHO', 'TINTA', 'UNIDADE', 'REFIL', 'TONER') 
        AND (INATIVO IS NULL OR INATIVO <> 'S') 
        AND ESTOQUE > 0 
        ORDER BY ESTOQUE DESC
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [], (err, rows: any[]) => {
            db.detach(); // Garante o encerramento da conexão
            if (err) return reject(err);

            const categorias: CategoriaDados = {};

            rows.forEach(row => {
                const dadosLimpos: Record<string, any> = {};
                
                Object.keys(row).forEach(coluna => {
                    if (Buffer.isBuffer(row[coluna])) return; // Ignora BLOBs binários
                    
                    if (!CAMPOS_PARA_REMOVER_PRODUTOS.has(coluna.toLowerCase())) {
                        dadosLimpos[coluna] = limparValor(row[coluna]);
                    }
                });

                const grupoRaw = row.grupo ? String(row.grupo).toUpperCase().trim() : 'SEM_GRUPO';
                
                if (!categorias[grupoRaw]) {
                    categorias[grupoRaw] = [];
                }
                categorias[grupoRaw].push(dadosLimpos);
            });

            // Log de verificação no terminal
            Object.keys(categorias).forEach(grupo => {
                console.log(`✅ ${grupo}: ${categorias[grupo].length} produtos`);
            });

            resolve(categorias);
        });
    });
}

export async function fetchGenericData(tabela: string): Promise<CategoriaDados> {
    const db = await getConnection();
    const sql = `SELECT * FROM ${tabela}`;

    return new Promise((resolve, reject) => {
        db.query(sql, [], (err, rows: any[]) => {
            db.detach();
            if (err) return reject(err);

            const categorias: CategoriaDados = {};

            rows.forEach(row => {
                const item: Record<string, any> = {};
                
                Object.keys(row).forEach(coluna => {
                    if (Buffer.isBuffer(row[coluna])) return;
                    item[coluna] = limparValor(row[coluna]);
                });

                const grupoRaw = item.grupo ? String(item.grupo).toUpperCase().trim() : 'SEM_GRUPO';

                if (!categorias[grupoRaw]) {
                    categorias[grupoRaw] = [];
                }
                categorias[grupoRaw].push(item);
            });

            resolve(categorias);
        });
    });
}
