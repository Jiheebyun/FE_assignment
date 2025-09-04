type Props = {
	label: string;
	required?: boolean;
	value: string;
	options: string[];
	disabledOptions?: string[];
	error?: string;
	onChange: (value: string) => void;
	inputClass: string;
};

export default function SelectField({
	label,
	required,
	value,
	options,
	disabledOptions,
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
			<select
				className={inputClass}
				value={value}
				onChange={e => onChange(e.target.value)}
			>
				<option value="">Select...</option>
				{options?.map(opt => (
					<option
						key={opt}
						value={opt}
						disabled={disabledOptions?.includes(opt)}
					>
						{opt}
					</option>
				))}
			</select>
			{error && <p className="text-xs text-red-600 mt-1">{error}</p>}
		</div>
	);
}
