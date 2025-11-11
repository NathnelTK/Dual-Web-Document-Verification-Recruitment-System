import { RequirementRule } from "@app/shared";

function compareNumbers(left: number, op: string, right: number): boolean {
	switch (op) {
		case ">=":
			return left >= right;
		case "<=":
			return left <= right;
		case ">":
			return left > right;
		case "<":
			return left < right;
		case "==":
			return left === right;
		default:
			return false;
	}
}

function compareDates(leftIso: string, op: string, rightIso: string): boolean {
	const left = new Date(leftIso).getTime();
	const right = new Date(rightIso).getTime();
	return compareNumbers(left, op, right);
}

export interface CandidateFacts {
	degree?: string;
	gpa?: number;
	institution?: string;
	age?: number;
	graduation_date?: string;
}

export function evaluateRules(rules: RequirementRule[], facts: CandidateFacts): { ok: boolean; reasons: string[] } {
	const reasons: string[] = [];
	for (const rule of rules) {
		if (rule.field === "gpa" || rule.field === "age") {
			const candidateValue = facts[rule.field];
			if (typeof candidateValue !== "number" || !compareNumbers(candidateValue, rule.operator, rule.value)) {
				reasons.push(`${rule.field} ${rule.operator} ${rule.value} not satisfied`);
			}
		} else if (rule.field === "graduation_date") {
			const candidateValue = facts["graduation_date"];
			if (!candidateValue || !compareDates(candidateValue, rule.operator, rule.value)) {
				reasons.push(`graduation_date ${rule.operator} ${rule.value} not satisfied`);
			}
		} else if (rule.field === "degree" || rule.field === "institution") {
			const candidateValue = (facts as any)[rule.field];
			if (!candidateValue || String(candidateValue).toLowerCase() !== String(rule.value).toLowerCase()) {
				reasons.push(`${rule.field} equals ${rule.value} not satisfied`);
			}
		}
	}
	return { ok: reasons.length === 0, reasons };
}


