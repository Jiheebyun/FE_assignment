import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../routes/routes.tsx";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				{ROUTES.map(r => (
					<Route key={r.path} path={r.path} element={r.element}>
						{r.children?.map(c => (
							<Route key={c.path} path={c.path} element={c.element} />
						))}
						<Route index element={<Navigate to="/cloudmgmt" replace />} />
					</Route>
				))}
			</Routes>
		</BrowserRouter>
	);
}
