import type { Application } from "@/lib/types/application";

export interface ApplicationCardProps {
  application: Application;
  propertyTitle: string;
  onClick?: () => void;
}
