// components/cloud/CloudDialog.tsx
import { useEffect, useMemo, useState } from "react";
import Modal from "../modal/Modal";

const AWSRegionList = [
	"global",
	"ap-northeast-1",
	"ap-northeast-2",
	"ap-northeast-3",
	"ap-south-1",
	"ap-southeast-1",
	"ap-southeast-2",
	"ca-central-1",
	"eu-central-1",
	"eu-north-1",
	"eu-west-1",
	"eu-west-2",
	"eu-west-3",
	"sa-east-1",
	"us-east-1",
	"us-east-2",
	"us-west-1",
	"us-west-2",
];

export const providerSchemas = {
	AWS: {
		defaults: {
			provider: "AWS",
			name: "",
			cloudGroupName: [],
			regionList: [],
			proxyUrl: "",
			eventProcessEnabled: true,
			userActivityEnabled: false,
			scheduleScanEnabled: true,
			scheduleScanSetting: {
				frequency: "DAY",
				hour: "01",
				minute: "00",
				weekday: "MON",
				date: "1",
			},
			credentialType: "ACCESS_KEY",
			credentials: { accessKey: "", secretAccessKey: "" },
			eventSource: { cloudTrailName: "" },
		},
		sections: [
			{
				title: "General",
				fields: [
					{ key: "name", label: "Account Name", type: "text", required: true },
					{ key: "cloudGroupName", label: "Cloud Groups", type: "tags" },
					{
						key: "regionList",
						label: "Regions",
						type: "multiselect",
						required: true,
						options: AWSRegionList,
					},
					{ key: "proxyUrl", label: "Proxy URL", type: "text" },
				],
			},
			{
				title: "Event",
				fields: [
					{
						key: "eventProcessEnabled",
						label: "Enable Event Processing",
						type: "switch",
					},
					{
						key: "userActivityEnabled",
						label: "Enable User Activity",
						type: "switch",
					},
					{
						key: "eventSource.cloudTrailName",
						label: "CloudTrail Name",
						type: "text",
						showIf: (v: any) => v.eventProcessEnabled,
					},
				],
			},
			{
				title: "Scan Schedule",
				fields: [
					{
						key: "scheduleScanEnabled",
						label: "Enable Scheduled Scan",
						type: "switch",
					},
					{
						key: "scheduleScanSetting.frequency",
						label: "Frequency",
						type: "select",
						required: true,
						options: ["HOUR", "DAY", "WEEK", "MONTH"],
						showIf: (v: any) => v.scheduleScanEnabled,
					},
					{
						key: "scheduleScanSetting.minute",
						label: "Minute (0-55/5)",
						type: "select",
						options: Array.from({ length: 12 }, (_, i) => String(i * 5)),
						showIf: (v: any) =>
							v.scheduleScanEnabled &&
							v.scheduleScanSetting?.frequency === "HOUR",
					},
					{
						key: "scheduleScanSetting.weekday",
						label: "Weekday",
						type: "select",
						options: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
						showIf: (v: any) =>
							v.scheduleScanEnabled &&
							v.scheduleScanSetting?.frequency === "WEEK",
					},
					{
						key: "scheduleScanSetting.date",
						label: "Day (1-28)",
						type: "select",
						options: Array.from({ length: 28 }, (_, i) => String(i + 1)),
						showIf: (v: any) =>
							v.scheduleScanEnabled &&
							v.scheduleScanSetting?.frequency === "MONTH",
					},
					{
						key: "scheduleScanSetting.hour",
						label: "Hour (00-23)",
						type: "select",
						options: Array.from({ length: 24 }, (_, i) =>
							String(i).padStart(2, "0")
						),
						showIf: (v: any) =>
							v.scheduleScanEnabled &&
							["DAY", "WEEK", "MONTH"].includes(
								v.scheduleScanSetting?.frequency
							),
					},
					{
						key: "scheduleScanSetting.minute2",
						label: "Minute (00-55/5)",
						type: "select",
						options: Array.from({ length: 12 }, (_, i) =>
							String(i * 5).padStart(2, "0")
						),
						showIf: (v: any) =>
							v.scheduleScanEnabled &&
							["DAY", "WEEK", "MONTH"].includes(
								v.scheduleScanSetting?.frequency
							),
						mapTo: "scheduleScanSetting.minute",
					},
				],
			},
			{
				title: "Credentials (AWS / ACCESS_KEY)",
				fields: [
					{
						key: "credentialType",
						label: "Credential Type",
						type: "select",
						options: ["ACCESS_KEY"],
						required: true,
					},
					{
						key: "credentials.accessKey",
						label: "Access Key",
						type: "password",
						required: true,
					},
					{
						key: "credentials.secretAccessKey",
						label: "Secret Access Key",
						type: "password",
						required: true,
					},
				],
			},
		],
		validate: (v: any) => {
			const e: any = {};
			if (!v.name) e.name = "Account Name is required.";
			if (!Array.isArray(v.regionList) || v.regionList.length === 0)
				e.regionList = "Select at least one region.";
			if (v.credentialType !== "ACCESS_KEY")
				e.credentialType = "Only ACCESS_KEY is supported.";
			if (!v.credentials?.accessKey)
				e["credentials.accessKey"] = "Access Key is required.";
			if (!v.credentials?.secretAccessKey)
				e["credentials.secretAccessKey"] = "Secret Access Key is required.";
			if (v.scheduleScanEnabled && !v.scheduleScanSetting?.frequency)
				e["scheduleScanSetting.frequency"] = "Frequency is required.";
			return e;
		},
	},
};

// 모킹 유틸: 0~500ms sleep
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

// 서버에서 상세 읽어오는 척하는 함수 (id로 조회)
async function fetchCloudById(id: string) {
	await sleep(Math.floor(Math.random() * 501)); // 0~500ms
	// 실제론 fetch 호출; 여기선 모킹 데이터로 반환
	return {
		provider: "AWS",
		name: "Loaded From Server",
		cloudGroupName: ["default-group"],
		regionList: ["us-east-1"],
		proxyUrl: "",
		eventProcessEnabled: true,
		userActivityEnabled: false,
		scheduleScanEnabled: true,
		scheduleScanSetting: {
			frequency: "DAY",
			hour: "01",
			minute: "00",
			weekday: "MON",
			date: "1",
		},
		credentialType: "ACCESS_KEY",
		credentials: { accessKey: "****", secretAccessKey: "****" },
		eventSource: { cloudTrailName: "trail-from-server" },
	};
}

const getIn = (obj: any, path: string) =>
	path.split(".").reduce((a, k) => a?.[k], obj);
const setIn = (obj: any, path: string, val: any) => {
	const ks = path.split(".");
	const last = ks.pop()!;
	let cur = obj;
	ks.forEach(k => {
		if (typeof cur[k] !== "object" || cur[k] == null) cur[k] = {};
		cur = cur[k];
	});
	cur[last] = val;
};

type CloudDialogProps = {
	mode: "create" | "edit" | "delete";
	cloudId?: string; // edit/delete 시 대상 id
	initialValues?: any; // create 시 프리필이 필요하면 사용
	onClose: () => void;
	onSubmit: (payload: any) => Promise<void> | void; // 확인 클릭 시
};

const CloudFormDialog = ({
	mode,
	cloudId,
	initialValues,
	onClose,
	onSubmit,
}: CloudDialogProps) => {
	const schema = providerSchemas.AWS; // 과제 조건: AWS만
	const baseDefaults = useMemo(() => schema.defaults, [schema]);

	const [values, setValues] = useState<any>(initialValues ?? baseDefaults);
	const [errors, setErrors] = useState<any>({});
	const [loading, setLoading] = useState<boolean>(mode !== "create"); // edit/delete면 로딩 시작
	const [submitting, setSubmitting] = useState(false);

	// ✨ 수정 모드: 서버에서 불러와 인풋 초기화 (0~500ms sleep 요구사항)
	useEffect(() => {
		let mounted = true;
		(async () => {
			if (mode === "edit") {
				try {
					setLoading(true);
					const serverData = await fetchCloudById(cloudId!);
					if (!mounted) return;
					setValues({ ...baseDefaults, ...serverData });
				} finally {
					if (mounted) setLoading(false);
				}
			} else if (mode === "delete") {
				// 삭제 모달은 간단 확인창. 로딩은 즉시 종료
				setLoading(false);
			} else {
				setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [mode, cloudId, baseDefaults]);

	const handleChange = (key: string, val: any, mapTo?: string) => {
		const next = structuredClone(values);
		setIn(next, mapTo || key, val);
		setValues(next);
	};

	const validate = () => {
		const e = schema.validate(values);
		setErrors(e);
		return Object.keys(e).length === 0;
	};

	const onConfirm = async () => {
		if (mode !== "delete") {
			const ok = validate();
			if (!ok) return;
		}
		setSubmitting(true);
		try {
			// 요구사항: 서버에 전송할 payload를 콘솔에 출력
			console.log("[CloudDialog payload]", {
				mode,
				id: cloudId,
				payload: values,
			});
			await onSubmit(values); // 상위에서 실제 생성/수정/삭제 수행
			onClose();
		} finally {
			setSubmitting(false);
		}
	};

	// 삭제 모드 간단 뷰
	if (mode === "delete") {
		return (
			<Modal open onClose={onClose}>
				<h2 className="text-lg font-semibold mb-3">Delete Cloud</h2>
				<p className="text-sm text-gray-600 mb-6">
					해당 클라우드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
				</p>
				<div className="mt-6 flex justify-end gap-2">
					<button
						className="px-4 py-2 rounded border"
						onClick={onClose}
						disabled={submitting}
					>
						Cancel
					</button>
					<button
						className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
						onClick={onConfirm}
						disabled={submitting}
					>
						{submitting ? "Deleting..." : "Delete"}
					</button>
				</div>
			</Modal>
		);
	}

	// 생성/수정 공용 폼
	return (
		<Modal open onClose={onClose}>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold">
					{mode === "create" ? "Create Cloud" : "Edit Cloud"}
				</h2>
			</div>

			{loading ? (
				<div className="py-10 text-center text-sm text-gray-500">
					Loading...
				</div>
			) : (
				<div className="space-y-6">
					{schema.sections.map(sec => (
						<section key={sec.title}>
							<h3 className="text-sm font-semibold text-gray-600 mb-2">
								{sec.title}
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{sec.fields.map(f => {
									if (typeof f.showIf === "function" && !f.showIf(values))
										return null;

									const raw = getIn(values, f.key);
									const val = raw ?? "";
									const err = errors[f.key];
									const inputClass = `w-full border rounded px-2 py-2 ${err ? "border-red-400" : ""}`;

									if (f.type === "text" || f.type === "password") {
										return (
											<div key={f.key}>
												<label className="block text-sm mb-1">
													{f.label}
													{f.required && (
														<span className="text-red-500 ml-1">*</span>
													)}
												</label>
												<input
													type={f.type}
													className={inputClass}
													value={val}
													onChange={e =>
														handleChange(f.key, e.target.value, f.mapTo)
													}
												/>
												{err && (
													<p className="text-xs text-red-600 mt-1">{err}</p>
												)}
											</div>
										);
									}

									if (f.type === "select") {
										return (
											<div key={f.key}>
												<label className="block text-sm mb-1">
													{f.label}
													{f.required && (
														<span className="text-red-500 ml-1">*</span>
													)}
												</label>
												<select
													className={inputClass}
													value={val}
													onChange={e =>
														handleChange(f.key, e.target.value, f.mapTo)
													}
												>
													<option value="">Select...</option>
													{f.options?.map((opt: string) => (
														<option key={opt} value={opt}>
															{opt}
														</option>
													))}
												</select>
												{err && (
													<p className="text-xs text-red-600 mt-1">{err}</p>
												)}
											</div>
										);
									}

									if (f.type === "multiselect") {
										const current: string[] = Array.isArray(raw) ? raw : [];
										const toggle = (opt: string) => {
											const next = current.includes(opt)
												? current.filter(v => v !== opt)
												: [...current, opt];
											handleChange(f.key, next, f.mapTo);
										};
										return (
											<div key={f.key} className="md:col-span-2">
												<label className="block text-sm mb-1">
													{f.label}
													{f.required && (
														<span className="text-red-500 ml-1">*</span>
													)}
												</label>
												<div className="flex flex-wrap gap-2">
													{f.options?.map((opt: string) => (
														<button
															key={opt}
															type="button"
															onClick={() => toggle(opt)}
															className={`px-2 py-1 rounded border text-xs ${current.includes(opt) ? "bg-blue-600 text-white border-blue-600" : "bg-white"}`}
														>
															{opt}
														</button>
													))}
												</div>
												{errors[f.key] && (
													<p className="text-xs text-red-600 mt-1">
														{errors[f.key]}
													</p>
												)}
											</div>
										);
									}

									if (f.type === "switch") {
										const checked = !!raw;
										return (
											<div key={f.key} className="flex items-center gap-3">
												<label className="text-sm">{f.label}</label>
												<button
													type="button"
													onClick={() => handleChange(f.key, !checked, f.mapTo)}
													className={`w-10 h-6 rounded-full ${checked ? "bg-green-500" : "bg-gray-300"} relative`}
												>
													<span
														className={`absolute top-0.5 ${checked ? "left-5" : "left-0.5"} w-5 h-5 bg-white rounded-full transition-all`}
													/>
												</button>
											</div>
										);
									}

									if (f.type === "tags") {
										// 간단 태그 입력 (Enter 추가)
										const current: string[] = Array.isArray(raw) ? raw : [];
										return (
											<TagsField
												key={f.key}
												label={f.label}
												required={f.required}
												value={current}
												error={errors[f.key]}
												onChange={next => handleChange(f.key, next, f.mapTo)}
												inputClass={inputClass}
											/>
										);
									}

									return null;
								})}
							</div>
						</section>
					))}
				</div>
			)}

			{/* 하단 버튼 고정 */}
			<div className="mt-6 flex justify-end gap-2">
				<button
					className="px-4 py-2 rounded border"
					onClick={onClose}
					disabled={submitting}
				>
					Cancel
				</button>
				<button
					className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
					onClick={onConfirm}
					disabled={submitting || loading}
				>
					{submitting
						? mode === "create"
							? "Creating..."
							: "Saving..."
						: mode === "create"
							? "Create"
							: "Save"}
				</button>
			</div>
		</Modal>
	);
};

// 보조 컴포넌트: 태그 입력
function TagsField({
	label,
	required,
	value,
	error,
	onChange,
	inputClass,
}: any) {
	const [text, setText] = useState("");
	const add = () => {
		const t = text.trim();
		if (!t) return;
		onChange([...(value || []), t]);
		setText("");
	};
	const remove = (idx: number) => {
		const next = value.slice();
		next.splice(idx, 1);
		onChange(next);
	};
	return (
		<div className="md:col-span-2">
			<label className="block text-sm mb-1">
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</label>
			<div className="flex gap-2">
				<input
					className={inputClass}
					value={text}
					onChange={e => setText(e.target.value)}
					onKeyDown={e => {
						if (e.key === "Enter") {
							e.preventDefault();
							add();
						}
					}}
					placeholder="Type and press Enter"
				/>
				<button
					type="button"
					onClick={add}
					className="px-3 rounded bg-gray-900 text-white"
				>
					+
				</button>
			</div>
			<div className="mt-2 flex flex-wrap gap-2">
				{value?.map((t: string, i: number) => (
					<span
						key={`${t}-${i}`}
						className="px-2 py-0.5 rounded bg-gray-100 text-xs border"
					>
						{t}
						<button
							type="button"
							className="ml-2 text-gray-500"
							onClick={() => remove(i)}
						>
							×
						</button>
					</span>
				))}
			</div>
			{error && <p className="text-xs text-red-600 mt-1">{error}</p>}
		</div>
	);
}

export default CloudFormDialog;
