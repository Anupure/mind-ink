'use client'
import React from 'react'
import { useParams } from 'next/navigation';

export default function Room() {
    const { slug } = useParams();
  return (
    <div>You have reached room {slug}</div>
  )
}
