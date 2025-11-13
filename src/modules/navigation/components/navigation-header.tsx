import { observer } from "mobx-react-lite";

export const NavigationHeader = observer(() => {
  return (
    <header className="p-2 bg-default text-white text-xl font-bold shrink-0">
      Заголовок
    </header>
  );
});
