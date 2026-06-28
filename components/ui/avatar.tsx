import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  imageUrl?: string | null;
  className?: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ name, imageUrl, className }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary",
        className,
      )}
      aria-label={name}
      title={name}
    >
      {imageUrl ? (
        <img alt="" className="h-full w-full object-cover" src={imageUrl} />
      ) : (
        initials
      )}
    </span>
  );
}
