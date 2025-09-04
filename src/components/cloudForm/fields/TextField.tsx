type Props = {
	label: string;
	required?: boolean;
	type: "text" | "password";
	value: string;
	error?: string;
	onChange: (value: string) => void;
	inputClass: string;
};

export default function TextField({
	label,
	required,
	type,
	value,
	error,
	onChange,
	inputClass,
}: Props) {
	return (
		<div>
			<label className="block text-sm mb-1">
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</label>
			<input
				type={type}
				className={inputClass}
				value={value}
				onChange={e => onChange(e.target.value)}
			/>
			{error && <p className="text-xs text-red-600 mt-1">{error}</p>}
		</div>
	);
}
