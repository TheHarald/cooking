import { Button, Card, CardBody } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { IIngredient } from "../../../types/types";
import { getUnitLabel } from "../../../types/units";
import { EditIcon, Trash } from "lucide-react";
import { store } from "../../../services/store";

export const IngredientCard = observer<{
  ingredient: IIngredient;
}>(({ ingredient }) => {
  const { mealConstructor } = store;
  const { unit, name, amount, id } = ingredient;

  const unitLablel = getUnitLabel(unit);

  return (
    <Card>
      <CardBody className="flex flex-row gap-2 justify-between items-center">
        <div>
          {name},{amount} {unitLablel}
        </div>
        <div className="flex flex-row gap-2">
          <Button
            onPress={() => mealConstructor.setIngredient(ingredient)}
            color="primary"
            variant="light"
            isIconOnly
          >
            <EditIcon className="size-6" />
          </Button>
          <Button
            onPress={() => mealConstructor.deleteIngredient(id)}
            color="danger"
            variant="light"
            isIconOnly
          >
            <Trash className="size-6" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
});
