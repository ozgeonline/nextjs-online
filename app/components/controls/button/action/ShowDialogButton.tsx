"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useVideoContext } from "@/app/components/providers/VideoContext";
import { MovieProps } from "@/app/types/props";
import Dialog from "@/app/components/widgets/dialog_widgets/Dialog";

interface PlayProps extends MovieProps {
  buttonStyle: string;
  children: React.ReactNode;
}

export default function ShowDialogButton({
  children,
  buttonStyle,
  ...movieProps
}: PlayProps ){

  const [open, setOpen] = useState<boolean>(false);
  const pathName = usePathname();
  const { setDialogOpen, currentVideoPause, currentVideoPlay } = useVideoContext();

  const clickOpenDialog = () => {
    setOpen(true);
    setDialogOpen(true);
    currentVideoPause();
  }

  const clickCloseDialog = () => {
    setOpen(false);
    setDialogOpen(false);
    currentVideoPlay();
  }
  

  return (
    <>
      <Link
        key={movieProps.movieId}
        href={`${pathName}?showDialog=${encodeURIComponent(movieProps.title as string)}`}
        className={buttonStyle}
        scroll={false}
        aria-label={`${movieProps.title} Dialog Open`}
        onClick={clickOpenDialog}
        prefetch={false}
      >
        {children}
      </Link>

      {open && 
        <Dialog
          onClose={() => clickCloseDialog()}
          {...movieProps}
        />
      }
    </>
  );
}
