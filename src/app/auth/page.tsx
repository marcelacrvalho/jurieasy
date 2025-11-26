// app/auth/page.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useUsers } from '@/hooks/users';
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import { tokenManager } from '@/lib/token-manager'; // ✅ Import do tokenManager

export default function AuthPage() {
    const router = useRouter();
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [shouldRedirectToPayment, setShouldRedirectToPayment] = useState(false);
    const [isGoogleAuth, setIsGoogleAuth] = useState(false);

    const {
        user,
        registerEmail,
        login,
        registerGoogle,
        isRegistering,
        isLoggingIn,
        error,
        clearError
    } = useUsers();

    // ✅ CORREÇÃO: Verificar se já está autenticado ao carregar a página
    useEffect(() => {
        const checkExistingAuth = async () => {
            console.log('🔐 AuthPage: Verificando autenticação existente...');

            // ✅ VERIFICA NO TOKEN MANAGER (fonte da verdade)
            if (tokenManager.hasToken()) {
                console.log('✅ Usuário já autenticado, redirecionando para dashboard...');
                router.push('/dashboard');
                return;
            }

            // ✅ SE TEM USER MAS NÃO TEM TOKEN, LIMPA O CONTEXTO (estado inconsistente)
            if (user && !tokenManager.hasToken()) {
                console.log('⚠️ Estado inconsistente: user sem token, limpando...');
                // Isso será tratado pelo hook useUsers/logout
            }
        };

        checkExistingAuth();
    }, [user, router]);

    // Carrega o plano selecionado do localStorage
    useEffect(() => {
        const plan = localStorage.getItem("selectedPlan");
        if (plan) {
            setSelectedPlan(plan);
        }
    }, []);

    // ✅ CORREÇÃO: Redirecionamento melhorado
    useEffect(() => {
        if (user && tokenManager.hasToken()) {
            console.log('🔄 Auth: Usuário autenticado, redirecionando...', {
                shouldRedirectToPayment,
                isGoogleAuth,
                selectedPlan,
                user: user.name
            });

            // Pequeno delay para melhor UX
            const redirectTimer = setTimeout(() => {
                // Para registro com email + plano → payment
                if (shouldRedirectToPayment) {
                    console.log("💰 Redirecionando para pagamento com plano:", selectedPlan);
                    router.push("/payment");
                }
                // Para registro com Google + plano → payment
                else if (isGoogleAuth && selectedPlan) {
                    console.log("💰 Redirecionando Google auth para pagamento com plano:", selectedPlan);
                    router.push("/payment");
                }
                // Caso contrário → dashboard
                else {
                    console.log("🏠 Redirecionando para dashboard");
                    router.push("/dashboard");
                }
            }, 500);

            return () => clearTimeout(redirectTimer);
        }
    }, [user, shouldRedirectToPayment, isGoogleAuth, selectedPlan, router]);

    const handleToggleMode = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoginMode((prev) => !prev);
        clearError();
        setForm({ name: "", email: "", password: "" });
    };

    // ✅ CORREÇÃO: Função de auth com email melhorada
    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setIsGoogleAuth(false);

        // ✅ VALIDAÇÃO BÁSICA
        if (!form.email || !form.password) {
            clearError(); // Usa o clearError do hook
            return;
        }

        if (!isLoginMode && !form.name) {
            clearError();
            return;
        }

        try {
            if (isLoginMode) {
                const success = await login({
                    email: form.email,
                    password: form.password
                });

                if (success) {
                    console.log("✅ Login com email realizado com sucesso!");
                    // O redirecionamento será tratado no useEffect
                }
            } else {
                const success = await registerEmail({
                    name: form.name,
                    email: form.email,
                    password: form.password
                });

                if (success) {
                    console.log("✅ Registro com email realizado com sucesso!");

                    // Se tem plano selecionado, marca para redirecionar para pagamento
                    if (selectedPlan) {
                        console.log("📋 Registro com plano, preparando redirecionamento para pagamento");
                        setShouldRedirectToPayment(true);
                    }
                    // Se não tem plano, o useEffect vai redirecionar para dashboard
                }
            }
        } catch (error) {
            console.error("❌ Erro na autenticação:", error);
            // O erro será tratado pelo hook
        }
    };

    // ✅ CORREÇÃO: Função Google melhorada
    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const { access_token } = tokenResponse;
                setIsGoogleAuth(true);
                clearError();

                if (!access_token) {
                    console.error("❌ Access Token não recebido do Google");
                    return;
                }

                console.log("🔐 Iniciando autenticação Google...");
                const success = await registerGoogle(access_token);

                if (success) {
                    console.log("✅ Login Google realizado com sucesso!");
                    // O redirecionamento será tratado no useEffect

                    // Se tem plano selecionado, marca para redirecionar para pagamento
                    if (selectedPlan) {
                        console.log("📋 Google auth com plano, preparando redirecionamento para pagamento");
                        setShouldRedirectToPayment(true);
                    }
                }
            } catch (err) {
                console.error("❌ Erro no login Google:", err);
                setIsGoogleAuth(false);
            }
        },
        onError: (error) => {
            console.error("❌ Erro Google OAuth:", error);
            setIsGoogleAuth(false);
        },
        scope: 'openid profile email',
    });

    // ✅ CORREÇÃO: Loading states mais precisos
    const isLoading = isRegistering || isLoggingIn;
    const isFormLoading = isLoading && !isGoogleAuth;
    const isGoogleLoading = isLoading && isGoogleAuth;

    // Textos dinâmicos baseados no contexto
    const getAuthButtonText = () => {
        if (isLoading) {
            if (isLoginMode) return "Entrando...";
            return selectedPlan ? "Preparando pagamento..." : "Criando conta...";
        }

        if (isLoginMode) return "Entrar";
        return selectedPlan ? "Continuar com o pagamento" : "Criar conta";
    };

    const getLoadingMessage = () => {
        if (isGoogleLoading) return "Autenticando com Google...";
        if (isRegistering) {
            return selectedPlan ? "Preparando pagamento..." : "Criando sua conta...";
        }
        return "Entrando...";
    };

    // ✅ CORREÇÃO: Se já está autenticado, mostra loading até redirecionar
    if (user && tokenManager.hasToken()) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <LoadingAnimation />
                    <p className="mt-4 text-slate-600">Redirecionando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col lg:flex-row bg-white">
            {/* Overlay de loading */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center justify-center"
                        >
                            {/* Globe SVG com animação de rotação */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="w-20 h-20 mb-4"
                            >
                                <Image
                                    src="/globe.svg"
                                    alt="Carregando..."
                                    width={80}
                                    height={80}
                                    className="text-blue-600"
                                />
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-600 font-medium"
                            >
                                {getLoadingMessage()}
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-500 text-sm mt-2"
                            >
                                {selectedPlan && !isLoginMode ? "Quase lá!" : "Aguarde um momento"}
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative hidden lg:flex lg:w-1/2 overflow-hidden"
            >
                <Image
                    src="/auth-dog.jpg"
                    alt="Cachorro deitado em uma cama com um notebook — Jurieasy"
                    fill
                    priority
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-1 items-center justify-center p-8 bg-white relative"
            >
                {isLoading && <LoadingAnimation />}

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="w-full max-w-md"
                >
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                        {isLoginMode ? "Bem-vindo de volta" : "Crie sua conta"}
                    </h1>

                    {/* ✅ Exibir erro se houver */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!isLoginMode && (
                                <motion.div
                                    key="name-input"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="mt-1 w-full rounded-full border border-gray-300 px-4 py-2 bg-white text-gray-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                                        placeholder="Seu nome"
                                        required={!isLoginMode}
                                        disabled={isLoading}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="mt-1 w-full rounded-full border border-gray-300 px-4 py-2 bg-white text-gray-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                                placeholder="seu@email.com"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="mt-1 w-full rounded-full border border-gray-300 px-4 py-2 bg-white text-gray-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                                placeholder="********"
                                required
                                minLength={6}
                                disabled={isLoading}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            transition={{ duration: 0.1 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-700 text-white py-2 rounded-full hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition font-medium shadow-sm relative"
                        >
                            {isFormLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        className="w-4 h-4"
                                    >
                                        <Image
                                            src="/globe.svg"
                                            alt="Carregando"
                                            width={16}
                                            height={16}
                                        />
                                    </motion.div>
                                </motion.div>
                            )}

                            <span className={isFormLoading ? "opacity-0" : "opacity-100"}>
                                {getAuthButtonText()}
                            </span>

                            {isFormLoading && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                    {getAuthButtonText()}
                                </span>
                            )}
                        </motion.button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-sm text-gray-500">ou</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <button
                        type="button"
                        onClick={() => loginWithGoogle()}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-sm text-gray-700 relative"
                    >
                        {isGoogleLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute left-4"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="w-4 h-4"
                                >
                                    <Image
                                        src="/globe.svg"
                                        alt="Carregando"
                                        width={16}
                                        height={16}
                                    />
                                </motion.div>
                            </motion.div>
                        )}

                        <FcGoogle className="text-xl" />
                        <span className={isGoogleLoading ? "opacity-0" : "opacity-100"}>
                            {selectedPlan && !isLoginMode ? "Cadastrar com Google" : "Entrar com Google"}
                        </span>

                        {isGoogleLoading && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                Processando...
                            </span>
                        )}
                    </button>

                    <p className="text-sm text-gray-600 text-center mt-6">
                        {isLoginMode ? "Ainda não tem uma conta?" : "Já tem uma conta?"}{" "}
                        <button
                            type="button"
                            onClick={handleToggleMode}
                            className="text-blue-700 hover:underline bg-transparent border-none cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoginMode ? "Crie agora" : "Faça login"}
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}