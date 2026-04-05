import { config } from "@/lib/config";

export interface WorldIdConfig {
  app_id: string;
  action: string;
  signal?: string;
  verification_level?: "device" | "orb";
}

export function getWorldIdConfig(): WorldIdConfig {
  return {
    app_id: config.worldIdAppId,
    action: config.worldIdActionId,
    verification_level: "orb",
  };
}
