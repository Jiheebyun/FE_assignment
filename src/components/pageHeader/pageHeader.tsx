import { useLocation } from "react-router-dom";
import { TITLE_MAP } from "../../routes/routes.tsx";

function toTitleFromPath(pathname: string): string {
	if (TITLE_MAP[pathname]) return TITLE_MAP[pathname];
	const seg = pathname.split("/").filter(Boolean)[0] || "";
	if (!seg) return "Cloud Management";
	return seg.charAt(0).toUpperCase() + seg.slice(1);
}

const PageHeader = () => {
	const { pathname } = useLocation();
	const title = toTitleFromPath(pathname);
	return (
		<header className="">
			<h2 className="text-2xl font-semibold">{title}</h2>
		</header>
	);
};

export default PageHeader;
