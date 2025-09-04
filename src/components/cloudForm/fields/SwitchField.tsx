type Props = {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
};

export default function SwitchField({ label, checked, onChange }: Props) {
	return (
		<div className="flex items-center gap-3">
			<label className="text-sm">{label}</label>
			<button
				type="button"
				onClick={() => onChange(!checked)}
				className={`w-10 h-6 rounded-full ${checked ? "bg-green-500" : "bg-gray-300"} relative`}
			>
				<span
					className={`absolute top-0.5 ${checked ? "right-0.5" : "left-0.5"} w-5 h-5 bg-white rounded-full transition-all`}
				/>
			</button>
		</div>
	);
}
