'use client';

import { useUserContext } from "@/contexts/UserContext";
import { apiClient } from "@/lib/api-client";
import { useEffect } from "react";

export default function ApiClientConfig() {
    const { accessToken } = useUserContext();

    useEffect(() => {
        apiClient.setAccessTokenGetter(() => accessToken);
    }, [accessToken]);

    return null;
}
