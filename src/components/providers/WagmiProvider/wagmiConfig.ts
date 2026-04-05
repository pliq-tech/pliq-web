import { createConfig, http } from "wagmi";
import { baseSepolia, worldchain } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [worldchain, baseSepolia],
  transports: {
    [worldchain.id]: http(),
    [baseSepolia.id]: http(),
  },
});
