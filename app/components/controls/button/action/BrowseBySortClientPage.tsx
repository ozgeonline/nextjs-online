"use client";

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import RedCircle_Animation from '@/app/components/animation/RedCircle_Animation';

const SortBySelect = dynamic(() => import('./SortBySelect'));

interface Movie {
  id: number;
  title: string;
  overview: string;
  imageString: string;
  videoSource: string;
  release: number;
  duration: number;
  age: number;
  cast: string;
  genres: string;
  category: string;
  WatchLists: any[];
}

interface CategoryPageClientProps {
  initialData: Movie[];
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
    const sorted = [...data].sort((a, b) =>
      sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
    setData(sorted)
  }, [sortOrder]);
  
  
  return (
    <div>
      {isPending ? (
        <>
          <div className='absolute z-[9999] w-full h-full top-[50vh] left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-brightness-50' >
            <RedCircle_Animation />
          </div>
          <SortBySelect data={data} sortOrder={sortOrder} onSortChange={handleSortChange} />
        </>
      ) : (
        <SortBySelect data={data} sortOrder={sortOrder} onSortChange={handleSortChange} />
      )}
    </div>
  );
};

export default BrowseBySortClientPage;
