"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingAnimation() {
    return (
        <div className="flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="w-12 h-12"
            >
                <Image
                    src="/globe.svg"
                    alt="Carregando"
                    width={48}
                    height={48}
                />
            </motion.div>
        </div>
    );
}