// app/verify-email/page.jsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '../../lib/api-client';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Componente principal
function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setLoading(false);
                setSuccess(false);
                setMessage('Token de verificação não encontrado.');
                return;
            }

            try {
                const response = await apiClient.get(`/users/verify-email?token=${token}`);

                if (response.data.success) {
                    setSuccess(true);
                    setMessage(response.data.message || 'Email verificado com sucesso!');

                    // Salva dados no localStorage
                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        if (response.data.user) {
                            localStorage.setItem('user', JSON.stringify(response.data.user));
                        }
                    }

                    // Redireciona após 3 segundos
                    setTimeout(() => {
                        if (response.data.user) {
                            router.push('/dashboard');
                        } else {
                            router.push('/auth');
                        }
                    }, 3000);
                } else {
                    setSuccess(false);
                    setMessage(response.data.error || 'Falha na verificação');
                }
            } catch (error: any) {
                console.error('Erro na verificação:', error);
                setSuccess(false);
                setMessage('Erro ao processar a verificação. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [searchParams, router]);

    const goToLogin = () => {
        router.push('/auth');
    };

    const goToResendVerification = () => {
        router.push('/resend-verification');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        Verificando seu email...
                    </h1>
                    <p className="text-gray-600">
                        Aguarde enquanto confirmamos sua conta.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="text-center">
                    {success ? (
                        <>
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </>
                    ) : (
                        <>
                            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                        </>
                    )}

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {success ? 'Email Verificado!' : 'Verificação Falhou'}
                    </h1>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                        <p className="text-gray-700">
                            {message}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {success ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center text-sm text-gray-600 bg-gray-50 py-3 rounded-lg">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    <span>Redirecionando para o dashboard...</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 hover:shadow-md"
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={() => router.push('/profile')}
                                        className="bg-white text-indigo-600 py-3 px-4 rounded-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                                    >
                                        Perfil
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-sm text-gray-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                    <p className="font-medium mb-1">Solução de problemas:</p>
                                    <ul className="text-left list-disc pl-4 space-y-1">
                                        <li>O link pode ter expirado (válido por 1 hora)</li>
                                        <li>Tente copiar e colar o link completo</li>
                                        <li>Verifique sua pasta de spam</li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={goToLogin}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 hover:shadow-md"
                                    >
                                        Ir para o Login
                                    </button>

                                    <button
                                        onClick={goToResendVerification}
                                        className="w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-all duration-200"
                                    >
                                        Reenviar Email de Verificação
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
                    <span className="text-xl font-bold text-gray-900">Jurieasy</span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                    <p>
                        Precisa de ajuda?{' '}
                        <a
                            href="mailto:suporte@jurieasy.com"
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Contate nosso suporte
                        </a>
                    </p>
                    <p className="text-xs">
                        © {new Date().getFullYear()} Jurieasy. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}