import { useState } from "react";

type Props = {
	label: string;
	required?: boolean;
	value: string[];
	error?: string;
	onChange: (value: string[]) => void;
	inputClass: string;
};

export default function TagsField({
	label,
	required,
	value,
	error,
	onChange,
	inputClass,
}: Props) {
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
				{value?.map((t, i) => (
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
