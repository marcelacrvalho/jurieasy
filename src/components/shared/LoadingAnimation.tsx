"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";


export default function LoadingAnimation() {
    return <AnimatePresence>
        {(
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-8 right-8"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="w-6 h-6"
                >
                    <Image
                        src="/globe.svg"
                        alt="Carregando"
                        width={24}
                        height={24}
                        className="text-blue-600"
                    />
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
}