import { NavLink } from "react-router-dom";
import { TableProperties, ShieldBan, Lock, Bell } from "lucide-react";
import logo from "../../assets/jh_logo.png";

type Item = {
	to: string;
	label: string;
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const items: Item[] = [
	{ to: "/cloudmgmt", label: "Dashboard", Icon: TableProperties },
	{ to: "/security", label: "Stats", Icon: ShieldBan },
	{ to: "/properties", label: "Assets", Icon: Lock },
	{ to: "/settings", label: "Alerts", Icon: Bell },
];

function IconButton({ to, label, Icon }: Item) {
	return (
		<NavLink
			to={to}
			aria-label={label}
			className={({ isActive }) =>
				[
					"w-8 h-8 rounded-md flex items-center justify-center transition-colors",
					isActive
						? "bg-[#5f86ad] text-white"
						: "hover:bg-[#5f86ad] active:bg-[#486a8c]",
				].join(" ")
			}
		>
			{({ isActive }) => (
				<Icon
					className={`w-5 h-5 ${isActive ? "text-white" : "text-brand-light"}`}
				/>
			)}
		</NavLink>
	);
}

const SideBar = () => {
	return (
		<aside className="h-full w-[60px] bg-brand-dark flex flex-col items-center p-[10px]">
			{/* 상단 로고 */}
			<div className="flex-[1] flex items-start justify-center">
				<NavLink to="/" aria-label="Home">
					<img src={logo} alt="Logo" className="w-[40px] h-[40px]" />
				</NavLink>
			</div>

			{/* 네비게이션 */}
			<nav className="flex-[9] flex flex-col items-center gap-6">
				{items.map(it => (
					<IconButton key={it.to} {...it} />
				))}
			</nav>
		</aside>
	);
};

export default SideBar;
