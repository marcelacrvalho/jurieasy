import {
    Scale,
    Construction,
    BrickWall,
    ShoppingCart,
    HouseHeart,
    House,
    Users,
    FileText,
    LucideProps,
    Building
} from 'lucide-react';
import { ForwardRefExoticComponent } from 'react';

export const getIconByCategory = (category: string): ForwardRefExoticComponent<Omit<LucideProps, "ref">> => {
    const icons: { [key: string]: ForwardRefExoticComponent<Omit<LucideProps, "ref">> } = {
        'civil': Scale,
        'trabalhista': Construction,
        'penal': BrickWall,
        'empresarial': Building,
        'consumidor': ShoppingCart,
        'família': HouseHeart,
        'imobiliário': House,
        'sucessões': Users
    };
    return icons[category.toLowerCase()] || FileText;
};