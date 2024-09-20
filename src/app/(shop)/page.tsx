"use client";

import { useState } from "react";

import Modal from "@/components/modal/modal";
import Button from "@/components/button/button";

import { showToast } from "@/utils/message";

export default function Home() {
  const [showModal, setShowModal] = useState<boolean>(false);

  const showToastMessage = () => {
    showToast({ message: "토스트 메시지" });
  };

  return (
    <main className="p-3">
      <div>메인 페이지</div>

      <Button type="button" size="sm" onClick={() => setShowModal(true)}>
        <span>모달</span>
      </Button>
      <Button type="button" size="sm" onClick={() => showToastMessage()}>
        <span>토스트 메시지</span>
      </Button>

      {showModal ? (
        <Modal setIsModalOpen={setShowModal} isCloseOnClickOverlay={true}>
          <div className="bg-white p-5">이건 모달이오</div>
        </Modal>
      ) : (
        <></>
      )}
    </main>
  );
}
