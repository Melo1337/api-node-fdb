import { getConnection } from './repositories/conect-database';

const CAMPOS_PARA_REMOVER_PRODUTOS = new Set<string>([
    'codigo_barra', 'fornecedor', 'embalagem', 'comissao', 'venda_sem_estoque',
    'inativo', 'localizacao', 'ultima_compra', 'ultima_venda', 'preco_venda_minimo',
    'preco_custo', 'preco_custo_medio', 'preco_custo_dolar', 'frete', 'custo_anterior',
    'venda_anterior', 'margem', 'estoque_minimo', 'estoque_regulador', 'peso', 'ipi',
    'situac_tributaria', 'ultima_alteracao', 'imagem', 'foto', 'figura', 'picture'
]);

export interface CategoriaDados {
    [key: string]: Record<string, any>[];
}

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
            db.detach();
            if (err) return reject(err);

            const categorias: CategoriaDados = {};

            rows.forEach(row => {
                const dadosLimpos: Record<string, any> = {};

                Object.keys(row).forEach(coluna => {

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

export async function getTables(): Promise<string[]> {
    const db = await getConnection();
    
    // Consulta usando os nomes originais das colunas do Firebird
    const sql = `
        SELECT RDB$RELATION_NAME 
        FROM RDB$RELATIONS 
        WHERE RDB$SYSTEM_FLAG = 0 
          AND RDB$VIEW_SOURCE IS NULL
    `;

    return new Promise((resolve, reject) => {
        // Passar o array vazio [] garante que o driver node-firebird identifique o callback
        db.query(sql, [], (err, rows) => {
            if (err) return reject(err);

            if (!rows || rows.length === 0) {
                return resolve([]);
            }

            try {
                const tabelas = rows.map((row: any) => {
                    // O node-firebird pode retornar as chaves em maiúsculo (RDB$RELATION_NAME)
                    let value = row['RDB$RELATION_NAME'] || row['rdb$relation_name'];

                    if (!value) return null;

                    return typeof value === 'string' ? value.trim() : String(value).trim();
                }).filter(Boolean) as string[]; // Remove nulos se houver alguma falha

                resolve(tabelas);
            } catch (mapError) {
                reject(mapError);
            }
        });
    });
}