export interface IHistoricoAgosto {
    CODIGO_CLIENTE: number;
    N_SERIE: string;
    DATA_CONTAGEM: string; // Formato YYYY-MM-DD
    CONTAGEM: number;
    N_COPIAS?: number | null;
    COPIAS_ALEM?: number | null;
    VALOR_ALEM?: number | null;
    VALOR_PAGAR?: number | null;
    PAGAMENTO?: string | null;
    DATA_PAGAMENTO?: string | null;
    CUSTO_FRANQUIA?: number | null;
    CUSTO_ALEM?: number | null;
    N_COPIAS_FRANQUIA?: number | null;
}

// Interface auxiliar para os dados simplificados que chegam do Front-end
export interface ICadastroContagemInput {
    codigo_cliente: number;
    n_serie: string;
    data_contagem: string;
    contagem: number;
}