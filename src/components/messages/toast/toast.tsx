"use client";

import { useState, useRef, useEffect, useCallback } from "react";

import { clearMessage } from "@/utils/message";

type ToastProps = {
  messageId: string;
  message: string;
  duration?: number;
};

export default function Toast(props: ToastProps) {
  const { messageId, message, duration = 3000 } = props;

  // refs
  const toastRef = useRef<HTMLParagraphElement>(null);
  const timeoutRef = useRef<number>();

  // values
  const [isClose, setIsCode] = useState<boolean>(false);

  // 자동 닫기
  const close = useCallback(() => {
    setIsCode(true);
    setTimeout(() => {
      clearMessage(messageId);
    }, 300);
  }, [messageId]);

  const setAutoCloseTimeout = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => {
      close();
    }, duration);
  }, [duration, close]);

  useEffect(() => {
    if (isClose) toastRef.current!.classList.add("animate-fadeOut");
  }, [isClose]);

  useEffect(() => {
    // 타임아웃 설정
    setAutoCloseTimeout();
    // unmount
    return () => {
      // 컴포넌트가 unmount 될 때 타임아웃 클리어
      clearTimeout(timeoutRef.current!);
    };
  }, [setAutoCloseTimeout]);

  return (
    <p
      id={messageId}
      ref={toastRef}
      className="animate-fadeIn absolute bottom-[20%] left-1/2 z-40 w-auto max-w-[85%] -translate-x-1/2 rounded-lg bg-black/85 px-16 py-2 text-center text-lg text-white shadow-xl"
    >
      {message}
    </p>
  );
}
