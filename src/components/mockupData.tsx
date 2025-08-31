import type { Cloud } from "../types/types";

export function makeAwsCloudMock(partial?: Partial<Cloud>): Cloud {
	return {
		id: "cloud_mock_" + Math.random().toString(36).slice(2, 8),
		provider: "AWS",
		name: "AWS Account Mock",
		cloudGroupName: ["default-group"],
		eventProcessEnabled: true,
		userActivityEnabled: false,
		scheduleScanEnabled: true,
		scheduleScanSetting: {
			frequency: "DAY",
			date: "1",
			weekday: "MON",
			hour: "01",
			minute: "00",
		},
		regionList: ["us-east-1", "ap-northeast-2"],
		credentials: {
			accessKey: "AKIAEXAMPLEMOCK",
			secretAccessKey: "MOCKSECRETKEY1234567890",
		},
		credentialType: "ACCESS_KEY",
		eventSource: { cloudTrailName: "mock-trail" },
		...partial,
	};
}

export const mock = makeAwsCloudMock({
	name: "Team A – Prod",
	regionList: ["us-west-2"],
});
