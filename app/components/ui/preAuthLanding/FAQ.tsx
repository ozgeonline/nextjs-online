"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'
import LoginInput from "@/app/components/controls/auth/LoginInput"
import type { LandingContent } from '@/app/data/preAuthLandingContent'

type FAQProps = {
  faq: LandingContent["faq"]
  emailInput: LandingContent["emailInput"]
}

export default function FAQ({
  faq,
  emailInput,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex((currentIndex) => currentIndex === index ? null : index)
  }

  return (
    <section className='flex flex-col justify-center items-center py-20 px-8 border-t-8 bg-black'>
      <h2 className='text-lg sm:text-2xl lg:text-5xl font-extrabold mb-7'>
        {faq.title}
      </h2>
      {faq.items.map((data, index) => (
        <div
          key={data.id}
          className='flex flex-col justify-center items-center w-full'
        >
          <button
            type="button"
            id={`faq-trigger-${data.id}`}
            onClick={() => toggleAccordion(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-content-${data.id}`}
            className="
              flex justify-between items-center
              w-full max-w-[1170px] bg-main-gray text-white mb-[2px] px-6 py-4 hover:brightness-150 cursor-pointer text-left"
          >
            <div className="text-lg lg:text-2xl font-thin">
              {data.title}
            </div>
            <div aria-hidden="true">
              {openIndex === index
                ? <Plus className='rotate-45 lg:text-5xl text-base font-extralight transition-all ease-linear' />
                : <Plus className='lg:text-5xl text-xl transition-all ease-linear' />
              }
            </div>
          </button>
          {openIndex === index && (
            <div
              id={`faq-content-${data.id}`}
              role="region"
              aria-labelledby={`faq-trigger-${data.id}`}
              className="bg-main-gray text-white text-lg lg:text-2xl mb-2 p-6 w-full max-w-[1170px] transition-all transition-effect"
            >
              {data.content}
            </div>
          )}
        </div>
      ))}

      <div className='flex flex-col justify-center mt-12'>
        <div className='lg:text-xl text-center mx-6 mb-2'>
          {faq.readyText}
        </div>
        <LoginInput
          placeholder={emailInput.placeholder}
          errorMessage={emailInput.errorMessage}
          submitLabel={emailInput.submitLabel}
        />
      </div>
    </section>
  )
}
