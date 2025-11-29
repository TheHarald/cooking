import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Unit, type IIngredient } from "../../../types/types";
import { makeAutoObservable, toJS } from "mobx";
import { unitLabels } from "../../../services/constants";

class IngredientFormStore {
  ingredient: IIngredient;

  get hasError() {
    return this.ingredient.name === "" || this.ingredient.amount < 0;
  }

  constructor(ingredient: IIngredient) {
    this.ingredient = { ...ingredient };
    makeAutoObservable(this);
  }

  public setField<K extends keyof IIngredient>(
    field: K,
    value: IIngredient[K]
  ) {
    this.ingredient[field] = value;
  }
}

export const IngredientFormModal = observer<{
  title: string;
  ingredient: IIngredient;
  onConfirm: (ingredient: IIngredient) => void;
  onCancel: VoidFunction;
}>(({ ingredient: initIngredient, onConfirm, onCancel, title }) => {
  const store = useMemo(
    () => new IngredientFormStore(initIngredient),
    [initIngredient]
  );
  const { ingredient } = store;

  const confirmHandler = () => {
    onConfirm(toJS(store.ingredient));
  };

  return (
    <Modal onClose={onCancel} isOpen>
      <ModalContent>
        <ModalHeader className="px-4">{title}</ModalHeader>
        <ModalBody className="px-4">
          <Input
            label="Название"
            value={ingredient.name}
            onChange={(e) => store.setField("name", e.target.value)}
            placeholder="Название"
            isRequired
          />

          <div className="flex flex-row gap-2">
            <Input
              label="Количество"
              type="number"
              value={ingredient.amount.toString()}
              onChange={(e) =>
                store.setField("amount", parseFloat(e.target.value) || 0)
              }
              min={0}
              step={0.1}
              isRequired
              className="flex-1"
            />
            <Select
              selectedKeys={[ingredient.unit]}
              label="Ед. измерения"
              className="w-[140px]"
              variant="bordered"
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                store.setField("unit", value as Unit);
              }}
            >
              {Object.entries(unitLabels).map(([unit, label]) => (
                <SelectItem key={unit}>{label}</SelectItem>
              ))}
            </Select>
          </div>
          <Input
            label="Примечание"
            value={ingredient.note || ""}
            onChange={(e) => store.setField("note", e.target.value)}
            placeholder="Примечание"
          />
        </ModalBody>
        <ModalFooter className="flex justify-between px-4">
          <Button variant="flat" onPress={onCancel}>
            Отмена
          </Button>
          <Button
            isDisabled={store.hasError}
            color="primary"
            onPress={confirmHandler}
          >
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
