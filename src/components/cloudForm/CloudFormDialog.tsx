import { useEffect, useMemo, useState } from "react";
import Modal from "../modal/Modal";
import TextField from "./fields/TextField";
import SelectField from "./fields/SelectField";
import MultiSelectField from "./fields/MultiSelectField";
import SwitchField from "./fields/SwitchField";
import TagsField from "./fields/TagsField";
import type { Provider } from "../../types/types";
import { AWSRegionList, CLOUD_GROUPS } from "../../types/types";

/**
 * CloudFormDialog
 *
 * 확장 가능한 클라우드 계정 생성/수정/삭제 다이얼로그 컴포넌트.
 * 섹션/필드 스키마를 기반으로 입력 UI를 동적으로 렌더링하며,
 * 필드 타입별 컴포넌트(Text/Password, Select, MultiSelect, Switch, Tags)를 사용합니다.
 *
 * props:
 *  - mode: "create" | "edit" | "delete"              ← 다이얼로그 동작 모드
 *  - cloudId?: string                                   ← edit/delete 시 대상 id (모킹 fetch 사용)
 *  - initialValues?: Partial<Cloud>                     ← create 시 프리필 필요 시 사용
 *  - onClose: () => void                                ← 다이얼로그 닫기 콜백
 *  - onSubmit: (payload: any) => Promise<void> | void   ← 확인 시 호출되는 콜백(서버 저장 책임은 상위)
 *
 * 특징/동작:
 *  - 스키마(providerSchemas.AWS.sections)의 정의에 따라 필드를 렌더링합니다.
 *  - field.showIf(values)가 false를 반환하면 해당 필드는 숨겨집니다.
 *  - field.mapTo가 있는 경우, 입력값은 해당 경로로 저장됩니다.
 *  - regionList 변경 시 항상 'global'이 포함되도록 강제합니다.
 *  - provider 셀렉트는 AWS만 활성화(AZURE/GCP disabled) 상태로 제공됩니다.
 *  - 상수는 types.ts의 AWSRegionList, CLOUD_GROUPS를 사용합니다.
 *
 * 사용 예시:
 *
 *  <CloudFormDialog
 *    mode="create"
 *    onClose={() => setOpen(false)}
 *    onSubmit={(values) => api.save(values)}
 *  />
 *
 * 확장 방법:
 *  - 새 프로바이더 추가 시 providerSchemas에 스키마를 추가하고, provider 셀렉트 활성화 및 스키마 매핑 로직을 연결합니다.
 *  - 새 필드 타입이 필요하면 fields 디렉토리에 컴포넌트를 추가하고 타입 분기만 확장하세요.
 */

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
					{
						key: "cloudGroupName",
						label: "Cloud Groups",
						type: "multiselect",
						options: CLOUD_GROUPS as unknown as string[],
					},
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

const normalizeRegionList = (arr: unknown): string[] => {
	const list = Array.isArray(arr) ? arr : [];
	return list.length === 0 ? [] : Array.from(new Set(["global", ...list]));
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

	const initialMerged = useMemo(
		() => ({ ...baseDefaults, ...(initialValues || {}) }),
		[baseDefaults, initialValues]
	);
	if (initialMerged.regionList) {
		(initialMerged as any).regionList = normalizeRegionList(
			(initialMerged as any).regionList
		);
	}
	const [values, setValues] = useState<any>(initialMerged);
	const [errors, setErrors] = useState<any>({});
	const [loading, setLoading] = useState<boolean>(mode !== "create"); // edit/delete면 로딩 시작
	const [submitting, setSubmitting] = useState(false);

	// 수정 모드: 서버에서 불러와 인풋 초기화 (0~500ms sleep 요구사항)
	useEffect(() => {
		let mounted = true;
		(async () => {
			if (mode === "edit") {
				try {
					setLoading(true);
					const serverData = await fetchCloudById(cloudId!);
					if (!mounted) return;
					const normalizedRegionList = normalizeRegionList(
						(serverData as any).regionList
					);
					setValues({
						...baseDefaults,
						...serverData,
						regionList: normalizedRegionList,
					});
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
		const targetPath = mapTo || key;
		setValues(prev => {
			const draft = structuredClone(prev);
			let nextVal = val;
			if (targetPath === "regionList") {
				const arr = Array.isArray(val) ? val : [];
				const withoutGlobal = arr.filter((r: string) => r !== "global");
				nextVal =
					withoutGlobal.length === 0
						? []
						: Array.from(new Set(["global", ...withoutGlobal]));
			}
			setIn(draft, targetPath, nextVal);
			return draft;
		});
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
					{/* AWS enabled 그리고 나머지는 disabled */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SelectField
							label="Provider"
							required
							value={values.provider}
							options={["AWS", "AZURE", "GCP"]}
							disabledOptions={["AZURE", "GCP"]}
							error={errors["provider"]}
							onChange={v => {
								const next = structuredClone(values);
								next.provider = v as Provider;
								setValues(next);
							}}
							inputClass={`w-full border rounded px-2 py-2 ${errors["provider"] ? "border-red-400" : ""}`}
						/>
					</div>

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
											<TextField
												key={f.key}
												label={f.label}
												required={f.required}
												type={f.type}
												value={val}
												error={err}
												onChange={v => handleChange(f.key, v, f.mapTo)}
												inputClass={inputClass}
											/>
										);
									}

									if (f.type === "select") {
										return (
											<SelectField
												key={f.key}
												label={f.label}
												required={f.required}
												value={val}
												options={f.options || []}
												error={err}
												onChange={v => handleChange(f.key, v, f.mapTo)}
												inputClass={inputClass}
											/>
										);
									}

									if (f.type === "multiselect") {
										return (
											<MultiSelectField
												key={f.key}
												label={f.label}
												required={f.required}
												value={Array.isArray(raw) ? raw : []}
												options={f.options || []}
												error={errors[f.key]}
												onChange={next => handleChange(f.key, next, f.mapTo)}
											/>
										);
									}

									if (f.type === "switch") {
										return (
											<SwitchField
												key={f.key}
												label={f.label}
												checked={!!raw}
												onChange={v => handleChange(f.key, v, f.mapTo)}
											/>
										);
									}

									if (f.type === "tags") {
										return (
											<TagsField
												key={f.key}
												label={f.label}
												required={f.required}
												value={Array.isArray(raw) ? raw : []}
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
					className="px-4 py-2 rounded border hover:bg-[#d3d3d3] active:bg-[#9c9c9c]"
					onClick={onClose}
					disabled={submitting}
				>
					Cancel
				</button>
				<button
					className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 bg-[#0774e1] text-white hover:bg-[#2790f3] active:bg-[#004d9a]"
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

export default CloudFormDialog;
