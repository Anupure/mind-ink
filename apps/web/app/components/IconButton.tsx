import { ReactNode } from "react";



export default function IconButton({icon,onClick, isActive}:{icon:ReactNode,onClick:()=>void, isActive:boolean}){
    return (
        <div className={`pointer icon-button rounded-sm p-2 bg-black hover:bg-gray-600 ${isActive ? "text-red-900" : "text-white"} `} onClick={onClick}>
            {icon}
        </div>
    )
}