import { createConfig, http } from "wagmi";
import { baseSepolia, worldChain } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [worldChain, baseSepolia],
  transports: {
    [worldChain.id]: http(),
    [baseSepolia.id]: http(),
  },
});
