import Firebird from 'node-firebird';

const CAMINHO_BANCO = 'C:/Program Files (x86)/Alteck/Construtor Firebird/SISTEMA.FDB';

const DB_CONFIG: Firebird.Options = {
    host: 'localhost',
    port: 3050,
    database: CAMINHO_BANCO,
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: true, // Retorna os nomes das colunas em minúsculo
    pageSize: 4096
};

export function getConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
        // Adicionado ": any" explicitamente no parâmetro 'err'
        Firebird.attach(DB_CONFIG, (err: any, db: any) => {
            if (err) return reject(err);
            resolve(db);
        });
    });
}