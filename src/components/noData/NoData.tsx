const NotFound = (headerText: string, pTagText: string) => {
	return (
		<div style={{ padding: 24 }}>
			<h2>{headerText}</h2>
			<p>{pTagText}</p>
		</div>
	);
};

export default NotFound;
