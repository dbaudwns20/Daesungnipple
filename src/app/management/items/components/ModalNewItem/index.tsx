import {
  Dispatch,
  SetStateAction,
  useRef,
  ChangeEvent,
  useEffect,
} from "react";

import Modal from "@/components/modal";
import Input, { type InputType } from "@/components/input";
import { Button } from "@/components/button";
import { useFormData } from "@/hooks";

export default function ModalNewItem(props: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { setIsModalOpen } = props;

  // refs
  const nameRef = useRef<InputType>(null);

  const [newItem, bindNewItem] = useFormData({
    name: "",
    stockCount: 0,
    description: "",
  });

  useEffect(() => {
    nameRef.current?.setFocus();
  }, []);

  return (
    <Modal
      isCloseOnClickOverlay={false}
      width="w-[480px]"
      setIsModalOpen={setIsModalOpen}
    >
      <div className="p-7">
        <h1 className="mb-4 text-xl font-bold text-gray-700">재고 신규</h1>
        <form noValidate>
          <Input
            ref={nameRef}
            type="text"
            name="name"
            label="이름"
            value={newItem.name}
            required={{
              isRequired: true,
              invalidMessage: "이름을 입력해주세요.",
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              bindNewItem("name", e.target.value);
            }}
            valueRange={[2, 999]}
          />
          <Input
            type="number"
            name="stockCount"
            label="수량"
            value={newItem.stockCount}
            required={{
              isRequired: true,
              invalidMessage: "수량을 입력해주세요.",
            }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              bindNewItem("stockCount", Number(e.target.value));
            }}
            valueRange={[-1, 999999]}
          />
          <Button type="submit" color="blue" additionalClass="w-full">
            저장
          </Button>
        </form>
      </div>
    </Modal>
  );
}
