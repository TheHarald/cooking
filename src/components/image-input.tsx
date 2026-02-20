import { addToast, Button } from "@heroui/react";
import { ArrowUp01Icon, TrashIcon } from "lucide-react";
import { Image } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { t } from "i18next";

const maxFileSize = 10 * 1024 * 1024; // 10 МБ

type FileInputProps = {
  value?: File;
  onFileUpload?: (file?: File) => void;
};

export const ImageInput = observer<FileInputProps>((props) => {
  const { value, onFileUpload } = props;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast({
        title: "Ошибка",
        description: "Пожалуйста, выберите файл изображения.",
        color: "danger",
      });
      return;
    }

    if (file.size > maxFileSize) {
      addToast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 10 МБ.",
        color: "danger",
      });
      return;
    }

    console.log(file);

    onFileUpload?.(file);
  };

  const blobUrl = value ? URL.createObjectURL(value) : "";

  if (blobUrl) {
    return (
      <div className="w-full justify-center flex relative">
        <Image
          height={150}
          className="object-cover "
          src={blobUrl}
          alt="Recipe"
        />
        <Button
          onPress={() => onFileUpload?.(undefined)}
          variant="ghost"
          isIconOnly
          color="danger"
          className="absolute top-2 right-2"
        >
          <TrashIcon className="size-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[150px] border-2 border-primary border-dashed w-full rounded-md relative">
      <Button
        as={"label"}
        className="font-semibold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
        size="sm"
        color="primary"
        variant="light"
      >
        <ArrowUp01Icon className="size-6" /> {t("upload-image")}
        <input type="file" onChange={handleFileChange} className="hidden" />
      </Button>
    </div>
  );
});
