"use client";

import {
  ReactNode,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

import { ModalVariants } from "./variants";

import { cn } from "@/utils/cn";

type ModalProps = {
  children: ReactNode;
  isCloseOnClickOverlay?: boolean;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
  width?: string;
};

export default function Modal(props: ModalProps) {
  const {
    children,
    isCloseOnClickOverlay = false,
    setIsModalOpen = null /** 닫기 함수가 없다면 url 경로를 갖고 있는 모달로 취급한다.  */,
    width = "w-[580px]",
  } = props;

  // refs
  const overlayRef = useRef<HTMLSelectElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // router
  const router = useRouter();

  // 모달 닫기
  const closeModal = useCallback(() => {
    overlayRef.current?.classList.add("animate-[fade-out_0.2s_ease_forwards]");
    setTimeout(() => {
      overlayRef.current?.classList.remove(
        "animate-[fade-out_0.2s_ease_forwards]",
      );
      setIsModalOpen ? setIsModalOpen(false) : router.back();
    }, 200);
  }, [setIsModalOpen, router]);

  // Esc 키를 누르면 모달 닫기
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    },
    [closeModal],
  );

  // 백그라운드 클릭 시
  const handleOverlayClick: MouseEventHandler = useCallback(
    (e) => {
      if (isCloseOnClickOverlay && e.target === overlayRef.current)
        closeModal();
    },
    [isCloseOnClickOverlay, closeModal, overlayRef],
  );

  // 키 이벤트 등록
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown); // 이벤트 제거
  }, [onKeyDown]);

  return (
    <section
      ref={overlayRef}
      className="fixed inset-0 z-20 mx-auto animate-[fade-in_0.2s_ease_forwards] overflow-hidden bg-black/60"
      onClick={handleOverlayClick}
    >
      <div ref={modalRef} className={cn(ModalVariants({}), width)}>
        {children}
      </div>
    </section>
  );
}
