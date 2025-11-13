import { BuildInfo } from "./components/build-info";

export const SettingsModule = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Настройки</h1>
      <BuildInfo />
    </div>
  );
};
