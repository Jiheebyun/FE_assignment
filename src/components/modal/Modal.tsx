const Modal = ({ open, onClose, children }) => {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* 배경 */}
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />
			{/* 컨텐츠 */}
			<div className="relative max-w-3xl w-full bg-white rounded-2xl shadow p-6">
				{children}
			</div>
		</div>
	);
};

export default Modal;
