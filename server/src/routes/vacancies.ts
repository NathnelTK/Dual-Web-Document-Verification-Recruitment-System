import { Router } from "express";
import { z } from "zod";
import { vacancies } from "../db/memory.js";
import { generateId } from "../db/memory.js";
import { RequirementRule, Vacancy } from "@app/shared";

const router = Router();

const requirementRuleSchema: z.ZodType<RequirementRule> = z.union([
	z.object({
		field: z.enum(["gpa", "age"]),
		operator: z.enum([">=", "<=", ">", "<", "=="]),
		value: z.number(),
	}),
	z.object({
		field: z.literal("graduation_date"),
		operator: z.enum([">=", "<=", ">", "<", "=="]),
		value: z.string(),
	}),
	z.object({
		field: z.enum(["degree", "institution"]),
		operator: z.enum(["equals", "=="]),
		value: z.string(),
	}),
]);

const createVacancySchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	requirements: z.array(requirementRuleSchema).default([]),
	deadline: z.string().min(1),
});

router.get("/", (_req, res) => {
	res.json({ success: true, data: vacancies });
});

router.post("/", (req, res) => {
	const parsed = createVacancySchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ success: false, error: parsed.error.message });
	}
	const now = new Date().toISOString();
	const newVacancy: Vacancy = {
		id: generateId("vac"),
		title: parsed.data.title,
		description: parsed.data.description,
		requirements: parsed.data.requirements,
		deadline: parsed.data.deadline,
		createdAt: now,
	};
	vacancies.push(newVacancy);
	res.status(201).json({ success: true, data: newVacancy });
});

export default router;


