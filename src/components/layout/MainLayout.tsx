import { Outlet } from "react-router-dom";
import SideBar from "../sidebar/Sidebar";
import TopSidebar from "../topSidebar/TopSidebar";
import PageHeader from "../pageHeader/pageHeader";

export default function MainLayout() {
	return (
		<main className="min-h-screen flex items-stretch">
			{/* 왼쪽 사이드바 */}
			<div className="flex-none self-stretch">
				<SideBar />
			</div>

			{/* 오른쪽 페이지 영역 */}
			<section className="flex-1 p-5 min-w-0">
				<TopSidebar />
				<div className="border-b pb-2 mb-6" />
				<PageHeader />

				{/* 각 페이지가 여기로 렌더링 */}
				<Outlet />
			</section>
		</main>
	);
}
