/**
 * camelCase, PascalCase, snake_case 같은 키 이름을
 * 사람 읽기 좋은 Label로 변환하는 함수
 *
 * 예: "cloudGroupName" -> "Cloud Group Name"
 *     "eventProcessEnabled" -> "Event Process Enabled"
 *     "userActivityEnabled" -> "User Activity Enabled"
 */
export function formatHeaderLabel(key: string): string {
	if (!key) return "";

	// snake_case -> space
	const snakeConverted = key.replace(/_/g, " ");
	// camelCase/PascalCase -> space
	const withSpaces = snakeConverted.replace(/([a-z])([A-Z])/g, "$1 $2");

	// 각 단어의 첫 글자만 대문자로
	return withSpaces
		.split(" ")
		.map(word => {
			// 이미 전부 대문자(약어)인 경우 그대로
			if (word.toUpperCase() === word) return word;
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join(" ");
}
