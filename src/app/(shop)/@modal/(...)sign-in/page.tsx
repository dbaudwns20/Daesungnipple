import SignIn from "@/app/(auth)/sign-in/page";

import Modal from "@/components/modal/modal";

export default function ModalSignIn() {
  return (
    <Modal isCloseOnClickOverlay={true}>
      <SignIn />
    </Modal>
  );
}
