import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import CloudMgmt from "../pages/cloudMgmt/CloudMgmt";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path="/cloudmgmt" element={<CloudMgmt />} />
					<Route index element={<Navigate to="/cloudmgmt" replace />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
