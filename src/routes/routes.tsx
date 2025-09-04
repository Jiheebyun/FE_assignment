import React from "react";
import CloudMgmt from "../pages/cloudMgmt/CloudMgmt";
import MainLayout from "../components/layout/MainLayout";
import Security from "../pages/security/Security";
import Properties from "../pages/properties/Properties";
import Settings from "../pages/settings/Settings";

export type AppRoute = {
	path: string;
	element?: React.ReactNode;
	title?: string;
	children?: AppRoute[];
};

export const TITLE_MAP: Record<string, string> = {
	"/": "Cloud Management",
	"/cloudmgmt": "Cloud Management",
	"/security": "Security",
	"/properties": "Properties",
	"/settings": "Settings",
};

export const ROUTES: AppRoute[] = [
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				path: "/cloudmgmt",
				element: <CloudMgmt />,
				title: TITLE_MAP["/cloudmgmt"],
			},
			{
				path: "/security",
				element: <Security />,
				title: TITLE_MAP["/security"],
			},
			{
				path: "/properties",
				element: <Properties />,
				title: TITLE_MAP["/properties"],
			},
			{
				path: "/settings",
				element: <Settings />,
				title: TITLE_MAP["/settings"],
			},
		],
	},
];
