export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  wsUrl: process.env.NEXT_PUBLIC_WS_URL!,
  worldIdAppId: process.env.NEXT_PUBLIC_WORLD_ID_APP_ID!,
  worldIdActionId: process.env.NEXT_PUBLIC_WORLD_ID_ACTION_ID!,
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || "480"),
  escrowContract: process.env.NEXT_PUBLIC_ESCROW_CONTRACT!,
  registryContract: process.env.NEXT_PUBLIC_REGISTRY_CONTRACT!,
  reputationContract: process.env.NEXT_PUBLIC_REPUTATION_CONTRACT!,
} as const;
