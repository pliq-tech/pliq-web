import { createPublicClient, http } from "viem";
import { worldChain } from "viem/chains";
import { config } from "@/lib/config";

export const PLIQ_REGISTRY_ABI = [
  {
    type: "function",
    name: "getUser",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "nullifierHash", type: "bytes32" },
      { name: "verificationLevel", type: "uint8" },
      { name: "registeredAt", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isVerified",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "registerUser",
    inputs: [
      { name: "proof", type: "bytes" },
      { name: "nullifierHash", type: "bytes32" },
      { name: "verificationLevel", type: "uint8" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "submitApplication",
    inputs: [
      { name: "listingId", type: "bytes32" },
      { name: "zkProof", type: "bytes" },
      { name: "nullifierHash", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const RENTAL_AGREEMENT_ABI = [
  {
    type: "function",
    name: "signAgreement",
    inputs: [{ name: "agreementId", type: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositEscrow",
    inputs: [
      { name: "agreementId", type: "bytes32" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "executePayment",
    inputs: [{ name: "agreementId", type: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAgreement",
    inputs: [{ name: "agreementId", type: "bytes32" }],
    outputs: [
      { name: "tenant", type: "address" },
      { name: "landlord", type: "address" },
      { name: "rentUsdc", type: "uint256" },
      { name: "depositUsdc", type: "uint256" },
      { name: "status", type: "uint8" },
      { name: "startDate", type: "uint256" },
      { name: "endDate", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEscrowBalance",
    inputs: [{ name: "agreementId", type: "bytes32" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "checkIn",
    inputs: [
      { name: "agreementId", type: "bytes32" },
      { name: "reportHash", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "initiateMoveOut",
    inputs: [{ name: "agreementId", type: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const REPUTATION_ACCUMULATOR_ABI = [
  {
    type: "function",
    name: "getScore",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMerkleRoot",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "verifyProof",
    inputs: [
      { name: "user", type: "address" },
      { name: "proof", type: "bytes32[]" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
] as const;

export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;

export const contractAddresses = {
  pliqRegistry: config.registryContract,
  escrow: config.escrowContract,
  reputation: config.reputationContract,
  usdc: config.usdcContract,
} as const;

export const publicClient = createPublicClient({
  chain: worldChain,
  transport: http(config.rpcUrl || undefined),
});
