import { UtensilsCrossedIcon } from "lucide-react";
import classNames from "classnames";

type MealImageVariant = "card" | "large";

type MealImageProps = {
  src: string | undefined;
  alt?: string;
  variant?: MealImageVariant;
  className?: string;
};

const variantClasses: Record<MealImageVariant, string> = {
  card: "w-16 shrink-0 self-stretch min-h-16",
  large: "w-full aspect-[4/3] max-h-56 rounded-xl",
};

const placeholderIconSizes: Record<MealImageVariant, string> = {
  card: "size-8",
  large: "size-16",
};

export const MealImage = ({
  src,
  alt = "",
  variant = "card",
  className,
}: MealImageProps) => {
  return (
    <div
      className={classNames(
        "relative overflow-hidden bg-default-100",
        variantClasses[variant],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-default-400">
          <UtensilsCrossedIcon className={placeholderIconSizes[variant]} />
        </div>
      )}
    </div>
  );
};
