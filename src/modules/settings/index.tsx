import { FileUploader } from "../../components/file-uploader";
import { BuildInfo } from "./components/build-info";
import { LanguageSelector } from "./components/language-selector";

export const SettingsModule = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Настройки</h1>
      <BuildInfo />
      <LanguageSelector />
      <FileUploader />
    </div>
  );
};
