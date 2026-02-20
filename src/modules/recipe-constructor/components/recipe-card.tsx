import { Button, Card, CardBody } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { IRecipe } from "../../../types/types";
import { store } from "../../../services/store";
import { EditIcon, EyeIcon, Trash } from "lucide-react";

export const RecipeCard = observer<{
  recipe: IRecipe;
}>((props) => {
  const { recipe } = props;

  const { recipeConstructor } = store;

  const { title, id } = recipe;

  return (
    <Card>
      <CardBody className="flex flex-row gap-2 justify-between items-center">
        <div>{title}</div>
        <div className="flex flex-row gap-2">
          <Button color="primary" variant="light" isIconOnly>
            <EyeIcon className="size-6" />
          </Button>
          <Button
            onPress={() => recipeConstructor.setRecipe(recipe)}
            color="primary"
            variant="light"
            isIconOnly
          >
            <EditIcon className="size-6" />
          </Button>
          <Button
            onPress={() => store.deleteRecipe(id)}
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
