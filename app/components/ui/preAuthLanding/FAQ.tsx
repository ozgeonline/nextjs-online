"use client"

import * as React from 'react'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import FAQData from '@/app/data/FAQ'
import dynamic from 'next/dynamic'

const LoginInput = dynamic(() => import("../../controls/signin/LoginInput"));

export default function FQA() {

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div
      className='flex flex-col justify-center items-center py-20 px-8 border-t-8 bg-black'
    >
      <h1 className='text-lg sm:text-2xl lg:text-5xl font-extrabold mb-7'>
        Frequently Asked Questions
      </h1>
      {FAQData.map((data,index) => (
        <div 
          key={data.id}
          className='flex flex-col justify-center items-center w-full'
        >
          <div
            onClick={() => toggleAccordion(index)}
            className="
              flex justify-between items-center
              w-full max-w-[1170px] bg-main-gray text-white mb-[2px] px-6 py-4 hover:brightness-150 cursor-pointer"
          >
            <div className="text-lg lg:text-2xl font-thin">
              {data.title}
            </div>
            <div>
              {openIndex === index 
                ? <Plus className='rotate-45 lg:text-5xl text-base font-extralight transition-all ease-linear'/> 
                : <Plus className='lg:text-5xl text-xl transition-all ease-linear'/>
              }
            </div>
          </div>
          {openIndex === index && (
            <div 
              className="bg-main-gray text-white text-lg lg:text-2xl mb-2 p-6 w-full max-w-[1170px] transition-all transition-effect"
            >
              <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
            </div>
          )}
        </div>
      ))}

      <div className='flex flex-col justify-center mt-12'>
        <div className='lg:text-xl text-center mx-6 mb-2'>
          Ready to watch? Enter your email to create or restart your membership.
        </div>
        <LoginInput />
      </div>
    </div>    
  )
}