import { createElement } from "react";
import { Root, createRoot } from "react-dom/client";

import Toast from "@/components/messages/toast/toast";

import { generateRandomText } from "@/utils/common";

const messageMap: Map<string, Root> = new Map<string, Root>();

type MessageType = "toast";

function removeExistingMessage(messageType: MessageType) {
  Array.from(messageMap.keys()).forEach((key) => {
    if (key.startsWith(messageType)) {
      clearMessage(key);
    }
  });
}

function setMessage(messageRootId: string): HTMLDivElement {
  const messageBox: HTMLDivElement = document.createElement("div");
  messageBox.setAttribute("id", messageRootId);
  document.getElementById("message-wrapper")!.appendChild(messageBox);
  return messageBox;
}

export function clearMessage(messageRootId: string) {
  const messageRoot: Root | undefined = messageMap.get(messageRootId);
  if (messageRoot) {
    // 해당 메시지 루트 언마운트
    messageRoot.unmount();
    // 메시지 id 로 생성된 div 삭제
    document.getElementById(messageRootId)?.remove();
    // Map 에서 삭제
    messageMap.delete(messageRootId);
  }
}

type ToastOptions = {
  message: string;
  duration?: number;
};

export function showToast(options: ToastOptions) {
  // 같은 유형의 메시지가 있다면 제거
  removeExistingMessage("toast");
  // id
  const messageRootId: string = `toast_${generateRandomText()}`;
  // root 생성
  const root: Root = createRoot(setMessage(messageRootId));
  // 컴포넌트 렌더링
  root.render(
    createElement(Toast, {
      ...options,
      ...{ messageRootId },
    }),
  );
  // Map 에 저장
  messageMap.set(messageRootId, root);
}
