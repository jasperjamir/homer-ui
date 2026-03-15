import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Briefcase,
  CheckCircle,
  DollarSign,
  FileText,
  LayoutGrid,
  Shield,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Activity,
  Shield,
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  Target,
  DollarSign,
  Briefcase,
  Stethoscope,
  LayoutGrid,
};

export function getIconComponent(iconName: string | null | undefined): LucideIcon | null {
  if (!iconName) return null;
  return iconMap[iconName] || null;
}

export function renderIcon(
  iconName: string | null | undefined,
  className?: string,
): React.ReactElement | null {
  const IconComponent = getIconComponent(iconName);
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}
