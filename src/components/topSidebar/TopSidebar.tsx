import { Link } from "react-router-dom";

import { User, Settings, LogOut } from "lucide-react";

const TopSidebar = () => {
	return (
		<div className="flex justify-between mb-[10px]">
			<div className="flex">
				<Link className="mr-[5px]" to={"/"}>
					<User />
				</Link>
				<Link className="mr-[5px]" to={"/"}>
					<User />
				</Link>
			</div>
			<div className="flex">
				<Link className="mr-[5px]" to={"/"}>
					<User />
				</Link>
				<Link className="mr-[5px]" to={"/"}>
					<Settings />
				</Link>
				<Link className="mr-[5px]" to={"/"}>
					<LogOut />
				</Link>
			</div>
		</div>
	);
};

export default TopSidebar;
