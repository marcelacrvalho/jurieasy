"use client";

import { Toaster } from "react-hot-toast";
import GoogleProvider from "./providers/GoogleProvider";
import { UserProvider } from "@/contexts/UserContext";
import { UserDocumentProvider } from "@/contexts/UserDocumentContext";
import { DocumentProvider } from "@/contexts/DocumentContext";
import ApiClientConfig from "@/components/ApiClientConfig";

export default function ClientLayoutWrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <GoogleProvider>
            <UserProvider>
                <ApiClientConfig />
                <UserDocumentProvider>
                    <DocumentProvider>
                        {children}
                        <Toaster
                            position="top-center"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    borderRadius: "10px",
                                    background: "#2563EB",
                                    color: "#fff",
                                },
                            }}
                        />
                    </DocumentProvider>
                </UserDocumentProvider>
            </UserProvider>
        </GoogleProvider>
    );
}