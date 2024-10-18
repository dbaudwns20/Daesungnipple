import SignIn from "@/app/(auth)/sign-in/page";

import Modal from "@/components/modal";

export default function ModalSignIn() {
  return (
    <Modal isCloseOnClickOverlay={true} width="w-[480px]">
      <SignIn />
    </Modal>
  );
}
