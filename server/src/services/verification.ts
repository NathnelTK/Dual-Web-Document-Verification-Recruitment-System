import { ApplicationDocuments } from "@app/shared";

export interface VerificationResult {
	parsed: NonNullable<ApplicationDocuments["parsed"]>;
}

// Mock OCR/AI: in dev, return deterministic parsed fields. Replace with OCR.space/Tesseract/OpenAI later.
export async function runVerification(documents: ApplicationDocuments): Promise<VerificationResult> {
	// In a real system, run OCR and parse text to structured fields.
	// For now, allow overriding via documents.parsed; otherwise return defaults.
	const parsed = documents.parsed ?? {
		degree: "BSc",
		gpa: 3.2,
		institution: "AAU",
		age: 25,
		graduation_date: "2022-07-01",
	};
	return { parsed };
}


