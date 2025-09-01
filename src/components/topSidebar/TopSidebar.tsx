import { Link } from "react-router-dom";

import { User, Settings, LogOut, BellDot } from "lucide-react";

const TopSidebar = () => {
	return (
		<div className="flex justify-between mb-[10px]">
			<div className="flex">
				<Link className="mr-[0px] w-8 rounded-md flex items-center justify-center transition-colors hover:bg-[#f0f0f0] active:bg-[#c5c5c5]" to={"/"}>
					<BellDot />
				</Link>
			</div>
			<div className="flex">
				<Link className="mr-[10px] w-8 rounded-md flex items-center justify-center transition-colors hover:bg-[#f0f0f0] active:bg-[#c5c5c5]" to={"/"}>
					<User />
				</Link>
				<Link className="mr-[10px] w-8 rounded-md flex items-center justify-center transition-colors hover:bg-[#f0f0f0] active:bg-[#c5c5c5]" to={"/"}>
					<Settings />
				</Link>
				<Link className="mr-[0px] w-8 rounded-md flex items-center justify-center transition-colors hover:bg-[#f0f0f0] active:bg-[#c5c5c5]" to={"/"}>
					<LogOut />
				</Link>
			</div>
		</div>
	);
};

export default TopSidebar;
