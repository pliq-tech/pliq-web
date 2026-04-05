export type DocumentType =
  | "passport"
  | "payslip"
  | "bank_statement"
  | "id_card";

export interface DocumentData {
  type: DocumentType;
  verified: boolean;
  extractedData: Record<string, unknown>;
  scannedAt: string;
}

export async function scanDocument(type: DocumentType): Promise<DocumentData> {
  // Stub: would launch Self Protocol SDK camera/upload
  return {
    type,
    verified: true,
    extractedData: {},
    scannedAt: new Date().toISOString(),
  };
}
