"use client"

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useVideoContext } from "@/app/components/providers/VideoContext";
import { MovieProps } from "@/app/types/props";
import Dialog from "@/app/components/widgets/dialog_widgets/Dialog";

interface DialogTriggerButtonProps extends MovieProps {
  buttonStyle: string;
  children: React.ReactNode;
}

export default function DialogTriggerButton({
  children,
  buttonStyle,
  ...movieProps
}: DialogTriggerButtonProps) {

  const [isDialogMounted, setIsDialogMounted] = useState<boolean>(false);
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { setDialogOpen, currentVideoPause, currentVideoPlay } = useVideoContext();
  const movieTitle = movieProps.title;
  const activeDialogTitle = searchParams.get("showDialog");

  const dialogHref = useMemo(() => {
    if (!movieTitle) return pathName;

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("showDialog", movieTitle);

    return `${pathName}?${nextParams.toString()}`;
  }, [movieTitle, pathName, searchParams]);

  useEffect(() => {
    if (!movieTitle) return;

    if (activeDialogTitle === movieTitle) {
      setIsDialogMounted(true);
      setDialogOpen(true);
      currentVideoPause();
      return;
    }

    if (isDialogMounted) {
      setIsDialogMounted(false);
      setDialogOpen(false);
      currentVideoPlay();
    }
  }, [
    activeDialogTitle,
    currentVideoPause,
    currentVideoPlay,
    isDialogMounted,
    movieTitle,
    setDialogOpen,
  ]);

  const clickOpenDialog = () => {
    if (!movieTitle) return;

    setIsDialogMounted(true);
    setDialogOpen(true);
    currentVideoPause();
  }

  const clickCloseDialog = () => {
    setIsDialogMounted(false);
    setDialogOpen(false);
    currentVideoPlay();
  }

  if (!movieTitle) {
    return null;
  }

  return (
    <>
      <Link
        href={dialogHref}
        className={buttonStyle}
        scroll={false}
        aria-label={`Open dialog for ${movieTitle}`}
        onClick={clickOpenDialog}
        prefetch={false}
      >
        {children}
      </Link>

      {isDialogMounted && 
        <Dialog
          onClose={() => clickCloseDialog()}
          {...movieProps}
        />
      }
    </>
  );
}
