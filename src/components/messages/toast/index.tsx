"use client";

import { useState, useRef, useEffect, useCallback } from "react";

import { clearMessage } from "@/utils/message";

import {
  ToastVariants,
  type ToastColorType,
  type ToastSizeType,
} from "./variants";
import { cn } from "@/utils/cn";

type ToastProps = {
  messageId: string;
  message: string;
  color?: ToastColorType;
  size?: ToastSizeType;
  duration?: number;
};

export default function Toast(props: ToastProps) {
  const { messageId, message, duration = 2000, color, size } = props;

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
    }, 290);
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
      className={cn(ToastVariants({ color: color, size: size }))}
    >
      {message}
    </p>
  );
}
