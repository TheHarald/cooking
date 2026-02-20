import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { observer } from "mobx-react-lite";

type FileInputProps = {
  text: string;
  allowedFileExts: string[];
  onFileUpload: (file: File) => void;
};

export const FileInput = observer<FileInputProps>((props) => {
  const { text, allowedFileExts, onFileUpload } = props;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileUpload(file);
  };

  return (
    <Button
      as={"label"}
      className="font-semibold"
      size="sm"
      color="primary"
      variant="light"
    >
      <ArrowUpTrayIcon className="size-5 " /> {text}
      <input
        type="file"
        accept={allowedFileExts.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />
    </Button>
  );
});
