import {atom} from 'jotai';


export const toolSelectState = atom<"PENCIL" | "CIRCLE" | "POINTER" | "ERASER" | "SQUARE">();