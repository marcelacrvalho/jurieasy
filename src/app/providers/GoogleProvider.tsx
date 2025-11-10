"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleProvider({ children }: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        console.error("❌ ERRO: NEXT_PUBLIC_GOOGLE_CLIENT_ID não definido no .env.local");
    }

    return (
        <GoogleOAuthProvider clientId={clientId || ""}>
            {children}
        </GoogleOAuthProvider>
    );
}
