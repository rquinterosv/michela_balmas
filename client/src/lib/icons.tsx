import type { IconName } from "@studio/shared";
import {
  Brain,
  CalendarDays,
  Clock,
  Compass,
  Flag,
  HandHeart,
  Heart,
  House,
  Leaf,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Network,
  Puzzle,
  Route,
  ShieldCheck,
  Smile,
  Sparkles,
  Sprout,
  Sun,
  Target,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

// Los iconos que se pueden elegir en el panel (ver ICON_NAMES en shared/src/blocks.ts).
// Se importan uno a uno para que el build solo incluya estos, no toda la colección.
const ICONS: Record<IconName, LucideIcon> = {
  network: Network,
  heart: Heart,
  "hand-heart": HandHeart,
  video: Video,
  "monitor-smartphone": MonitorSmartphone,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  users: Users,
  target: Target,
  route: Route,
  flag: Flag,
  brain: Brain,
  house: House,
  leaf: Leaf,
  sprout: Sprout,
  sun: Sun,
  "calendar-days": CalendarDays,
  clock: Clock,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  compass: Compass,
  smile: Smile,
  puzzle: Puzzle,
};

// Icono decorativo: el texto de al lado ya dice lo que significa.
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const Component = ICONS[name];
  return (
    <Component className={className} aria-hidden="true" focusable="false" strokeWidth={1.75} />
  );
}
