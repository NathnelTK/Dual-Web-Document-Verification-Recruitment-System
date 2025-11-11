import { Router } from "express";
import { z } from "zod";
import { applications, vacancies } from "../db/memory.js";
import { generateId } from "../db/memory.js";
import { Application, ApplicationDocuments } from "@app/shared";
import { runVerification } from "../services/verification.js";
import { evaluateRules } from "../services/rules.js";

const router = Router();

const documentsSchema: z.ZodType<ApplicationDocuments> = z.object({
	cvUrl: z.string().url().optional(),
	diplomaUrl: z.string().url().optional(),
	idCardUrl: z.string().url().optional(),
	parsed: z
		.object({
			degree: z.string().optional(),
			gpa: z.number().optional(),
			institution: z.string().optional(),
			age: z.number().optional(),
			graduation_date: z.string().optional(),
		})
		.optional(),
});

const createApplicationSchema = z.object({
	userId: z.string().optional().nullable(),
	vacancyId: z.string().min(1),
	documents: documentsSchema,
});

router.get("/", (req, res) => {
	const { vacancyId } = req.query as { vacancyId?: string };
	const list = vacancyId ? applications.filter((a) => a.vacancyId === vacancyId) : applications;
	res.json({ success: true, data: list });
});

router.post("/", async (req, res) => {
	const parsed = createApplicationSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ success: false, error: parsed.error.message });
	}

	const vacancy = vacancies.find((v) => v.id === parsed.data.vacancyId);
	if (!vacancy) {
		return res.status(404).json({ success: false, error: "Vacancy not found" });
	}

	// Run OCR/AI verification (mocked)
	const verification = await runVerification(parsed.data.documents);
	const facts = verification.parsed;

	// Evaluate against rules
	const result = evaluateRules(vacancy.requirements, facts);
	const status: Application["status"] = result.ok ? "accepted" : "rejected";
	const feedback = result.ok ? undefined : result.reasons.join("; ");

	const now = new Date().toISOString();
	const application: Application = {
		id: generateId("app"),
		userId: parsed.data.userId ?? null,
		vacancyId: parsed.data.vacancyId,
		documents: { ...parsed.data.documents, parsed: facts },
		status,
		feedback,
		createdAt: now,
	};
	applications.push(application);

	res.status(201).json({ success: true, data: application });
});

export default router;


