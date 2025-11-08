"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    return (
        <>
            <div className="flex min-h-screen flex-col lg:flex-row bg-white">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative hidden lg:flex lg:w-1/2 overflow-hidden"
                >
                    <Image
                        src="/image-auth.jpg"
                        alt="Profissional digitando em um notebook — Jurieasy"
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
                            Crie sua conta
                        </h1>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-full border border-gray-300 px-4 py-2 bg-white text-gray-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                                    placeholder="Seu nome"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
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
                                    className="mt-1 w-full rounded-full border border-gray-300 px-4 py-2 bg-white text-gray-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200"
                                    placeholder="********"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.1 }}
                                type="submit"
                                className="w-full bg-blue-700 text-white py-2 rounded-full hover:bg-blue-800 transition font-medium shadow-sm"
                            >
                                Criar conta
                            </motion.button>
                        </form>

                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-sm text-gray-500">ou</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <button
                            type="button"
                            className="w-full flex items-center text-gray-500 justify-center gap-2 border border-gray-300 py-2 rounded-full hover:bg-gray-100 transition font-medium shadow-sm"
                        >
                            <FcGoogle className="text-xl" />
                            Entrar com Google
                        </button>

                        <p className="text-sm text-gray-600 text-center mt-6">
                            Já tem uma conta?{" "}
                            <a href="/login" className="text-blue-700 hover:underline">
                                Faça login
                            </a>
                        </p>
                    </motion.div>
                </motion.div>
            </div>

        </>
    );
}
