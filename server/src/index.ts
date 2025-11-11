import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import vacanciesRouter from "./routes/vacancies.js";
import applicationsRouter from "./routes/applications.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/v1/health", (_req, res) => {
	res.json({ ok: true, service: "recruitment-verification-api" });
});

app.use("/api/v1/vacancies", vacanciesRouter);
app.use("/api/v1/applications", applicationsRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`API listening on http://localhost:${PORT}`);
});


