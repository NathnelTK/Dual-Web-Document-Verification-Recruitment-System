import { useEffect, useMemo, useState } from "react";
import type { RequirementRule, Vacancy, Application } from "@app/shared";

type RuleField = RequirementRule["field"];
const API_BASE = "http://localhost:4001/api/v1";

export default function App() {
	const [authView, setAuthView] = useState<"login" | "signup">("login");
	const [isAuth, setIsAuth] = useState(false);
	const [view, setView] = useState<"dashboard" | "create">("dashboard");
	
	// Auth states
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	
	// Vacancy states
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [deadline, setDeadline] = useState("");
	const [rules, setRules] = useState<RequirementRule[]>([]);
	const [vacancies, setVacancies] = useState<Vacancy[]>([]);
	const [applications, setApplications] = useState<Application[]>([]);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	
	// Rule builder states
	const [field, setField] = useState<RuleField>("degree");
	const operatorOptions = useMemo(() => {
		if (field === "gpa" || field === "age") return [">=", "<=", ">", "<", "=="];
		if (field === "graduation_date") return [">=", "<=", ">", "<", "=="];
		return ["equals", "=="];
	}, [field]);
	const [operator, setOperator] = useState<string>(operatorOptions[0]);
	const [value, setValue] = useState<string>("");

	useEffect(() => {
		setOperator(operatorOptions[0]);
		setValue("");
	}, [operatorOptions]);

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		if (token) {
			setIsAuth(true);
			fetchData();
		}
	}, []);

	async function fetchData() {
		try {
			const [vacRes, appRes] = await Promise.all([
				fetch(`${API_BASE}/vacancies`),
				fetch(`${API_BASE}/applications`)
			]);
			const vacJson = await vacRes.json();
			const appJson = await appRes.json();
			setVacancies(vacJson.data ?? []);
			setApplications(appJson.data ?? []);
		} catch (e) {
			console.error(e);
		}
	}

	function handleAuth(e: React.FormEvent) {
		e.preventDefault();
		if (authView === "signup" && (!name || !email || !password)) return;
		if (authView === "login" && (!email || !password)) return;
		
		// Mock auth - in production, call your API
		localStorage.setItem("adminToken", "mock-token");
		localStorage.setItem("adminName", name || email.split("@")[0]);
		setIsAuth(true);
		fetchData();
	}

	function handleLogout() {
		localStorage.removeItem("adminToken");
		localStorage.removeItem("adminName");
		setIsAuth(false);
		setEmail("");
		setPassword("");
		setName("");
	}

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
		setRules([...rules, rule]);
		setValue("");
	}

	function removeRule(idx: number) {
		const next = rules.slice();
		next.splice(idx, 1);
		setRules(next);
	}

	async function submitVacancy() {
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
			await fetchData();
			setView("dashboard");
		} catch (e: any) {
			setError(e.message);
		} finally {
			setBusy(false);
		}
	}

	const verifiedApps = applications.filter(app => app.status === "accepted");
	const adminName = localStorage.getItem("adminName") || "Admin";

	// Auth Screen
	if (!isAuth) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
							<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						<h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
						<p className="text-gray-600 mt-2">Recruitment Management System</p>
					</div>

					<div className="flex gap-2 mb-6">
						<button
							onClick={() => setAuthView("login")}
							className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
								authView === "login"
									? "bg-indigo-600 text-white"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							Login
						</button>
						<button
							onClick={() => setAuthView("signup")}
							className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
								authView === "signup"
									? "bg-indigo-600 text-white"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							Sign Up
						</button>
					</div>

					<form onSubmit={handleAuth} className="space-y-4">
						{authView === "signup" && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
									placeholder="John Doe"
									required
								/>
							</div>
						)}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
								placeholder="admin@example.com"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
								placeholder="••••••••"
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
						>
							{authView === "login" ? "Sign In" : "Create Account"}
						</button>
					</form>
				</div>
			</div>
		);
	}

	// Dashboard
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
							<p className="text-sm text-gray-500">Welcome, {adminName}</p>
						</div>
					</div>
					<button
						onClick={handleLogout}
						className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
					>
						Logout
					</button>
				</div>
			</header>

			{/* Navigation */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex gap-3 mb-6">
					<button
						onClick={() => setView("dashboard")}
						className={`px-6 py-2.5 rounded-lg font-medium transition ${
							view === "dashboard"
								? "bg-indigo-600 text-white shadow-lg"
								: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
						}`}
					>
						Dashboard
					</button>
					<button
						onClick={() => setView("create")}
						className={`px-6 py-2.5 rounded-lg font-medium transition ${
							view === "create"
								? "bg-indigo-600 text-white shadow-lg"
								: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
						}`}
					>
						Create Vacancy
					</button>
				</div>

				{/* Dashboard View */}
				{view === "dashboard" && (
					<div className="space-y-6">
						{/* Stats */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">Total Vacancies</p>
										<p className="text-3xl font-bold text-gray-900 mt-1">{vacancies.length}</p>
									</div>
									<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">Total Applications</p>
										<p className="text-3xl font-bold text-gray-900 mt-1">{applications.length}</p>
									</div>
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">Verified Candidates</p>
										<p className="text-3xl font-bold text-green-600 mt-1">{verifiedApps.length}</p>
									</div>
									<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
								</div>
							</div>
						</div>

						{/* Verified Candidates Table */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
							<div className="px-6 py-4 border-b border-gray-200">
								<h2 className="text-lg font-semibold text-gray-800">Verified Candidates</h2>
								<p className="text-sm text-gray-600 mt-1">Candidates who passed all requirements</p>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacancy</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Graduation</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{verifiedApps.length === 0 ? (
											<tr>
												<td colSpan={7} className="px-6 py-8 text-center text-gray-500">
													No verified candidates yet
												</td>
											</tr>
										) : (
											verifiedApps.map((app) => {
												const vacancy = vacancies.find(v => v.id === app.vacancyId);
												const parsed = app.documents.parsed;
												return (
													<tr key={app.id} className="hover:bg-gray-50 transition">
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm font-medium text-gray-900">{vacancy?.title || "N/A"}</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{parsed?.degree || "N/A"}</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{parsed?.gpa || "N/A"}</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{parsed?.institution || "N/A"}</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{parsed?.age || "N/A"}</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{parsed?.graduation_date || "N/A"}</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
																Verified
															</span>
														</td>
													</tr>
												);
											})
										)}
									</tbody>
								</table>
							</div>
						</div>

						{/* All Applications */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
							<div className="px-6 py-4 border-b border-gray-200">
								<h2 className="text-lg font-semibold text-gray-800">All Applications</h2>
							</div>
							<div className="p-6 space-y-3">
								{applications.length === 0 ? (
									<p className="text-center text-gray-500 py-4">No applications yet</p>
								) : (
									applications.map((app) => {
										const vacancy = vacancies.find(v => v.id === app.vacancyId);
										return (
											<div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
												<div>
													<p className="font-medium text-gray-900">{vacancy?.title || "Unknown Vacancy"}</p>
													<p className="text-sm text-gray-600">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
												</div>
												<span className={`px-3 py-1 text-xs font-semibold rounded-full ${
													app.status === "accepted" ? "bg-green-100 text-green-800" :
													app.status === "rejected" ? "bg-red-100 text-red-800" :
													"bg-yellow-100 text-yellow-800"
												}`}>
													{app.status}
												</span>
											</div>
										);
									})
								)}
							</div>
						</div>
					</div>
				)}

				{/* Create Vacancy View */}
				{view === "create" && (
					<div className="max-w-3xl">
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Vacancy</h2>
							
							<div className="space-y-5">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
									<input
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
										placeholder="e.g. Senior Software Engineer"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										rows={4}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
										placeholder="Job description and responsibilities..."
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
									<input
										type="date"
										value={deadline}
										onChange={(e) => setDeadline(e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
									/>
								</div>

								{/* Requirement Rules */}
								<div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
									<h3 className="text-lg font-semibold text-gray-800 mb-4">Requirement Rules</h3>
									
									<div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
										<select
											value={field}
											onChange={(e) => setField(e.target.value as RuleField)}
											className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
										>
											<option value="degree">Degree</option>
											<option value="gpa">GPA</option>
											<option value="institution">Institution</option>
											<option value="age">Age</option>
											<option value="graduation_date">Graduation Date</option>
										</select>
										<select
											value={operator}
											onChange={(e) => setOperator(e.target.value)}
											className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
										>
											{operatorOptions.map((op) => (
												<option key={op} value={op}>{op}</option>
											))}
										</select>
										<input
											type={field === "gpa" || field === "age" ? "number" : field === "graduation_date" ? "date" : "text"}
											value={value}
											onChange={(e) => setValue(e.target.value)}
											placeholder="Value"
											className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
										/>
										<button
											onClick={addRule}
											className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
										>
											Add Rule
										</button>
									</div>

									<div className="space-y-2">
										{rules.length === 0 ? (
											<p className="text-sm text-gray-500 text-center py-3">No rules added yet</p>
										) : (
											rules.map((r, idx) => (
												<div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
													<code className="text-sm font-mono text-gray-700">
														{r.field} {r.operator} {String((r as any).value)}
													</code>
													<button
														onClick={() => removeRule(idx)}
														className="text-red-600 hover:text-red-800 text-sm font-medium"
													>
														Remove
													</button>
												</div>
											))
										)}
									</div>
								</div>

								{error && (
									<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
										{error}
									</div>
								)}

								<button
									onClick={submitVacancy}
									disabled={busy || !title || !description || !deadline}
									className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{busy ? "Publishing..." : "Publish Vacancy"}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
