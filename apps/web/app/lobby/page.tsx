'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PaperEffect } from '@/ui/components/paperEffect';
import { Circle } from 'lucide-react';
import { Input } from '@/ui/components/input';
import {InkButton } from '@/ui/components/inkButton';
import {CreateRoom, getRoom} from './getOrSetRoom';
export default function LobbyPage() {
  const [isTokenPresent, setIsTokenPresent] = useState(false);
  const router = useRouter();
  const [createRoomName, setCreateRoomName] = useState('');
  const [getRoomName, setGetRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsTokenPresent(!!token);

    if (!token) {
      router.push('/');
    }
  }, [router]);

  if (!isTokenPresent) {
    return <div>Loading...</div>;
  }
  const setRoom = () => {
    setErrorMessage('');
    CreateRoom(createRoomName, router)
     .then(room => {
        console.log("value of room i s: ",room);
        router.push(`/room/${room}`);
     })
     .catch(error => {
        setErrorMessage(error.message);
      });
  };
  
  const getRoomId = () => {
    setErrorMessage('');
    getRoom(getRoomName, router)
     .then(room => {
        console.log('returned room = ',room);
        router.push(`/room/${room.slug}`);
      })
     .catch(error => {
        setErrorMessage(error.message);
      });
  }

  return (
    <div>
      <div className='transform container mx-auto px-4 py-6 '>
      <PaperEffect>
          <div className='flex justify-between'>
            <div></div>
            <div className='flex flex-col text-center min-w-10'>
              <h1 className='text-2xl font-semibold font-handWritten'>Lobby Page</h1>
              <p>Welcome to the lobby page!</p>
            </div>
            <div className='flex align-middle justify-center text-center my-auto'>
              <Circle size={24} color="green" fill="green" className='mr-2'/>
              <p>Current User COunt: 1</p> 
            </div>
          </div>
        </PaperEffect>
      </div>
      <div className='container mx-auto px-4 py-6 '>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <div>
            <PaperEffect>
              <div className='flex flex-col justify-around gap-5 py-10'>
                <h1 >Create Room:</h1>
                <Input type='text' placeholder='Room Name' value={createRoomName} onChange={(e)=>setCreateRoomName(e.target.value)}/>
                <InkButton onClick={setRoom}>Create</InkButton>
              </div>
            </PaperEffect>
          </div>
          <div>
            <PaperEffect>
              <div className='flex flex-col justify-around gap-5 py-10'>
                <h1>Join Room:</h1>
                <Input type='text' value={getRoomName} onChange={(e)=>setGetRoomName(e.target.value)} placeholder='Room Name'/>
                <InkButton onClick={getRoomId}>Join</InkButton>
              </div>
            </PaperEffect>
          </div>
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        </div>  
      </div>  
    </div>
  );
  }
  
