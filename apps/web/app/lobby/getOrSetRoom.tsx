import dotenv from 'dotenv'
import axios from 'axios';
import { useRouter } from 'next/navigation';

dotenv.config()





export const getRoom = async(roomName: string , router: ReturnType<typeof useRouter> ) =>{
    const HTTP_URL = "http://localhost:5000";
    const slug = roomName;
    console.log(HTTP_URL)
    //get token from session storage
    const token = localStorage.getItem('authToken');
    console.log(token)
    if(!token){
        throw new Error("Token not found")
        router.push('/');
    }

    try {
        const res = await axios.get(`${HTTP_URL}/api/v1/rooms/get-room`, {
            headers: {
                Authorization: `${token}`,
            },
            params: {slug}
        })
        if(res.status!== 200){
            throw new Error(res.data.message)
        }
        return res.data.room

    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Extract the error message from response, fallback to generic message
            throw new Error(error.response?.data?.message || "An error occurred");
        } else {
            throw new Error("An unknown error occurred");
        }
    }
    
}

export const CreateRoom = async(roomName: string, router: ReturnType<typeof useRouter>) =>{

const BACKEND_URL =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT
    : process.env.NEXT_PUBLIC_ENVIRONMENT === "staging"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_STAGING
    : process.env.NEXT_PUBLIC_BACKEND_URL_PRODUCTION;

  const API_PORT = process.env.NEXT_PUBLIC_HTTP_PORT || 5000;
    const HTTP_URL = `${BACKEND_URL}:${API_PORT}`;
    const token = localStorage.getItem('authToken');
    if(!token){
        throw new Error("Token not found")
        router.push('/');
    }
    try {
        const res = await axios.post(`${HTTP_URL}/api/v1/rooms/create-room`,
            {name: roomName},
            {
                headers: {
                    Authorization: `${token}`,
                },
            }
    )
        
        return res.data.room
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Extract the error message from response, fallback to generic message
            throw new Error(error.response?.data?.message || "An error occurred");
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}