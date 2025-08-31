import React from "react";
import { formatHeaderLabel } from "../../utils/format/formatHeaderLabel";

/**
 * @param {Array|Object} data - 테이블에 그려질 데이터 (객체 또는 객체 배열)
 * 전달된 객체(들)의 모든 키를 헤더로 그리고,
 * 셀 값이 문자열이면 그대로 출력,
 * 문자열이 아니면 cellTemplates[key]로 렌더, 없으면 fallbackRender로 처리.
 *
 * props:
 *  - cellTemplates?: { [key]: (value, row) => ReactNode, ... }  ← 비문자열 셀 커스텀
 *  - excludeKeys?: any                                      ← 제외할 키 (배열/Set/객체키/단일값 허용)
 *  - fallbackRender?: (value, row, key) => ReactNode        ← 템플릿 없고 문자열도 아닐 때
 */
const GridTable = ({ data, cellTemplates, excludeKeys, fallbackRender }) => {
	const templates = cellTemplates ?? {};
	const excludeSet = (() => {
		if (!excludeKeys) return new Set();
		if (Array.isArray(excludeKeys)) return new Set(excludeKeys);
		if (excludeKeys instanceof Set) return excludeKeys;
		if (typeof excludeKeys === "object")
			return new Set(Object.keys(excludeKeys));
		return new Set([excludeKeys]);
	})();
	const renderCell =
		fallbackRender ??
		(v => {
			if (typeof v === "string") return v;
			if (Array.isArray(v)) return v.join(", ");
			if (v == null) return "-";
			if (typeof v === "boolean") return v ? "true" : "false";
			if (typeof v === "number") return String(v);
			try {
				return JSON.stringify(v);
			} catch {
				return String(v);
			}
		});

	const rows = Array.isArray(data) ? data : [data];
	const sample = rows[0];
	if (!sample || typeof sample !== "object") {
		return <div className="text-sm text-gray-500">데이터가 없습니다.</div>;
	}

	// 문자열 키는 자동 포함, 비문자열 키는 "템플릿 있을 때만" 포함
	const allKeys = Array.from(
		new Set(
			rows.flatMap(r => (r && typeof r === "object" ? Object.keys(r) : []))
		)
	);
	const keys = allKeys
		.filter(k => !excludeSet.has(k))
		.filter(k => {
			const v = sample[k];
			const hasTemplate = typeof templates[k] === "function";
			return typeof v === "string" || hasTemplate;
		});

	// 템플릿에만 있는 키도 포함 (예: actions)
	const templateOnlyKeys = Object.keys(templates).filter(
		k => !excludeSet.has(k) && !keys.includes(k)
	);
	const finalKeys = [...keys, ...templateOnlyKeys];

	return (
		<div className="relative w-full max-w-full overflow-x-auto">
			<table className="table-auto w-full border-collapse border border-gray-300 text-sm min-w-max">
				<thead>
					<tr className="bg-gray-100">
						{finalKeys.map(k => (
							<th
								key={k}
								className={`border px-3 py-2 text-left whitespace-nowrap ${
									k === "actions" ? "text-transparent" : ""
								}`}
							>
								{k === "actions" ? "" : formatHeaderLabel(k)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, rIdx) => (
						<tr key={row?.id ?? rIdx} className="hover:bg-gray-50">
							{finalKeys.map(k => {
								const v = row?.[k];
								const stickyClass =
									k === "actions" ? "sticky right-0 bg-white z-10" : "";

								if (typeof v === "string") {
									return (
										<td key={k} className={`border px-3 py-2 ${stickyClass}`}>
											{v}
										</td>
									);
								}

								if (typeof templates[k] === "function") {
									return (
										<td key={k} className={`border px-3 py-2 ${stickyClass}`}>
											{templates[k](v, row)}
										</td>
									);
								}

								// 안전망
								return (
									<td key={k} className={`border px-3 py-2 ${stickyClass}`}>
										{renderCell(v, row, k)}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default GridTable;
