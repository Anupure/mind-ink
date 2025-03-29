'use client'
import { useParams } from 'next/navigation';
import { RoomCanvas } from '@/app/components/RoomCanvas';



export default function RoomPage() {
  console.log("Inside RoomPage");
  const { slug } = useParams<{ slug: string }>();
  console.log("room slug: ", slug);

  return <RoomCanvas slug={slug} />;
}


