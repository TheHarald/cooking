import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { IRecipe } from "../../../types/types";
import { store } from "../../../services/store";
import { EditIcon, Eye, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { MealImage } from "./meal-image";
import { useTranslation } from "react-i18next";
import { useMemo, useEffect } from "react";

export const RecipeCard = observer<{ recipe: IRecipe }>(({ recipe }) => {
  const { recipeConstructor, recipeViwer } = store;
  const { t } = useTranslation();

  const {
    title,
    id,
    image,
    ingredients,
    cookingSteps = [],
    isFavorite,
    tags,
  } = recipe;

  const imageSrc = useMemo(
    () => (image ? URL.createObjectURL(image) : undefined),
    [image]
  );

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  const ingredientsCount = ingredients.length;
  const stepsCount = cookingSteps.length;
  const hasMeta = ingredientsCount > 0 || stepsCount > 0 || tags.length > 0;

  return (
    <Card className="w-full overflow-hidden" shadow="sm">
      <CardBody className="flex flex-row p-0">
        <MealImage src={imageSrc} alt={title} />

        <div className="min-w-0 flex-1 flex flex-col gap-1 p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-medium text-foreground truncate min-w-0">
              {title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="primary"
                aria-label={t("recipe-view")}
                onPress={() => recipeViwer.setViewingRecipe(recipe)}
              >
                <Eye className="size-5" />
              </Button>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="secondary"
                    aria-label={t("edit")}
                  >
                    <MoreVerticalIcon className="size-5" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key="edit"
                    className="text-secondary"
                    startContent={<EditIcon className="size-5 shrink-0" />}
                    onPress={() => recipeConstructor.setRecipe(recipe)}
                  >
                    {t("edit")}
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    startContent={<TrashIcon className="size-5 shrink-0" />}
                    onPress={() => store.deleteRecipe(id)}
                  >
                    {t("delete")}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {hasMeta && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-default-500">
              {ingredientsCount > 0 && (
                <span>{t("recipe-ingredients-count", { count: ingredientsCount })}</span>
              )}
              {stepsCount > 0 && (
                <span>{t("recipe-steps-count", { count: stepsCount })}</span>
              )}
              {isFavorite && (
                <span className="text-primary" aria-hidden>♥</span>
              )}
              {tags.length > 0 && (
                <span className="truncate">{tags.slice(0, 2).join(", ")}</span>
              )}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
});
