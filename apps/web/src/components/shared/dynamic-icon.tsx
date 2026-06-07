import {
  Building2,
  Cake,
  Clapperboard,
  Heart,
  LayoutGrid,
  Megaphone,
  Music,
  Plane,
  Radio,
  Rocket,
  Shirt,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Heart,
  Plane,
  Cake,
  Rocket,
  Users,
  LayoutGrid,
  Music,
  Star,
  Megaphone,
  Shirt,
  Clapperboard,
  Radio,
};

export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Star;
  return <Icon className={className} />;
}
