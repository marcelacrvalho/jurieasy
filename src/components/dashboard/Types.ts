import { JSX, ComponentType } from "react";
import { LucideIcon } from "lucide-react";

export interface QuickAction {
    icon: LucideIcon;
    label: string;
    color: string;
    iconColor: string;
    description: string;
}

export interface Metric {
    icon: LucideIcon;
    label: string;
    value: string;
    gradient: string;
    bgGradient: string;
    iconComponent: JSX.Element;
}

export interface TouchHandlers {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

export interface DocumentOption {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: JSX.Element;
    isPopular?: boolean;
}

export interface DocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDocumentSelect: (document: DocumentOption) => void;
}export interface DocumentOption {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: JSX.Element;
    isPopular?: boolean;
}

export interface DocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDocumentSelect: (document: DocumentOption) => void;
}