import {atom} from 'jotai';


export const modalOpenState = atom<"signup" | "signin" | undefined>();