type Provider = "AWS" | "AZURE" | "GCP"; // AWS만 활성화

const AWSRegionList = [
	"global",
	"ap-northeast-1",
	"ap-northeast-2",
	"ap-northeast-3",
	"ap-south-1",
	"ap-southeast-1",
	"ap-southeast-2",
	"ca-central-1",
	"eu-central-1",
	"eu-north-1",
	"eu-west-1",
	"eu-west-2",
	"eu-west-3",
	"sa-east-1",
	"us-east-1",
	"us-east-2",
	"us-west-1",
	"us-west-2",
] as const;

type AWSCredentialType = "ACCESS_KEY" | "ASSUME_ROLE" | "ROLES_ANYWHERE"; // ACCESS_KEY만 활성화

interface AWSCredential {
	accessKey: string;
	secretAccessKey: string;
	roleArn?: string;
}

interface AWSEventSource {
	cloudTrailName?: string;
}

// 타 프로바이더 예시, 미사용
type AzureCredentialType = "APPLICATION";

interface AzureCredential {
	tenantId: string;
	subscriptionId: string;
	applicationId: string;
	secretKey: string;
}

interface AzureEventSource {
	storageAccountName?: string;
}

type GCPCredentialType = "JSON_TEXT";

interface GCPCredential {
	projectId?: string;
	jsonText: string;
}

interface GCPEventSource {
	storageAccountName?: string;
}

interface ScheduleScanSetting {
	/**
	 * frequency에 따라 변경됨
	 * HOUR  : 매시간을 의미
	 * DAY   : 매일을 의미
	 * WEEK  : 매주을 의미
	 * MONTH : 매월을 의미
	 */
	frequency: "HOUR" | "DAY" | "WEEK" | "MONTH";
	date: string; // '1' ~ '28'
	weekday: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
	hour: string; // '0' ~ '23'
	minute: string; // '0' ~ '60', '5' 단위로 증가
}

// 상세 정보 불러오는 API를 GET, 저장하는 API를 PUT으로 가정
export interface Cloud {
	id: string; // GET 요청 시 획득
	account: string;
	provider: Provider;
	name: string;
	cloudGroupName?: string[];
	eventProcessEnabled: boolean;
	userActivityEnabled: boolean;
	scheduleScanEnabled: boolean;
	scheduleScanSetting: ScheduleScanSetting;
	regionList: string[];
	proxyUrl?: string;
	credentials: AWSCredential | AzureCredential | GCPCredential; // GET 요쳥 시 비밀값이라 마스킹 상태로 전달됨
	credentialType: AWSCredentialType | AzureCredentialType | GCPCredentialType;
	eventSource?: AWSEventSource | AzureEventSource | GCPEventSource;
}
