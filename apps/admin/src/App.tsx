import { useEffect, useMemo, useState } from "react";
import type { RequirementRule, Vacancy } from "@app/shared";

type RuleField = RequirementRule["field"];

const API_BASE = "http://localhost:4000/api/v1";

function RequirementBuilder({
	rules,
	onChange,
}: {
	rules: RequirementRule[];
	onChange: (next: RequirementRule[]) => void;
}) {
	const [field, setField] = useState<RuleField>("degree");
	const operatorOptions = useMemo(() => {
		if (field === "gpa" || field === "age") return [">=", "<=", ">", "<", "=="];
		if (field === "graduation_date") return [">=", "<=", ">", "<", "=="];
		return ["equals", "=="];
	}, [field]);
	const [operator, setOperator] = useState<string>(operatorOptions[0]);
	const [value, setValue] = useState<string>("");

	useEffect(() => {
		setOperator(operatorOptions[0] as string);
		setValue("");
	}, [operatorOptions]);

	function addRule() {
		if (!value.trim()) return;
		let rule: RequirementRule;
		if (field === "gpa" || field === "age") {
			rule = { field, operator: operator as any, value: Number(value) };
		} else if (field === "graduation_date") {
			rule = { field, operator: operator as any, value };
		} else {
			rule = { field, operator: operator as any, value };
		}
		onChange([...rules, rule]);
		setValue("");
	}

	function removeRule(idx: number) {
		const next = rules.slice();
		next.splice(idx, 1);
		onChange(next);
	}

	return (
		<div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
			<h3>Requirement Rules</h3>
			<div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
				<select value={field} onChange={(e) => setField(e.target.value as RuleField)}>
					<option value="degree">degree</option>
					<option value="gpa">gpa</option>
					<option value="institution">institution</option>
					<option value="age">age</option>
					<option value="graduation_date">graduation_date</option>
				</select>
				<select value={operator} onChange={(e) => setOperator(e.target.value)}>
					{operatorOptions.map((op) => (
						<option key={op} value={op}>
							{op}
						</option>
					))}
				</select>
				<input
					placeholder="value"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					type={field === "gpa" || field === "age" ? "number" : field === "graduation_date" ? "date" : "text"}
				/>
				<button onClick={addRule}>Add Rule</button>
			</div>
			<ul>
				{rules.map((r, idx) => (
					<li key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<code>
							{r.field} {r.operator} {String((r as any).value)}
						</code>
						<button onClick={() => removeRule(idx)}>Remove</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default function App() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [deadline, setDeadline] = useState("");
	const [rules, setRules] = useState<RequirementRule[]>([]);
	const [vacancies, setVacancies] = useState<Vacancy[]>([]);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function refreshVacancies() {
		const res = await fetch(`${API_BASE}/vacancies`);
		const json = await res.json();
		setVacancies(json.data ?? []);
	}

	useEffect(() => {
		refreshVacancies();
	}, []);

	async function submit() {
		setBusy(true);
		setError(null);
		try {
			const res = await fetch(`${API_BASE}/vacancies`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, description, requirements: rules, deadline }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed");
			setTitle("");
			setDescription("");
			setDeadline("");
			setRules([]);
			await refreshVacancies();
		} catch (e: any) {
			setError(e.message);
		} finally {
			setBusy(false);
		}
	}

	return (
		<div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
			<h1>Admin Dashboard</h1>
			<p>Create and publish vacancies with automated requirements.</p>
			<div style={{ display: "grid", gap: 12 }}>
				<input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />
				<textarea
					placeholder="Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={4}
				/>
				<input placeholder="Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
				<RequirementBuilder rules={rules} onChange={setRules} />
				<button disabled={busy} onClick={submit}>
					{busy ? "Publishing..." : "Publish Vacancy"}
				</button>
				{error && <div style={{ color: "red" }}>{error}</div>}
			</div>

			<hr style={{ margin: "24px 0" }} />
			<h2>Published Vacancies</h2>
			<ul>
				{vacancies.map((v) => (
					<li key={v.id} style={{ marginBottom: 12 }}>
						<strong>{v.title}</strong> — deadline {v.deadline}
						<div>{v.description}</div>
						<div>
							Rules:{" "}
							{v.requirements.length === 0
								? "none"
								: v.requirements
										.map((r) => `${r.field} ${r.operator} ${(r as any).value}`)
										.join(" AND ")}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}


