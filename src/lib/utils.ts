import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const twoLetters = (str: string) => {
    if (str.length <= 2) return str.toUpperCase();
    return str.substring(0, 2).toUpperCase();
};
