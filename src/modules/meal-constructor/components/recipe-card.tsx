import { Card, CardBody } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { IRecipe } from "../../../types/types";

export const RecipeCard = observer<{
  recipe: IRecipe;
}>((props) => {
  const { recipe } = props;

  const { title } = recipe;

  return (
    <Card>
      <CardBody className="flex flex-row gap-2 justify-between items-center">
        <div>{title}</div>
      </CardBody>
    </Card>
  );
});
