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

paths: {}
components: {}

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

<details>

- 


# [선택] i18n 적용 방안 제시

## Q. i18n json관리, 번역 수행, 코드 작성에 걸쳐 어려움이 있기에 API 관리 방안과 마찬가지로 효율적인 i18n 적용 방안을 제시