// app/forgot-password/page.jsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Interface para os erros do formulário
interface FormErrors {
    email?: string;
}

// Interface para a resposta da API
interface ApiResponse {
    success: boolean;
    message?: string;
    error?: string;
}

// Interface para o erro da API
interface ApiError {
    response?: {
        data?: {
            error?: string;
        };
        status?: number;
        statusText?: string;
    };
    request?: any;
    message?: string;
}

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setMessage('');
        setErrors({});

        try {
            const response = await apiClient.post<ApiResponse>('/users/forgot-password', { email });

            if (response.data.success) {
                setSuccess(true);
                setMessage(
                    response.data.message ||
                    'Se o email existir em nossa base, você receberá instruções para resetar sua senha em instantes.'
                );
                setEmail('');
            } else {
                setSuccess(false);
                setMessage(response.data.error || 'Erro ao processar solicitação');
            }
        } catch (error: unknown) {
            console.error('Erro:', error);
            setSuccess(false);

            // Tratamento de erros com type guard
            if (typeof error === 'object' && error !== null) {
                const apiError = error as ApiError;

                if (apiError.response?.data?.error) {
                    setMessage(apiError.response.data.error);
                } else if (apiError.message) {
                    setMessage(apiError.message);
                } else {
                    setMessage('Erro ao processar sua solicitação. Tente novamente.');
                }
            } else {
                setMessage('Erro ao processar sua solicitação. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        // Limpar erro do campo ao modificar
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
            {/* Botão voltar */}
            <button
                onClick={() => router.push('/auth')}
                className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar para o login
            </button>

            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    {/* Cabeçalho */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                            <Mail className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Recuperar Senha
                        </h1>
                        <p className="text-gray-600">
                            Digite seu email para receber um link de recuperação
                        </p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email cadastrado
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="seu@email.com"
                                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50`}
                                required
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Botão submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:shadow-md"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Link de Recuperação'
                            )}
                        </button>
                    </form>

                    {/* Mensagem de feedback */}
                    {message && (
                        <div className={`mt-6 p-4 rounded-lg border ${success ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                            <div className="flex items-start">
                                {success ? (
                                    <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="text-sm">
                                    <p className="font-medium mb-1">{success ? 'Email enviado!' : 'Atenção'}</p>
                                    <p>{message}</p>
                                </div>
                            </div>

                            {success && (
                                <div className="mt-3 text-xs text-green-700">
                                    <p>🔒 Por segurança, o link expira em 1 hora</p>
                                    <p>📧 Verifique sua pasta de spam caso não encontre</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Links adicionais */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="text-center space-y-3">
                            <p className="text-sm text-gray-600">
                                Lembrou da senha?{' '}
                                <Link
                                    href="/auth"
                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Voltar para o login
                                </Link>
                            </p>
                            <p className="text-sm text-gray-600">
                                Não tem uma conta?{' '}
                                <Link
                                    href="/register"
                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Criar conta agora
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Informações de segurança */}
                <div className="mt-6 text-center text-sm text-gray-500 space-y-3">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-medium text-blue-800 mb-2">🛡️ Medidas de segurança:</p>
                        <ul className="text-left text-blue-700 space-y-1">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Links de recuperação são únicos e expiram em 1 hora</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Sempre verifique o remetente do email (suporte@jurieasy.com)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Nunca compartilhe links de recuperação</span>
                            </li>
                        </ul>
                    </div>

                    <p>
                        Ainda com problemas?{' '}
                        <Link
                            href="/contact"
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Contate nosso suporte
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer/Branding */}
            <div className="mt-10 text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
                    <span className="text-xl font-bold text-gray-900">Jurieasy</span>
                </div>
                <div className="text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Jurieasy. Todos os direitos reservados.</p>
                    <p className="mt-1">Sua segurança é nossa prioridade</p>
                </div>
            </div>
        </div>
    );
}