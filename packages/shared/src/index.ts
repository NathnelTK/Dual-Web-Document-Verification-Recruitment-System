export type ComparisonOperator = ">=" | "<=" | ">" | "<" | "==" | "equals";

export type RequirementRule =
	| {
			field: "gpa" | "age";
			operator: ComparisonOperator;
			value: number;
	  }
	| {
			field: "graduation_date";
			operator: ComparisonOperator;
			value: string; // ISO date
	  }
	| {
			field: "degree" | "institution";
			operator: "equals" | "==";
			value: string;
	  };

export interface Vacancy {
	id: string;
	title: string;
	description: string;
	requirements: RequirementRule[];
	deadline: string; // ISO date
	createdAt: string; // ISO
}

export interface ApplicationDocuments {
	cvUrl?: string;
	diplomaUrl?: string;
	idCardUrl?: string;
	// Parsed fields from OCR/AI (mocked for now)
	parsed?: {
		degree?: string;
		gpa?: number;
		institution?: string;
		age?: number;
		graduation_date?: string; // ISO
	};
}

export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface Application {
	id: string;
	userId?: string | null;
	vacancyId: string;
	documents: ApplicationDocuments;
	status: ApplicationStatus;
	feedback?: string;
	createdAt: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}


