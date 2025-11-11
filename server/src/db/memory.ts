import { Application, Vacancy } from "@app/shared";

export const vacancies: Vacancy[] = [];
export const applications: Application[] = [];

export function generateId(prefix: string = "id"): string {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}


