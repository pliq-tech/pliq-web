export type CredentialType =
  | "income"
  | "employment"
  | "credit_score"
  | "rental_history"
  | "identity_age";

export interface Credential {
  id: string;
  type: CredentialType;
  issuedAt: string;
  expiresAt: string;
  zkProofHash: string;
}

export interface ProofBundle {
  credentials: Credential[];
  proofHash: string;
  composedAt: string;
}

function randomHexString(length: number): string {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
}

export async function generateCredential(
  type: CredentialType,
  _documentData: unknown,
): Promise<Credential> {
  // Stub: would call Unlink SDK
  return {
    id: crypto.randomUUID(),
    type,
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    zkProofHash: `0x${randomHexString(64)}`,
  };
}

export async function createProofBundle(
  credentials: Credential[],
  requirements: string[],
): Promise<ProofBundle> {
  const matching = credentials.filter((c) => requirements.includes(c.type));
  return {
    credentials: matching,
    proofHash: `0x${randomHexString(64)}`,
    composedAt: new Date().toISOString(),
  };
}

export async function generateShareableProof(
  _score: number,
  _range: [number, number],
): Promise<string> {
  return `pliq://proof/${crypto.randomUUID()}`;
}
