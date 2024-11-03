import { createElement } from "react";
import { Root, createRoot } from "react-dom/client";

import Toast from "@/components/messages/toast";

import { generateRandomText } from "@/utils/common";
import {
  ToastColorType,
  ToastSizeType,
} from "@/components/messages/toast/variants";

const messageMap: Map<string, Root> = new Map<string, Root>();

type MessageType = "toast";

function removeExistingMessage(messageType: MessageType) {
  Array.from(messageMap.keys()).forEach((key) => {
    if (key.startsWith(messageType)) {
      clearMessage(key);
    }
  });
}

function setMessage(): HTMLDivElement {
  return document.getElementById("message-wrapper")! as HTMLDivElement;
}

export function clearMessage(messageId: string) {
  const messageRoot: Root | undefined = messageMap.get(messageId);
  if (messageRoot) {
    // 해당 메시지 루트 언마운트
    messageRoot.unmount();
    // 메시지 id 로 생성된 div 삭제
    document.getElementById(messageId)?.remove();
    // Map 에서 삭제
    messageMap.delete(messageId);
  }
}

type ToastOptions = {
  message: string;
  duration?: number;
  color?: ToastColorType;
  size?: ToastSizeType;
};

export function showToast(options: ToastOptions) {
  // 같은 유형의 메시지가 있다면 제거
  removeExistingMessage("toast");
  // id
  const messageId: string = `toast_${generateRandomText()}`;
  // root 생성
  const root: Root = createRoot(setMessage());
  // 컴포넌트 렌더링
  root.render(
    createElement(Toast, {
      ...options,
      ...{ messageId },
    }),
  );
  // Map 에 저장
  messageMap.set(messageId, root);
}
