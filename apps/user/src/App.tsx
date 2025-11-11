import { useEffect, useState } from "react";
import type { Application, Vacancy } from "@app/shared";

const API_BASE = "http://localhost:4000/api/v1";

export default function App() {
	const [vacancies, setVacancies] = useState<Vacancy[]>([]);
	const [selected, setSelected] = useState<string>("");
	const [applying, setApplying] = useState(false);
	const [result, setResult] = useState<Application | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function refreshVacancies() {
		const res = await fetch(`${API_BASE}/vacancies`);
		const json = await res.json();
		setVacancies(json.data ?? []);
		if (!selected && json.data?.[0]?.id) setSelected(json.data[0].id);
	}

	useEffect(() => {
		refreshVacancies();
	}, []);

	async function applyNow() {
		if (!selected) return;
		setApplying(true);
		setError(null);
		setResult(null);
		try {
			// For development: we send parsed fields inline to simulate OCR output.
			const res = await fetch(`${API_BASE}/applications`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: null,
					vacancyId: selected,
					documents: {
						cvUrl: "https://example.com/cv.pdf",
						diplomaUrl: "https://example.com/diploma.pdf",
						idCardUrl: "https://example.com/id.png",
						parsed: {
							degree: "BSc",
							gpa: 3.2,
							institution: "AAU",
							age: 25,
							graduation_date: "2022-07-01",
						},
					},
				}),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed");
			setResult(json.data);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setApplying(false);
		}
	}

	return (
		<div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
			<h1>User Portal</h1>
			<p>Browse vacancies and apply with instant verification feedback.</p>

			<section>
				<h2>Vacancies</h2>
				<select value={selected} onChange={(e) => setSelected(e.target.value)}>
					<option value="" disabled>
						Select a vacancy
					</option>
					{vacancies.map((v) => (
						<option key={v.id} value={v.id}>
							{v.title} (deadline {v.deadline})
						</option>
					))}
				</select>

				<div style={{ marginTop: 12 }}>
					<button disabled={!selected || applying} onClick={applyNow}>
						{applying ? "Submitting..." : "Apply Now"}
					</button>
				</div>
				{error && <div style={{ color: "red" }}>{error}</div>}
			</section>

			{result && (
				<section style={{ marginTop: 24 }}>
					<h2>Application Result</h2>
					<div>Status: {result.status}</div>
					{result.feedback && <div>Reason: {result.feedback}</div>}
				</section>
			)}
		</div>
	);
}


