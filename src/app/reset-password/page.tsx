'use client';

import { useEffect, useState, Suspense, FormEvent, ChangeEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient } from '../../lib/api-client';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Interfaces de tipo
interface FormData {
    newPassword: string;
    confirmPassword: string;
}

interface FormErrors {
    token?: string;
    newPassword?: string;
    confirmPassword?: string;
}

interface ResetPasswordResponse {
    success: boolean;
    message?: string;
    error?: string;
    details?: string[];
}

interface ApiError {
    response?: {
        data?: {
            error?: string;
            details?: string[];
        };
        status?: number;
        statusText?: string;
    };
    request?: any;
    message?: string;
}

// Componente principal
function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [validToken, setValidToken] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Estados do formulário
    const [formData, setFormData] = useState<FormData>({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setVerifying(false);
            setValidToken(false);
            setMessage('Token de recuperação não encontrado na URL.');
            return;
        }

        // Aqui você pode fazer uma verificação do token se quiser
        // Por enquanto, apenas armazenamos o token
        setVerifying(false);
        setValidToken(true);
    }, [searchParams]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        const token = searchParams.get('token');

        if (!token) {
            newErrors.token = 'Token inválido ou ausente';
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'Nova senha é obrigatória';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'A senha deve ter pelo menos 6 caracteres';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const token = searchParams.get('token');
        setLoading(true);
        setMessage('');
        setErrors({});

        try {
            const response = await apiClient.post<ResetPasswordResponse>('/users/reset-password', {
                token,
                newPassword: formData.newPassword
            });

            if (response.data.success) {
                setSuccess(true);
                setMessage(response.data.message || 'Senha alterada com sucesso! Você já pode fazer login com sua nova senha.');

                // Limpar formulário
                setFormData({
                    newPassword: '',
                    confirmPassword: ''
                });

                // Redirecionar após 3 segundos
                setTimeout(() => {
                    router.push('/auth');
                }, 3000);
            } else {
                setSuccess(false);
                setMessage(response.data.error || 'Erro ao resetar senha');

                // Se houver detalhes de validação
                if (response.data.details) {
                    setErrors({ newPassword: response.data.details.join(', ') });
                }
            }
        } catch (error: unknown) {
            console.error('Erro:', error);
            setSuccess(false);

            // Tratamento de erros com type guard
            if (typeof error === 'object' && error !== null) {
                const apiError = error as ApiError;

                if (apiError.response?.data?.error) {
                    setMessage(apiError.response.data.error);

                    // Tratamento específico para erros de validação
                    if (apiError.response.data.details) {
                        setErrors({ newPassword: apiError.response.data.details.join(', ') });
                    }
                } else if (apiError.response?.status === 400) {
                    setMessage('Token inválido ou expirado. Solicite um novo link de recuperação.');
                    setValidToken(false);
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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpar erro do campo ao modificar
        if (name === 'newPassword' && errors.newPassword) {
            setErrors(prev => ({ ...prev, newPassword: undefined }));
        }
        if (name === 'confirmPassword' && errors.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: undefined }));
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        Verificando token...
                    </h1>
                    <p className="text-gray-600">
                        Aguarde enquanto validamos seu link de recuperação.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    {/* Cabeçalho */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Nova Senha
                        </h1>
                        <p className="text-gray-600">
                            {validToken
                                ? 'Crie uma nova senha para sua conta'
                                : 'Link de recuperação inválido ou expirado'}
                        </p>
                    </div>

                    {!validToken ? (
                        // Token inválido
                        <div className="text-center space-y-6">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                <p className="text-red-800 font-medium">{message}</p>
                                <p className="text-sm text-red-700 mt-2">
                                    O link de recuperação pode ter expirado ou já ter sido usado.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/forgot-password')}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 hover:shadow-md"
                                >
                                    Solicitar Novo Link
                                </button>

                                <Link
                                    href="/auth"
                                    className="block w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 text-center"
                                >
                                    Voltar para o Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        // Formulário de nova senha
                        <>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nova senha */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nova senha
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            placeholder="Mínimo 6 caracteres"
                                            className={`w-full px-4 py-3 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10`}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                                    )}
                                </div>

                                {/* Confirmar senha */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar nova senha
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Digite a senha novamente"
                                            className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10`}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Dicas de senha segura */}
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-sm font-medium text-blue-800 mb-2">🔒 Dicas para uma senha segura:</p>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Use pelo menos 6 caracteres</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Combine letras, números e símbolos</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>Evite sequências óbvias (123456, senha, etc.)</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Botão submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:shadow-md"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Alterando senha...
                                        </>
                                    ) : (
                                        'Redefinir Senha'
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
                                            <p className="font-medium mb-1">{success ? 'Sucesso!' : 'Atenção'}</p>
                                            <p>{message}</p>
                                            {success && (
                                                <div className="mt-2 flex items-center text-green-700">
                                                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                                    <span className="text-xs">Redirecionando para o login...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Links adicionais */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Voltar para o{' '}
                                        <Link
                                            href="/auth"
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            login
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Informações de segurança */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="font-medium text-yellow-800 mb-1">⚠️ Importante:</p>
                        <p className="text-yellow-700">
                            Após redefinir sua senha, todos os dispositivos conectados serão desconectados automaticamente.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer/Branding */}
            {/* Footer/Branding */}
            <div className="mt-10 text-center">
                <motion.div
                    className="flex items-center justify-center space-x-2 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.div
                        className="w-8 h-8 relative"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Image
                            src="/globe.svg"
                            alt="Jurieasy Logo"
                            width={32}
                            height={32}
                            className="text-blue-600"
                        />
                    </motion.div>
                    <span className="text-xl font-bold text-gray-600">Jurieasy</span>
                </motion.div>
                <motion.div
                    className="text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <p>© {new Date().getFullYear()} Jurieasy. Todos os direitos reservados.</p>
                    <p className="mt-1">Sua segurança é nossa prioridade</p>
                </motion.div>
            </div>
        </div>
    );
}

// Página principal com Suspense
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}