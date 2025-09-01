import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import CloudMgmt from "../pages/cloudMgmt/CloudMgmt";
import Properties from "../pages/\bproperties/Properties";
import Settings from "../pages/settings/Settings";
import Security from "../pages/Security/Security";


export default function App() {
	return (
		<BrowserRouter>
		<Routes>
		  <Route element={<MainLayout />}>
			<Route path="/cloudmgmt" element={<CloudMgmt />} />
			<Route path="/security" element={<Security />} />
			<Route path="/properties" element={<Properties />} />
			<Route path="/settings" element={<Settings />} />
  
			{/* 기본 경로는 cloudmgmt로 */}
			<Route index element={<Navigate to="/cloudmgmt" replace />} />
		  </Route>
		</Routes>
	  </BrowserRouter>
	);
}
