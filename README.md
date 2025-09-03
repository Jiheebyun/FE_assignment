# [필수] API 관리 방안 제시

## Q. 400여가지의 API를 React Query를 사용하여 효율적으로 관리하기 위한 방법

API는 보통 “주소 + 메서드 + 들어가는 값(쿼리/바디) + 나오는 값(응답)”으로 이루어지는데, 이런 데이터를 주고 받을수 있는 API가 많아 질수록 정리 또는 일관성이 부족하게 되면 관리하기 힘든 고충들이 생겨납니다.
예를 들어 서버-클라이언트 사이의 타입불일치, 휴먼 에러로 인한 중복 또는 오타, API 필드 변경으로 인한 화면 출력 오류,테스트 또는 모킹이 어려움 등이 생겨 날수 있으며, 이러한 고충을 줄이기 위해서 제일 먼저 규칙을 만드는 것이 중요한데, ‘스펙 → 타입 → 구현’의 순서를 강제하는 팀 규칙을 먼저 세웁니다.

핵심은 OpenAPI 스펙을 단일 진실(SSOT)로 삼고, 스펙에서 타입을 자동 생성한 뒤 그 타입에 맞춰 코드를 작성하는 것입니다. 이렇게 하면 사람이 손으로 타입을 만들 때 생기는 실수와 서버-클라이언트 불일치를 컴파일 단계에서 바로 잡을 수 있습니다.
>> OpenAPI 스펙을 단일 진실로 관리한다는 것은 API의 정의와 동작 방식을 명확하게 문서화한 YAML 또는 JSON 형식의 단일 파일에 API 관련 모든 정보를 집중시켜 관리하고, 이 파일을 변경하면 관련 시스템(문서, 코드, 테스트 등)에 자동으로 반영되도록 하는 개념입니다. 

예를 들어 /users에 email 필드를 추가하게 된다면, openapi.yaml(openapi.json) 또는 *.yaml 파일을 작성하여 수정되어질 스펙을 작성합니다

```
openapi: 3.0.3
info:
  title: My Service API
  version: "1.0.0"
servers:
  - url: https://api.example.com/v1
tags:
  - name: users
    description: 사용자 관련 API


# 공통 스키마 
components:
  schemas:
    User:
      type: object
      required: [id, name]
      properties:
        id:
          type: string
          description: UUID
        name:
          type: string
        email:
          type: string
          nullable: true        
          description: "null"
    Error:
      type: object
      required: [code, message]
      properties:
        code:    { type: string }
        message: { type: string }

```

### Path 추가 
<details>
<summary>/users 목록·상세·생성</summary>

```
paths:
  /users:
    get:
      tags: [users]
      summary: List users
      parameters:
        - in: query
          name: page
          schema: { type: integer, minimum: 0, default: 0 }
        - in: query
          name: size
          schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: object
                required: [items]
                properties:
                  items:
                    type: array
                    items: { $ref: "#/components/schemas/User" }
                  nextPage:
                    type: integer
                    nullable: true

    post:
      tags: [users]
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name]
              properties:
                name:  { type: string }
                email: { type: string, nullable: true }
      responses:
        "201":
          description: Created
          content:
            application/json:
              schema: { $ref: "#/components/schemas/User" }

  /users/{id}:
    get:
      tags: [users]
      summary: Get user detail
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema: { $ref: "#/components/schemas/User" }
        "404":
          description: Not Found

```

### 프론트에서 스펙 사용

```
// 타입을 생성
npx openapi-typescript spec/openapi.yaml -o src/lib/api/types/openapi.d.ts
```

### 생성한 타입을 가져와 사용

```react

import type { paths } from '@/lib/api/types/openapi';

type UsersList = paths['/users']['get'];
export type UsersListQuery = UsersList['parameters']['query'];
export type UsersListResp  = UsersList['responses']['200']['content']['application/json'];

```

### HTTP + React Query 훅

두 파일(http.ts, queryKeys.ts)은 한 줄로 말하면 요청을 한곳으로 모으고, 데이터 주소(캐시 키)는 규칙으로 묶는 수 있습니다. React Query가 가진 캐싱·상태관리·무효화의 장점이 모든 API에 일관되게 적용되고, API가 400개로 늘어나도 코드가 지저분해지지 않게 관리가 할 수 있습니다.

```react

// http.ts
import axios from 'axios';
export const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

// 호출기
export async function call<T>(m:'GET'|'POST', url:string, data?:any, params?:any) {
  const res = await http.request<T>({ method: m, url, data, params });
  return res.data;
}

// queryKeys.ts
export const qk = {
  users: {
    all: ['users'] as const,
    list:  (q?: unknown) => ['users','list',  q ?? {}] as const,
    detail:(id: string)  => ['users','detail',id] as const,
  },
} as const;


```

- queryKeys.ts는 데이터 주소 체계를 표준화합니다. React Query는 queryKey를 “캐시의 주소”로 쓰는데, 이게 화면마다 제멋대로면 무효화가 지옥이 됩니다. 그래서 ['users','list', 쿼리], ['users','detail', id]처럼 [도메인, 액션, 식별자/쿼리] 규칙을 정해 팩토리 함수(qk.users.list(q), qk.users.detail(id))로만 키를 만들게 됩니다 이렇게 하게되면, 오타/형태 불일치가 사라지고, 무효화가 직관적이 됩니다. 
```react

// useUsers.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { call } from './http';
import { qk } from './queryKeys';
import type { UsersListQuery, UsersListResp } from '@/lib/api/types/openapi-extra';

export const useUsersQuery = (q?: UsersListQuery) =>
  useQuery({ queryKey: qk.users.list(q), queryFn: () => call<UsersListResp>('GET','/users', undefined, q) });

export const useUserQuery = (id: string) =>
  useQuery({ queryKey: qk.users.detail(id), queryFn: () => call('GET', `/users/${id}`) });

export const useCreateUser = () =>
  useMutation((body: {name:string; email?: string|null}) => call('POST','/users', body));

```

### 무효화 규칙

변경(create/update/delete)이 일어나면 무엇을 새로고침할지가 문제가 될떄가 있습니다 아래는 도메인 규칙으로 고정합니다. 생성 성공 시 invalidateQueries({ queryKey: qk.users.all })처럼 도메인 프리픽스만 넘기면, ['users']로 시작하는 목록·상세 쿼리가 모두 stale로 표시되고 화면에 붙어 있는 쿼리는 자동으로 다시 패치됩니다. 이렇게 하면 “생성했는데 목록에 안 보인다” 같은 사고를 방지 할 수 있다는 이점이 있습니다. 트래픽을 더 아끼고 싶다면 규칙을 한 단계 더 세분화해, 수정은 detail(id)와 list()만, 삭제는 list()만 무효화하도록 도메인별 표로 정해 두는 것 또한 방법이 될 수 있을꺼 같습니다. 포인트는 개발자가 매번 “무엇을 갱신하지?”를 고민하지 않고, 팀이 합의한 무효화 규칙을 그대로 호출한다는 것 입니다. 이 한 줄 습관이 붙으면 400개의 API가 있어도 변경 후 상태 동기화가 예측 가능해지고, QA/운영도 훨씬 단순해집니다.
```react

import { queryClient } from './queryClient';

const createUser = useCreateUser();
createUser.mutate({ name:'Alice' }, {
  onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.users.all }),
});


```


</details>




# [선택] i18n 적용 방안 제시

## Q. i18n json관리, 번역 수행, 코드 작성에 걸쳐 어려움이 있기에 API 관리 방안과 마찬가지로 효율적인 i18n 적용 방안을 제시