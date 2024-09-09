"use client";

import { useRef, useEffect } from "react";

type ToastProps = {
  message: string;
  duration?: number;
  onClose?: () => void;
};

export default function Toast(props: ToastProps) {
  return (
    <p className="top-1/6 -translate-y-1/6 absolute left-1/2 w-60 -translate-x-1/2 rounded-lg bg-black/80 px-4 py-2 text-center text-white">
      {props.message}
    </p>
  );
}
