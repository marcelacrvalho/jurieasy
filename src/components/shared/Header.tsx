"use client";

import Image from "next/image";
import { useEffect, useState } from 'react';


export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <nav className="flex justify-between items-center">
                    <div className={`logo text-xl font-bold transition-colors text-[#108D2B]'
            }`}><Image
                            src='/icon.svg'
                            alt='Ícone de um globo que representa a plataforma Jurieasy'
                            width={30}
                            height={30}
                        /></div>
                    <button className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${scrolled
                        ? 'bg-blue-600 text-white hover:bg-primary-700'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                        }`}>
                        Testar Grátis
                    </button>
                </nav>
            </div>
        </header>
    );
}