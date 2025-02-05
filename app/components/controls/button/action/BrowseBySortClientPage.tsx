"use client";

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import RedCircle_Animation from '@/app/components/animation/RedCircle_Animation';
import { MovieProps } from '@/app/types/props';

const SortBySelect = dynamic(() => import('./SortBySelect'));



interface CategoryPageClientProps extends MovieProps{
  initialData: MovieProps[];
  initialSortOrder: 'default' | 'asc' | 'desc';
  title: string;
}

const BrowseBySortClientPage = ({ initialData, initialSortOrder, title }: CategoryPageClientProps) => {
  const [data, setData] = useState(initialData);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSortChange = (order: 'default' | 'asc' | 'desc') => {
    startTransition(() => {
      setSortOrder(order);
    });

    const currentParams = new URLSearchParams(Object.fromEntries(searchParams));
    currentParams.set('sortOrder', order);
    router.push(`/${title}?${currentParams.toString()}`);
  };


  useEffect(() => {
    const sorted = [...data].sort((a, b) => {
      const aTitle = a.title ?? '';
      const bTitle = b.title ?? '';
      return sortOrder === 'asc' ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
    });
    setData(sorted);
  }, [sortOrder, initialData]);

  
  
  return (
    <div>
      {isPending ? (
        <>
          <div className='absolute z-[9999] w-full h-full top-[50vh] left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-brightness-50' >
            <RedCircle_Animation />
          </div>
          <SortBySelect 
            data={data.filter((movie): movie is Required<MovieProps> => 
              movie.title !== undefined
            )} 
            sortOrder={sortOrder} 
            onSortChange={handleSortChange} 
          />
        </>
      ) : (
        <SortBySelect 
          data={data.filter((movie): movie is Required<MovieProps> => movie.title !== undefined)} 
          sortOrder={sortOrder} 
          onSortChange={handleSortChange} 
        />
      )}
    </div>
  );
};

export default BrowseBySortClientPage;
