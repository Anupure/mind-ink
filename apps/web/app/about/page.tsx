import { PaperEffect } from '@/ui/components/paperEffect'
import React from 'react'

const About = () => {
  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex justify-center items-center">
      <div className="md:w-[50%] w-[90%] flex justify-center items-center">
        <PaperEffect>
          <div className="flex flex-col justify-center items-center gap-4 p-6">
            <h1 className="text-2xl font-bold">🧠 About Us</h1>
            <p className="text-lg text-justify">
              <strong>Mind Ink</strong> is a collaborative whiteboarding tool designed for real-time idea sharing — whether you're sketching an ER diagram, walking through a sales report, or just brainstorming on a digital blackboard. Users can create or join rooms and collaborate using shapes, arrows, freehand drawing, and more.
              <br /><br />
              The project is developed and maintained by <strong>Anup Datta</strong>, a software engineer with over 6 years of experience building modern web applications.
              <br /><br />
              Want to know more about the person behind Mind Ink? Visit <a href="https://anupdatta.site/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">my portfolio</a> to explore more projects and connect.
            </p>
          </div>
        </PaperEffect>
      </div>
    </div>
  )
}

export default About
