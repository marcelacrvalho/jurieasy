// components/LibraryPage.tsx
"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { Search, Plus, Tag, User, MapPin, FileText, Trash2, Edit, X, Library } from 'lucide-react';

// Interfaces para tipagem
interface BibliotecaItem {
    id: string;
    nome: string;
    valor: string;
    categoria: string;
    tags: string[];
    usoFrequente: boolean;
    dataCriacao: string;
}

interface Categoria {
    id: string;
    nome: string;
    icone: ReactNode;
    cor: string;
}

interface NovoItemForm {
    nome: string;
    valor: string;
    categoria: string;
    tags: string;
    usoFrequente: boolean;
}

// Componente do formulário separado
interface FormularioItemProps {
    modoEdicao: boolean;
    novoItem: NovoItemForm;
    categorias: Categoria[];
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onUpdateNovoItem: (updates: Partial<NovoItemForm>) => void;
}

const FormularioItem: React.FC<FormularioItemProps> = ({
    modoEdicao,
    novoItem,
    categorias,
    onClose,
    onSubmit,
    onUpdateNovoItem
}) => {
    const handleChange = (field: keyof NovoItemForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : e.target.value;

        onUpdateNovoItem({ [field]: value });
    };

    const handleCategoriaClick = (categoriaId: string) => {
        onUpdateNovoItem({ categoria: categoriaId });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                        {modoEdicao ? 'Editar Item' : 'Novo Item na Biblioteca'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        type="button"
                    >
                        <X size={20} color='gray' />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Nome/Chave */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome/Chave *
                        </label>
                        <input
                            type="text"
                            required
                            value={novoItem.nome}
                            onChange={handleChange('nome')}
                            className="w-full p-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: Cliente João Silva, CPF Maria, Endereço Escritório"
                        />
                    </div>

                    {/* Valor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valor *
                        </label>
                        <textarea
                            required
                            value={novoItem.valor}
                            onChange={handleChange('valor')}
                            rows={3}
                            className="w-full p-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: 123.456.789-00, Rua das Flores, 123"
                        />
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoria
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {categorias.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleCategoriaClick(cat.id)}
                                    className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 ${novoItem.categoria === cat.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${cat.cor}`}>
                                        {cat.icone}
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium">{cat.nome}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (separadas por vírgula)
                        </label>
                        <input
                            type="text"
                            value={novoItem.tags}
                            onChange={handleChange('tags')}
                            className="w-full p-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="cliente, recorrente, pessoal"
                        />
                    </div>

                    {/* Uso Frequente */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="usoFrequente"
                            checked={novoItem.usoFrequente}
                            onChange={handleChange('usoFrequente')}
                            className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="usoFrequente" className="ml-2 text-sm text-gray-700">
                            Marcar como uso frequente (aparece primeiro nas sugestões)
                        </label>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700"
                        >
                            {modoEdicao ? 'Salvar Alterações' : 'Adicionar à Biblioteca'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Componente principal
export default function LibraryPage() {
    // Estado dos itens da biblioteca
    const [itens, setItens] = useState<BibliotecaItem[]>([]);

    // Categorias fixas
    const [categorias] = useState<Categoria[]>([
        { id: 'pessoas', nome: 'Pessoas', icone: <User size={16} />, cor: 'bg-blue-100 text-blue-700' },
        { id: 'documentos', nome: 'Documentos', icone: <FileText size={16} />, cor: 'bg-green-100 text-green-700' },
        { id: 'enderecos', nome: 'Endereços', icone: <MapPin size={16} />, cor: 'bg-purple-100 text-purple-700' },
        { id: 'processos', nome: 'Processos', icone: <FileText size={16} />, cor: 'bg-amber-100 text-amber-700' },
        { id: 'outros', nome: 'Outros', icone: <Tag size={16} />, cor: 'bg-gray-100 text-gray-700' },
    ]);

    // Estados para formulário
    const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
    const [modoEdicao, setModoEdicao] = useState<boolean>(false);
    const [itemEditando, setItemEditando] = useState<BibliotecaItem | null>(null);

    // Filtros e busca
    const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todos');
    const [termoBusca, setTermoBusca] = useState<string>('');

    // Novo item
    const [novoItem, setNovoItem] = useState<NovoItemForm>({
        nome: '',
        valor: '',
        categoria: 'pessoas',
        tags: '',
        usoFrequente: false
    });

    // Carregar itens do localStorage ao iniciar
    useEffect(() => {
        const itensSalvos = localStorage.getItem('biblioteca_jurieasy');
        if (itensSalvos) {
            try {
                const itensParseados: BibliotecaItem[] = JSON.parse(itensSalvos);
                setItens(itensParseados);
            } catch (error) {
                console.error('Erro ao carregar biblioteca:', error);
            }
        }
    }, []);

    // Salvar itens no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('biblioteca_jurieasy', JSON.stringify(itens));
    }, [itens]);

    // Handler para submit do formulário
    const handleSubmitFormulario = (e: React.FormEvent) => {
        e.preventDefault();

        if (modoEdicao && itemEditando) {
            // Atualizar item existente
            setItens(prevItens => prevItens.map(item =>
                item.id === itemEditando.id
                    ? {
                        ...item,
                        nome: novoItem.nome,
                        valor: novoItem.valor,
                        categoria: novoItem.categoria,
                        tags: novoItem.tags.split(',').map(t => t.trim()).filter(t => t),
                        usoFrequente: novoItem.usoFrequente
                    }
                    : item
            ));
        } else {
            // Adicionar novo item
            const novoItemCompleto: BibliotecaItem = {
                id: Date.now().toString(),
                nome: novoItem.nome,
                valor: novoItem.valor,
                categoria: novoItem.categoria,
                tags: novoItem.tags.split(',').map(t => t.trim()).filter(t => t),
                usoFrequente: novoItem.usoFrequente,
                dataCriacao: new Date().toISOString(),
            };

            setItens(prevItens => [...prevItens, novoItemCompleto]);
        }

        // Limpar formulário
        setNovoItem({
            nome: '',
            valor: '',
            categoria: 'pessoas',
            tags: '',
            usoFrequente: false
        });

        setMostrarFormulario(false);
        setModoEdicao(false);
        setItemEditando(null);
    };

    const handleCloseFormulario = () => {
        setMostrarFormulario(false);
        setModoEdicao(false);
        setItemEditando(null);
    };

    const handleUpdateNovoItem = (updates: Partial<NovoItemForm>) => {
        setNovoItem(prev => ({ ...prev, ...updates }));
    };

    // Filtrar itens
    const itensFiltrados = itens.filter(item => {
        const matchCategoria = categoriaAtiva === 'todos' || item.categoria === categoriaAtiva;
        const matchBusca = termoBusca === '' ||
            item.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
            item.valor.toLowerCase().includes(termoBusca.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(termoBusca.toLowerCase()));

        return matchCategoria && matchBusca;
    });

    // Ordenar: frequentes primeiro, depois por nome
    const itensOrdenados = [...itensFiltrados].sort((a, b) => {
        if (a.usoFrequente && !b.usoFrequente) return -1;
        if (!a.usoFrequente && b.usoFrequente) return 1;
        return a.nome.localeCompare(b.nome);
    });

    const handleEditar = (item: BibliotecaItem) => {
        setItemEditando(item);
        setNovoItem({
            nome: item.nome,
            valor: item.valor,
            categoria: item.categoria,
            tags: item.tags.join(', '),
            usoFrequente: item.usoFrequente
        });
        setModoEdicao(true);
        setMostrarFormulario(true);
    };

    const handleExcluir = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
            setItens(prevItens => prevItens.filter(item => item.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Minha Biblioteca</h1>
                            <p className="text-gray-600">
                                Dados pessoais salvos para uso rápido nos templates
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setNovoItem({
                                    nome: '',
                                    valor: '',
                                    categoria: 'pessoas',
                                    tags: '',
                                    usoFrequente: false
                                });
                                setModoEdicao(false);
                                setMostrarFormulario(true);
                            }}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 shadow-sm"
                        >
                            <Plus size={20} />
                            Novo Item
                        </button>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Estatísticas */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900">{itens.length}</div>
                        <div className="text-sm text-gray-600">Itens totais</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900">
                            {itens.filter(i => i.usoFrequente).length}
                        </div>
                        <div className="text-sm text-gray-600">Uso frequente</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900">
                            {[...new Set(itens.flatMap(i => i.tags))].length}
                        </div>
                        <div className="text-sm text-gray-600">Tags únicas</div>
                    </div>
                </div>

                {/* Barra de Filtros e Busca */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                    <div className="mb-6">
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                            <button
                                onClick={() => setCategoriaAtiva('todos')}
                                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${categoriaAtiva === 'todos'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Todos
                            </button>
                            {categorias.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategoriaAtiva(cat.id)}
                                    className={`px-4 py-2 rounded-full font-medium whitespace-nowrap flex items-center gap-2 ${categoriaAtiva === cat.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat.icone}
                                    {cat.nome}
                                    <span className="text-xs opacity-75">
                                        ({itens.filter(i => i.categoria === cat.id).length})
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Barra de Busca */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                                placeholder="Buscar na biblioteca por nome, valor ou tag..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 text-gray-500 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Lista de Itens */}
                    <div className="space-y-3">
                        {itensOrdenados.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <FileText size={40} className="text-gray-400" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-700 mb-2">
                                    {termoBusca ? 'Nenhum resultado encontrado' : 'Sua biblioteca está vazia'}
                                </h4>
                                <p className="text-gray-500 mb-6">
                                    {termoBusca ? 'Tente outra busca' : 'Adicione seus primeiros dados para usar nos templates'}
                                </p>
                                <button
                                    onClick={() => setMostrarFormulario(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700"
                                >
                                    <Plus size={20} />
                                    Adicionar primeiro item
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {itensOrdenados.map(item => {
                                        const categoria = categorias.find(c => c.id === item.categoria);

                                        return (
                                            <div
                                                key={item.id}
                                                className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${categoria?.cor || 'bg-gray-100'}`}>
                                                            {categoria?.icone || <Tag size={16} />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-800">{item.nome}</h4>
                                                            {item.usoFrequente && (
                                                                <span className="inline-block px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">
                                                                    Uso Frequente
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleEditar(item)}
                                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                            title="Editar"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleExcluir(item.id)}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-3 rounded-lg">
                                                        {item.valor}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.tags.slice(0, 3).map((tag, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {item.tags.length > 3 && (
                                                            <span className="px-2 py-1 text-xs text-gray-500">
                                                                +{item.tags.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="text-center text-sm text-gray-500 pt-4">
                                    {itensOrdenados.length} item{itensOrdenados.length !== 1 ? 's' : ''} encontrado{itensOrdenados.length !== 1 ? 's' : ''}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Dica de Uso */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Library className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">Como usar sua biblioteca</h4>
                            <ul className="text-gray-700 space-y-2">
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Ao responder as perguntas do template de contrato escolhido, digite <code className="px-2 py-1 bg-gray-100 rounded">&#123;&#123;</code> para ver sugestões da biblioteca</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Itens marcados como "Uso Frequente" aparecem primeiro</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Os dados ficam salvos apenas neste dispositivo (cache local)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal de Formulário */}
            {mostrarFormulario && (
                <FormularioItem
                    modoEdicao={modoEdicao}
                    novoItem={novoItem}
                    categorias={categorias}
                    onClose={handleCloseFormulario}
                    onSubmit={handleSubmitFormulario}
                    onUpdateNovoItem={handleUpdateNovoItem}
                />
            )}
        </div>
    );
}