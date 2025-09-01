import { useState } from "react";
import GridTable from "../../components/gridTable/GridTable";
import CloudFormDialog from "../../components/cloudForm/CloudFormDialog";
import type { Cloud } from "../../types/types";

// Cloud 타입에 'account'가 스키마에 없어서 확장 타입
type CloudRow = Cloud & { account?: string };

// 셀 렌더러 제네릭 타입
type CellRenderer<R> = (value: unknown, row: R) => React.ReactNode;

export default function CloudMgmt() {
	const initialData: CloudRow[] = [
		{
			provider: "AWS",
			id: "cloud_mock_" + Math.random().toString(36).slice(2, 8),
			account: "Jihee",
			name: "AWS Account Mock",
			cloudGroupName: ["default-group"],
			eventProcessEnabled: true,
			userActivityEnabled: false,
			scheduleScanEnabled: true,
			scheduleScanSetting: {
				frequency: "DAY",
				date: "1",
				weekday: "MON",
				hour: "01",
				minute: "00",
			},
			regionList: ["us-east-1", "ap-northeast-2"],
			credentials: {
				accessKey: "AKIAEXAMPLEMOCK",
				secretAccessKey: "MOCKSECRETKEY1234567890",
			},
			credentialType: "ACCESS_KEY",
			eventSource: { cloudTrailName: "mock-trail" },
		},
		{
			provider: "AWS",
			id: "cloud_mock_" + Math.random().toString(36).slice(2, 8),
			account: "Jihee",
			name: "AWS Account Mock",
			cloudGroupName: ["default-group"],
			eventProcessEnabled: true,
			userActivityEnabled: false,
			scheduleScanEnabled: true,
			scheduleScanSetting: {
				frequency: "DAY",
				date: "1",
				weekday: "MON",
				hour: "01",
				minute: "00",
			},
			regionList: ["us-east-1", "ap-northeast-2", "eu-west-2"],
			credentials: {
				accessKey: "AKIAEXAMPLEMOCK",
				secretAccessKey: "MOCKSECRETKEY1234567890",
			},
			credentialType: "ACCESS_KEY",
			eventSource: { cloudTrailName: "mock-trail" },
		},
	];

	const [items, setItems] = useState<CloudRow[]>(initialData);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<CloudRow | null>(null);

	const openCreate = () => {
		setEditTarget(null);
		setDialogOpen(true);
	};
	const openEdit = (row: CloudRow) => {
		setEditTarget(row);
		setDialogOpen(true);
	};
	const openDeleteConfirm = (row: CloudRow) => {
		if (confirm(`Delete "${row.name}" ?`)) {
			setItems(prev => prev.filter(x => x.id !== row.id));
		}
	};
	const closeDialog = () => setDialogOpen(false);

	const handleSubmit = (payload: Partial<CloudRow>) => {
		if (editTarget) {
			// 수정
			setItems(prev =>
				prev.map(x =>
					x.id === editTarget.id
						? ({ ...editTarget, ...payload } as CloudRow)
						: x
				)
			);
		} else {
			// 생성
			const newItem: CloudRow = {
				id: crypto.randomUUID(),
				...(payload as CloudRow),
			};
			setItems(prev => [newItem, ...prev]);
		}
		closeDialog();
	};

	const cellTemplates: Partial<
		Record<keyof CloudRow | "actions", CellRenderer<CloudRow>>
	> = {
		cloudGroupName: value =>
			Array.isArray(value) ? (value as string[]).join(", ") : "-",

		regionList: value =>
			Array.isArray(value) ? (value as string[]).join(", ") : "-",

		eventProcessEnabled: value => (
			<span
				className={`px-2 py-0.5 rounded text-xs ${
					value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
				}`}
			>
				{value ? "Enabled" : "Disabled"}
			</span>
		),

		userActivityEnabled: value => (
			<span
				className={`px-2 py-0.5 rounded text-xs ${
					value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
				}`}
			>
				{value ? "Active" : "Inactive"}
			</span>
		),

		scheduleScanSetting: setting => {
			const s = setting as CloudRow["scheduleScanSetting"] | undefined;
			if (!s) return "-";
			switch (s.frequency) {
				case "HOUR":
					return `Every hour at ${s.minute}m`;
				case "DAY":
					return `Every day at ${s.hour}:${s.minute}`;
				case "WEEK":
					return `Every ${s.weekday} at ${s.hour}:${s.minute}`;
				case "MONTH":
					return `Every month (day ${s.date}) at ${s.hour}:${s.minute}`;
				default:
					return "-";
			}
		},

		eventSource: src => (src as CloudRow["eventSource"])?.cloudTrailName ?? "-",

		// 고정 actions 컬럼
		actions: (_v, row) => (
			<div className="flex gap-2">
				<button
					className="px-2 py-1 text-xs border rounded hover:bg-[#d3d3d3] active:bg-[#9c9c9c]"
					onClick={() => openEdit(row)}
				>
					Edit
				</button>
				<button
					className="px-2 py-1 text-xs border rounded text-red-600 hover:bg-[#d3d3d3] active:bg-[#9c9c9c]"
					onClick={() => openDeleteConfirm(row)}
				>
					Delete
				</button>
			</div>
		),
	};

	return (
		<>
			<div className="mb-3 flex justify-end">
				<button
					className="px-3 py-2 rounded bg-[#0774e1] text-white hover:bg-[#2790f3] active:bg-[#004d9a]"
					onClick={openCreate}
				>
					+ New Cloud
				</button>
			</div>

			<div className="bg-[#d8dde3]">
				<GridTable
					data={items}
					cellTemplates={cellTemplates}
					excludeKeys={["credentials", "proxyUrl", "eventSource"]}
					fallbackRender={v => <span className="text-gray-400">N/A</span>}
					stickyActionsCol
				/>
			</div>

			{dialogOpen && (
				<CloudFormDialog
					initialValues={editTarget ?? undefined}
					onClose={closeDialog}
					onSubmit={handleSubmit}
				/>
			)}
		</>
	);
}
