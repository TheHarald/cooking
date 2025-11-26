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
import { useMemo, useState } from "react";
import { Unit, type IIngredient } from "../../types/types";
import { makeAutoObservable, toJS } from "mobx";

const unitLabels: Record<Unit, string> = {
  [Unit.GRAMS]: "гр",
  [Unit.KILOGRAMS]: "кг",
  [Unit.MILLIGRAMS]: "мг",
  [Unit.MILLILITERS]: "мл",
  [Unit.LITERS]: "л",
  [Unit.TEASPOON]: "ч.л.",
  [Unit.TABLESPOON]: "ст.л.",
  [Unit.CUP]: "стакан",
  [Unit.PIECES]: "шт",
  [Unit.BUNCH]: "пучок",
  [Unit.CLOVE]: "зубчик",
  [Unit.STALK]: "стебель",
  [Unit.PINCH]: "щепотка",
  [Unit.TO_TASTE]: "по вкусу",
  [Unit.SERVING]: "порция",
  [Unit.PACKAGE]: "упаковка",
};

function getUnitLabel(unit: Unit): string {
  return unitLabels[unit] ?? "неизвестно";
}

class IngredientFormStore {
  ingredient: IIngredient;

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

export const AddIngredientButton = observer<{
  title: string;
  ingredient: IIngredient;
  onConfirm: (ingredient: IIngredient) => void;
}>(({ ingredient: initIngredient, onConfirm, title }) => {
  const [open, setOpen] = useState(false);

  const store = useMemo(() => new IngredientFormStore(initIngredient), []);
  const { ingredient } = store;

  const closeHandler = () => {
    setOpen(false);
  };

  const openHandler = () => {
    setOpen(true);
  };

  const confirmHandler = () => {
    onConfirm(toJS(store.ingredient));
    closeHandler();
  };

  return (
    <>
      <Button onPress={openHandler}>Добавить ингредиент</Button>
      <Modal onClose={closeHandler} isOpen={open}>
        <ModalContent>
          <ModalHeader className="px-2">{title}</ModalHeader>
          <ModalBody className="px-2">
            <Input
              label="Название ингредиента"
              value={ingredient.name}
              onChange={(e) => store.setField("name", e.target.value)}
              placeholder="Например: Мука пшеничная"
              isRequired
            />

            <div className="flex gap-3">
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
                className="w-[120px]"
                variant="bordered"
                onChange={(e) => store.setField("unit", e.target.value as Unit)}
              >
                {Object.entries(unitLabels).map(([unit, label]) => (
                  <SelectItem key={unit}>{label}</SelectItem>
                ))}
              </Select>
            </div>

            <Input
              label="Категория (опционально)"
              value={ingredient.category || ""}
              onChange={(e) => store.setField("category", e.target.value)}
              placeholder="Например: Бакалея, Овощи, Молочные продукты"
            />

            <Input
              label="Примечание (опционально)"
              value={ingredient.note || ""}
              onChange={(e) => store.setField("note", e.target.value)}
              placeholder="Например: Высший сорт, Свежий"
            />

            <ModalFooter>
              <Button variant="flat" onPress={closeHandler}>
                Отмена
              </Button>
              <Button color="primary" onPress={confirmHandler}>
                Сохранить
              </Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
