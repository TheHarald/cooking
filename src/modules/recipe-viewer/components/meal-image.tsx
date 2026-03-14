import { UtensilsCrossedIcon } from "lucide-react";

type MealImageProps = {
  src: string | undefined;
  alt?: string;
  className?: string;
};

export const MealImage = ({ src, alt = "", className }: MealImageProps) => {
  return (
    <div
      className={`relative w-16 shrink-0 self-stretch min-h-16 overflow-hidden bg-default-100 ${className ?? ""}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-default-400">
          <UtensilsCrossedIcon className="size-8" />
        </div>
      )}
    </div>
  );
};
