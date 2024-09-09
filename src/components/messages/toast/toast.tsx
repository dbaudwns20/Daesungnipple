"use client";

import { useRef, useEffect } from "react";

type ToastProps = {
  message: string;
  duration?: number;
  onClose?: () => void;
};

export default function Toast(props: ToastProps) {
  return <p>{props.message}</p>;
}
