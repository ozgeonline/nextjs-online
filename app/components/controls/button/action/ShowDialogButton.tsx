"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
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
  const { setDialogOpen, currentVideoPause, currentVideoPlay,isDialogOpen } = useVideoContext();

  const clickOpenDialog = () => {
    console.log("show dialog open")
    setOpen(true)
    setDialogOpen(true)
    currentVideoPause()
  }

  const clickCloseDialog = () => {
    console.log("show dialog closed")
    setOpen(false)
    setDialogOpen(false)
    currentVideoPlay()
  }

  useEffect(() => {
    setDialogOpen(open);
    if (open == true) {
      currentVideoPause();
    } else {
      currentVideoPlay();
    }
  }, [open]);


  useEffect(() => {
    if (isDialogOpen) {
      currentVideoPause();
    } else {
      currentVideoPlay();
    }
  }, [isDialogOpen, ]);
  //console.log("isDialogOpen",isDialogOpen)
  

  return (
    <>
      <Link
        key={movieProps.movieId}
        href={`${pathName}?showDialog=${encodeURIComponent(movieProps.title as string)}`}
        className={buttonStyle}
        scroll={false}
        aria-label={`${movieProps.title} Dialog Open`}
        onClick={clickOpenDialog}
      >
        {children}
      </Link>

      {open == true && 
        <Dialog
          onClose={() => clickCloseDialog()}
          {...movieProps}
        />
      }
    </>
  );
}