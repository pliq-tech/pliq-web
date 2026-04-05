import { config as appConfig } from "@/lib/config";

export const blockchainConfig = {
  chainId: appConfig.chainId,
  escrowContract: appConfig.escrowContract,
  registryContract: appConfig.registryContract,
  reputationContract: appConfig.reputationContract,
} as const;
