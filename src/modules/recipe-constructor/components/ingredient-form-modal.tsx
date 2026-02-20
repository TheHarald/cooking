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
import { Unit } from "../../../types/types";
import { unitLabels } from "../../../services/constants";
import { store } from "../../../services/store";
import { useTranslation } from "react-i18next";

export const IngredientFormModal = observer(() => {
  const { recipeConstructor } = store;

  const { targetIngredient, isNewIngredient } = recipeConstructor;

  const { t } = useTranslation();

  if (targetIngredient === undefined) return null;

  const { name, amount, unit, note } = targetIngredient;

  const onCancel = () => {
    recipeConstructor.setIngredient(undefined);
  };

  return (
    <Modal placement="top" onClose={onCancel} isOpen>
      <ModalContent>
        <ModalHeader className="px-4">
          {isNewIngredient ? "Создание" : "Редактирование"}
        </ModalHeader>
        <ModalBody className="px-4">
          <Input
            label={t("ingredient-name-label")}
            value={name}
            onChange={(e) =>
              recipeConstructor.setIngredientField("name", e.target.value)
            }
            placeholder={t("ingredient-name-placeholder")}
            isRequired
          />

          <div className="flex flex-row gap-2">
            <Input
              label="Количество"
              type="number"
              value={amount.toString()}
              onChange={(e) =>
                recipeConstructor.setIngredientField(
                  "amount",
                  parseFloat(e.target.value) || 0,
                )
              }
              min={0}
              step={0.1}
              isRequired
              className="flex-1"
            />
            <Select
              selectedKeys={[unit]}
              label="Ед. измерения"
              className="w-[140px]"
              variant="bordered"
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                recipeConstructor.setIngredientField("unit", value as Unit);
              }}
            >
              {Object.entries(unitLabels).map(([unit, label]) => (
                <SelectItem key={unit}>{label}</SelectItem>
              ))}
            </Select>
          </div>
          <Input
            label="Примечание"
            value={note || ""}
            onChange={(e) =>
              recipeConstructor.setIngredientField("note", e.target.value)
            }
            placeholder="Примечание"
          />
        </ModalBody>
        <ModalFooter className="flex justify-between px-4">
          <Button variant="flat" onPress={onCancel}>
            Отмена
          </Button>
          <Button
            // isDisabled={store.hasError}
            color="primary"
            onPress={() => recipeConstructor.saveIngredient()}
          >
            {isNewIngredient ? "Создать" : "Сохранить"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
