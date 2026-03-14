import { observer } from "mobx-react-lite";
import { NavigationMenu } from "./modules/navigation/components/navigation-menu";
import { navigationStore } from "./modules/navigation/services/navigation-store";
import { AppRoutes } from "./modules/navigation/services/types";
import { SettingsModule } from "./modules/settings";
import { CookingConstructor } from "./modules/recipe-constructor";
import { MealPlanModule } from "./modules/meal-plan";
import { ShoppingListModule } from "./modules/shopping-list";
import { RecipeViewModal } from "./modules/recipe-viewer/components/recipe-view-modal";

const App = observer(() => {
  const { tab } = navigationStore;

  return (
    <div className="flex flex-col h-dvh w-screen overflow-hidden">
      <div className="flex flex-col gap-2 p-4 overflow-hidden flex-1 min-h-0">
        {(() => {
          switch (tab) {
            case AppRoutes.Settings:
              return <SettingsModule />;
            case AppRoutes.Cooking:
              return <CookingConstructor />;
            case AppRoutes.Statistics:
              return <MealPlanModule />;
            case AppRoutes.Constructor:
              return <ShoppingListModule />;
            default:
              return <div>404</div>;
          }
        })()}
      </div>
      <NavigationMenu />
      <RecipeViewModal />
    </div>
  );
});

export default App;
