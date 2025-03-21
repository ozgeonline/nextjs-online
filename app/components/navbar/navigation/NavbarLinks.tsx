"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useCardContext } from "../../providers/CardContext";

interface Props {
  path: string;
  label: string;
}

export default function NavbarLink({ path, label }: Props) {
  const pathName = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { setIsOpen,isOpen, triggerNavigation, setIsLoading } = useCardContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    //console.log(`handleClick, `,isOpen)
    e.preventDefault();
    if (pathName === path) return;
    setIsOpen(false);

    triggerNavigation(() => {
      startTransition(() => {
        router.push(path);
        setIsLoading(false);
      });
    });
  };

  useEffect(() => {
    if (!isPending  && !isOpen) {
      setIsLoading(false);
    }
  }, [isPending, isOpen, setIsLoading]);

  // useEffect(() => {
  //   console.log("isPending:", isPending, "isLoading:", isLoading);
  // }, [isPending, isLoading]);
  return (
    <>
      {pathName === path ? (
        <li>
          <Link
            href={path}
            className="text-white font-semibold text-sm lg:text-xs xl:text-sm tracking-wider cursor-default"
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
            className="text-white text-sm lg:text-xs xl:text-sm tracking-wider hover:text-main-white_300 transition-colors ease-in"
            prefetch={true}
          >
            {label}
          </Link>
        </li>
      )}
    </>
  )};