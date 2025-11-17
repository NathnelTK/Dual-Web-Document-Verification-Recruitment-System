import { useEffect, useState } from "react";
import type { Application, Vacancy } from "@app/shared";

const API_BASE = "http://localhost:4000/api/v1";

export default function App() {
	const [vacancies, setVacancies] = useState<Vacancy[]>([]);
	const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
	const [applying, setApplying] = useState(false);
	const [result, setResult] = useState<Application | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);

	// Form fields for mock data
	const [degree, setDegree] = useState("BSc");
	const [gpa, setGpa] = useState("3.2");
	const [institution, setInstitution] = useState("AAU");
	const [age, setAge] = useState("25");
	const [graduationDate, setGraduationDate] = useState("2022-07-01");

	async function refreshVacancies() {
		try {
			const res = await fetch(`${API_BASE}/vacancies`);
			const json = await res.json();
			setVacancies(json.data ?? []);
		} catch (e) {
			console.error(e);
		}
	}

	useEffect(() => {
		refreshVacancies();
	}, []);

	function openApplyModal(vacancy: Vacancy) {
		setSelectedVacancy(vacancy);
		setShowModal(true);
		setResult(null);
		setError(null);
	}

	async function submitApplication() {
		if (!selectedVacancy) return;
		setApplying(true);
		setError(null);
		setResult(null);
		try {
			const res = await fetch(`${API_BASE}/applications`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: null,
					vacancyId: selectedVacancy.id,
					documents: {
						cvUrl: "https://example.com/cv.pdf",
						diplomaUrl: "https://example.com/diploma.pdf",
						idCardUrl: "https://example.com/id.png",
						parsed: {
							degree,
							gpa: parseFloat(gpa),
							institution,
							age: parseInt(age),
							graduation_date: graduationDate,
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

	function closeModal() {
		setShowModal(false);
		setSelectedVacancy(null);
		setResult(null);
		setError(null);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
			{/* Header */}
			<header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
							<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
						</div>
						<div>
							<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
								Career Portal
							</h1>
							<p className="text-sm text-gray-600">Find your dream job with instant verification</p>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Explore Open Positions
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Browse available vacancies and apply instantly with automated verification
					</p>
				</div>

				{/* Vacancies Grid */}
				{vacancies.length === 0 ? (
					<div className="text-center py-16">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
							<svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-700 mb-2">No Vacancies Available</h3>
						<p className="text-gray-500">Check back later for new opportunities</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{vacancies.map((vacancy) => (
							<div
								key={vacancy.id}
								className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 group"
							>
								<div className="p-6">
									<div className="flex items-start justify-between mb-4">
										<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
											<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
											</svg>
										</div>
										<span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
											Open
										</span>
									</div>

									<h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
										{vacancy.title}
									</h3>
									<p className="text-gray-600 text-sm mb-4 line-clamp-3">
										{vacancy.description}
									</p>

									<div className="space-y-2 mb-4">
										<div className="flex items-center gap-2 text-sm text-gray-500">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
											<span>Deadline: {new Date(vacancy.deadline).toLocaleDateString()}</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-500">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
											</svg>
											<span>{vacancy.requirements.length} Requirements</span>
										</div>
									</div>

									<button
										onClick={() => openApplyModal(vacancy)}
										className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
									>
										Apply Now
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</main>

			{/* Application Modal */}
			{showModal && selectedVacancy && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
							<h3 className="text-2xl font-bold text-gray-900">Apply for {selectedVacancy.title}</h3>
							<button
								onClick={closeModal}
								className="text-gray-400 hover:text-gray-600 transition"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div className="p-6">
							{!result ? (
								<>
									<div className="mb-6">
										<h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
										<p className="text-gray-600 text-sm">{selectedVacancy.description}</p>
									</div>

									<div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
										<h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
											<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											Requirements
										</h4>
										<ul className="space-y-2">
											{selectedVacancy.requirements.map((req, idx) => (
												<li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
													<span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
													<code className="bg-white px-2 py-1 rounded border border-blue-200">
														{req.field} {req.operator} {String((req as any).value)}
													</code>
												</li>
											))}
										</ul>
									</div>

									<div className="space-y-4 mb-6">
										<h4 className="font-semibold text-gray-900">Your Information</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
												<input
													type="text"
													value={degree}
													onChange={(e) => setDegree(e.target.value)}
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
													placeholder="e.g. BSc, MSc"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
												<input
													type="number"
													step="0.1"
													value={gpa}
													onChange={(e) => setGpa(e.target.value)}
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
													placeholder="e.g. 3.5"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
												<input
													type="text"
													value={institution}
													onChange={(e) => setInstitution(e.target.value)}
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
													placeholder="e.g. AAU"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
												<input
													type="number"
													value={age}
													onChange={(e) => setAge(e.target.value)}
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
													placeholder="e.g. 25"
												/>
											</div>
											<div className="md:col-span-2">
												<label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
												<input
													type="date"
													value={graduationDate}
													onChange={(e) => setGraduationDate(e.target.value)}
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
												/>
											</div>
										</div>
									</div>

									{error && (
										<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
											<svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											<span>{error}</span>
										</div>
									)}

									<div className="flex gap-3">
										<button
											onClick={closeModal}
											className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
										>
											Cancel
										</button>
										<button
											onClick={submitApplication}
											disabled={applying}
											className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{applying ? "Submitting..." : "Submit Application"}
										</button>
									</div>
								</>
							) : (
								<div className="text-center py-8">
									<div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
										result.status === "accepted" ? "bg-green-100" : "bg-red-100"
									}`}>
										{result.status === "accepted" ? (
											<svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										) : (
											<svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										)}
									</div>
									<h3 className={`text-2xl font-bold mb-2 ${
										result.status === "accepted" ? "text-green-600" : "text-red-600"
									}`}>
										{result.status === "accepted" ? "Application Accepted!" : "Application Rejected"}
									</h3>
									<p className="text-gray-600 mb-6">
										{result.feedback || (result.status === "accepted" 
											? "Congratulations! You meet all the requirements." 
											: "Unfortunately, you don't meet the requirements."
										)}
									</p>
									<button
										onClick={closeModal}
										className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
									>
										Close
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
