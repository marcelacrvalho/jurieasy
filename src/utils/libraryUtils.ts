export interface BibliotecaItem {
    id: string;
    nome: string;
    valor: string;
    categoria: string;
    tags: string[];
    usoFrequente: boolean;
    dataCriacao: string;
}

export const getBibliotecaItems = (): BibliotecaItem[] => {
    if (typeof window === 'undefined') return [];

    try {
        const itensSalvos = localStorage.getItem('biblioteca_jurieasy');
        if (itensSalvos) {
            return JSON.parse(itensSalvos);
        }
    } catch (error) {
        console.error('Erro ao carregar biblioteca:', error);
    }

    return [];
};

export const getSugestoesBiblioteca = (termo: string, limit = 5): BibliotecaItem[] => {
    const itens = getBibliotecaItems();

    if (!termo) {
        // Se não há termo, retorna itens de uso frequente
        return itens
            .filter(item => item.usoFrequente)
            .slice(0, limit);
    }

    const termoLower = termo.toLowerCase();

    return itens
        .filter(item => {
            // Busca no nome
            if (item.nome.toLowerCase().includes(termoLower)) return true;

            // Busca no valor
            if (item.valor.toLowerCase().includes(termoLower)) return true;

            // Busca nas tags
            if (item.tags.some(tag => tag.toLowerCase().includes(termoLower))) return true;

            return false;
        })
        .sort((a, b) => {
            // Ordena por uso frequente primeiro
            if (a.usoFrequente && !b.usoFrequente) return -1;
            if (!a.usoFrequente && b.usoFrequente) return 1;

            // Depois por relevância (nome > valor > tags)
            const aNomeMatch = a.nome.toLowerCase().includes(termoLower);
            const bNomeMatch = b.nome.toLowerCase().includes(termoLower);

            if (aNomeMatch && !bNomeMatch) return -1;
            if (!aNomeMatch && bNomeMatch) return 1;

            return 0;
        })
        .slice(0, limit);
};