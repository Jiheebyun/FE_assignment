import { Link } from "react-router-dom";
import { TableProperties, ShieldBan, Lock, Bell } from "lucide-react";
import logo from "../../assets/jh_logo.png";

const SideBar = () => {
	return (
		<>
			<aside className="h-full w-[60px] bg-orange-50 flex flex-col items-center p-[10px]">
				<div className="flex-[1] flex items-start justify-center">
					<Link to="/">
						<img src={logo} alt="Logo" className="w-[40px] h-[40px]" />
					</Link>
				</div>
				<nav className="flex-[9] flex flex-col items-center gap-6">
					<Link to="/" className="flex justify-center">
						<TableProperties className="w-5 h-5 text-gray-700 hover:text-black" />
					</Link>
					<Link to="/stats" className="flex justify-center">
						<ShieldBan className="w-5 h-5 text-gray-700 hover:text-black" />
					</Link>
					<Link to="/properties" className="flex justify-center">
						<Lock className="w-5 h-5 text-gray-700 hover:text-black" />
					</Link>
					<Link to="/settings" className="flex justify-center">
						<Bell className="w-5 h-5 text-gray-700 hover:text-black" />
					</Link>
				</nav>
			</aside>
		</>
	);
};

export default SideBar;
