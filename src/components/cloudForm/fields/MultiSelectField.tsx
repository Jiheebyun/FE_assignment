type Props = {
	label: string;
	required?: boolean;
	value: string[];
	options: string[];
	error?: string;
	onChange: (value: string[]) => void;
};

export default function MultiSelectField({
	label,
	required,
	value,
	options,
	error,
	onChange,
}: Props) {
	const current = Array.isArray(value) ? value : [];
	const toggle = (opt: string) => {
		const next = current.includes(opt)
			? current.filter(v => v !== opt)
			: [...current, opt];
		onChange(next);
	};
	return (
		<div className="md:col-span-2">
			<label className="block text-sm mb-1">
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</label>
			<div className="flex flex-wrap gap-2">
				{options?.map(opt => (
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
			{error && <p className="text-xs text-red-600 mt-1">{error}</p>}
		</div>
	);
}
