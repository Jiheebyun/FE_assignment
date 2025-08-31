import { useState } from "react";
import GridTable from "../../components/gridTable/GridTable";
import CloudFormDialog from "../../components/cloudForm/CloudFormDialog";

import type { Cloud } from "../../types/types";

export default function CloudMgmt() {
	const initialData: Cloud[] = [
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

	const [items, setItems] = useState<Cloud[]>(initialData);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<Cloud[] | null>(null);

	const openCreate = () => {
		setEditTarget(null);
		setDialogOpen(true);
	};
	const openEdit = (row: Cloud[]) => {
		setEditTarget(row);
		setDialogOpen(true);
	};
	const openDeleteConfirm = (row: Cloud[]) => {
		// 간단히 confirm으로 처리(필요하면 delete 다이얼로그로 교체 가능)
		if (confirm(`Delete "${row.name}" ?`)) {
			setItems(prev => prev.filter(x => x.id !== row.id));
		}
	};
	const closeDialog = () => setDialogOpen(false);

	const handleSubmit = (payload: Cloud) => {
		if (editTarget) {
			setItems(prev =>
				prev.map(x =>
					x.id === editTarget.id ? { ...editTarget, ...payload } : x
				)
			);
		} else {
			const newItem = { id: crypto.randomUUID(), ...payload };
			setItems(prev => [newItem, ...prev]);
		}
		closeDialog();
	};

	const cellTemplates = {
		cloudGroupName: (value: Cloud) =>
			Array.isArray(value) ? value.join(", ") : "-",

		regionList: (value: Cloud) =>
			Array.isArray(value) ? value.join(", ") : "-",

		eventProcessEnabled: (value: boolean) => (
			<span
				className={`px-2 py-0.5 rounded text-xs ${
					value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
				}`}
			>
				{value ? "Enabled" : "Disabled"}
			</span>
		),

		userActivityEnabled: (value: boolean) => (
			<span
				className={`px-2 py-0.5 rounded text-xs ${
					value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
				}`}
			>
				{value ? "Active" : "Inactive"}
			</span>
		),

		scheduleScanSetting: (setting: Cloud["scheduleScanSetting"]) => {
			if (!setting) return "-";
			switch (setting.frequency) {
				case "HOUR":
					return `Every hour at ${setting.minute}m`;
				case "DAY":
					return `Every day at ${setting.hour}:${setting.minute}`;
				case "WEEK":
					return `Every ${setting.weekday} at ${setting.hour}:${setting.minute}`;
				case "MONTH":
					return `Every month (day ${setting.date}) at ${setting.hour}:${setting.minute}`;
				default:
					return "-";
			}
		},

		eventSource: (src: Cloud["eventSource"]) => src?.cloudTrailName ?? "-",

		// 고정 actions 컬럼
		actions: (_v: unknown, row: Cloud) => (
			<div className="flex gap-2">
				<button
					className="px-2 py-1 text-xs border rounded"
					onClick={() => openEdit(row)}
				>
					Edit
				</button>
				<button
					className="px-2 py-1 text-xs border rounded text-red-600"
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
					className="px-3 py-2 rounded bg-blue-600 text-white"
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
					fallbackRender={(v: any) => (
						<span className="text-gray-400">N/A</span>
					)}
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
