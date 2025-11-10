"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function AuthPage() {
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    useEffect(() => {
        const plan = localStorage.getItem("selectedPlan");
        if (plan) setSelectedPlan(plan);
    }, []);

    const handleToggleMode = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoginMode((prev) => !prev);
    };

    // LOGIN GOOGLE — chama o backend
    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const { access_token } = tokenResponse;

                // TODO: Enviar o token ao backend 
                const res = await axios.post("http://localhost:5000/auth/google", {
                    credential: access_token,
                });

                if (res.data.success) {
                    localStorage.setItem("token", res.data.data.token);
                    window.location.href = "/dashboard";
                } else {
                    alert("Erro: " + res.data.error);
                }
            } catch (err) {
                console.error(err);
                alert("Falha na autenticação com Google.");
            }
        },
        onError: () => alert("Erro ao autenticar com o Google"),
    });

    return (
        <div className="flex min-h-screen flex-col lg:flex-row bg-white">
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
                className="flex flex-1 items-center justify-center p-8 bg-white"
            >
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="w-full max-w-md"
                >
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                        {isLoginMode ? "Bem-vindo de volta" : "Crie sua conta"}
                    </h1>

                    <form className="space-y-4">
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
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.1 }}
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                if (isLoginMode) {
                                    window.location.href = "/dashboard";
                                } else {
                                    window.location.href = "/payment";
                                }
                            }}
                            className="w-full bg-blue-700 text-white py-2 rounded-full hover:bg-blue-800 transition font-medium shadow-sm"
                        >
                            {isLoginMode ? "Entrar" : "Criar conta"}
                        </motion.button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-sm text-gray-500">ou</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* BOTÃO GOOGLE */}
                    <button
                        type="button"
                        onClick={() => loginWithGoogle()}
                        className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-full hover:bg-gray-100 transition font-medium shadow-sm text-gray-700"
                    >
                        <FcGoogle className="text-xl" />
                        Entrar com Google
                    </button>

                    <p className="text-sm text-gray-600 text-center mt-6">
                        {isLoginMode ? "Ainda não tem uma conta?" : "Já tem uma conta?"}{" "}
                        <a
                            href="#"
                            onClick={handleToggleMode}
                            className="text-blue-700 hover:underline"
                        >
                            {isLoginMode ? "Crie agora" : "Faça login"}
                        </a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
