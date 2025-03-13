"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import RedCircle_Animation from "../../animation/RedCircle_Animation";

interface Props {
  path: string;
  label: string;
}

export default function NavbarLink({ path, label }: Props) {
  const pathName = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (pathName === path) return;
    setIsLoading(true);

    startTransition(() => {
      router.push(path);
    });
  };
  useEffect(() => {
    if (!isPending) {
      setIsLoading(false);
    }
  }, [isPending, pathName]);
  
  return (
    <>
      {pathName === path ? (
        <li>
          <Link
            href={path}
            className="text-white font-semibold text-xs xl:text-sm tracking-wider cursor-default"
            prefetch={true}
          >
            {label}
          </Link>
        </li>
        ) : (
        <li>
          <Link
            href={path}
            onClick={handleClick}
            className="text-white text-xs xl:text-sm tracking-wider hover:text-main-white_300 transition-colors ease-in"
            prefetch={true}
          >
            {label}
          </Link>
        </li>
      )}
    
      {
        isPending || isLoading ? 
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <RedCircle_Animation />
          </div>
        : null
      }
    </>
  )
};