import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { cloneElement, useState } from "react";

type TProps = {
  children: React.ReactNode;
  onConfirm: () => void;
  title?: string;
  message?: string;
  color?: "danger" | "primary";
  confirmText?: string;
  cancelText?: string;
};

export const ConfirmationWrapper = (props: TProps) => {
  const {
    children,
    onConfirm,
    title = "Подтверждение",
    message = "Вы уверены, что хотите выполнить это действие?",
    confirmText = "Подтвердить",
    cancelText = "Отмена",
    color = "primary",
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  // Проверяем, что передан только один дочерний элемент (кнопка)

  if (!children || typeof children !== "object" || !("type" in children)) {
    throw new Error(
      "ConfirmationWrapper должен содержать только один дочерний элемент"
    );
  }

  // Клонируем кнопку и добавляем обработчик клика
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buttonWithClick = cloneElement(children as any, {
    onClick: openModal,
  });

  return (
    <>
      {buttonWithClick}
      <Modal placement="center" size="sm" isOpen={isOpen} onClose={closeModal}>
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>{message}</ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={closeModal}>
              {cancelText}
            </Button>
            <Button color={color} onPress={handleConfirm}>
              {confirmText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
