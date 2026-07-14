// database.ts
import Firebird from 'node-firebird';

const CAMINHO_BANCO = 'C:/Program Files (x86)/Alteck/Construtor Firebird/SISTEMA.FDB';

// Configuração estritamente tipada baseada na interface do node-firebird
const DB_CONFIG: Firebird.Options = {
    host: 'localhost',
    port: 3050,
    database: CAMINHO_BANCO,
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: true, // Retorna os nomes das colunas em minúsculo
    pageSize: 4096
};

/**
 * Retorna uma conexão ativa com o banco Firebird
 */
export function getConnection(): Promise<Firebird.Database> {
    return new Promise((resolve, reject) => {
        Firebird.attach(DB_CONFIG, (err, db) => {
            if (err) return reject(err);
            resolve(db);
        });
    });
}
