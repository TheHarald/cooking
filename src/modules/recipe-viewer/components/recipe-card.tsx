import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { IRecipe } from "../../../types/types";
import { store } from "../../../services/store";
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const RecipeCard = observer<{
  recipe: IRecipe;
}>((props) => {
  const { recipe } = props;

  const { recipeConstructor } = store;

  const { title, id } = recipe;

  const { t } = useTranslation();

  return (
    <Card>
      <CardBody className="flex flex-row gap-2 justify-between items-center">
        <div>{title}</div>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly color="secondary" variant="light">
              <MoreVerticalIcon className="size-6" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              startContent={<EditIcon className="size-6" />}
              key="edit"
              onPress={() => recipeConstructor.setRecipe(recipe)}
            >
              {t("edit")}
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              startContent={<TrashIcon className="size-6" />}
              onPress={() => store.deleteRecipe(id)}
            >
              {t("delete")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardBody>
    </Card>
  );
});

export const RecipeCard2 = observer<{
  recipe: IRecipe;
}>((props) => {
  const { recipe } = props;

  const { recipeConstructor } = store;

  const { title, id, image } = recipe;

  const { t } = useTranslation();

  return (
    <Card isFooterBlurred className="w-full h-[200px] bg-content1-foreground">
      <Image
        removeWrapper
        alt="Relaxing app background"
        className="z-0 w-full h-full object-cover bg-default"
        src={image ? URL.createObjectURL(image) : undefined}
      />
      <CardFooter className="absolute bottom-0 z-10 items-center w-full justify-between gap-4">
        <div className="text-xl font-medium text-default overflow-hidden text-ellipsis text-nowrap w-full">
          {title}
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly color="primary" variant="light">
              <MoreVerticalIcon className="size-6" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              startContent={<EditIcon className="size-6" />}
              key="edit"
              onPress={() => recipeConstructor.setRecipe(recipe)}
            >
              {t("edit")}
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              startContent={<TrashIcon className="size-6" />}
              onPress={() => store.deleteRecipe(id)}
            >
              {t("delete")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardFooter>
    </Card>
  );
});
