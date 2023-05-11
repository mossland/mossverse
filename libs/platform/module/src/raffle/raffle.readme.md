# raffle

raffle은 제품 경매, 응모 등에 사용합니다.

#### Field 구성

| Field Name | Database Type    | GraphQL Type       | Description                                                |
| ---------- | ---------------- | ------------------ | ---------------------------------------------------------- |
| type       | String           | cnst.raffleType    | raffle의 타입(token인지, thing인지, product인지)           |
| token      | ObjectId         | gql.shared.Token   | raffle의 token 정보(optional)                              |
| thing      | ObjectId         | gql.shared.Thing   | raffle의 thing 정보(optional)                              |
| product    | ObjectId         | gql.shared.Product | raffle의 product 정보(optional)                            |
| entryLimit | number           | Number             | 인 당 최대 응모 횟수                                       |
| tags       | string[]         | [String]           | raffle 태그(검색 및 메뉴 구분용)                           |
| closeAt    | date             | Date               | raffle 종료시간                                            |
| priceTags  | PriceTagSchema[] | [gql.PriceTags]    | raffle의 가격표(여러 재화로 살 수 있게끔 Array로 되어있음) |
| entries    | string[]         | [String]           | raffle 래플에 응모한 유저들 리스트                         |

#### Type 구성

| Name       | Types                 |
| ---------- | --------------------- |
| raffleType | token, thing, product |

## 스칼라 구성

raffle의 스칼라 구성을 설명함.

## PriceTag

raffle의 가격표를 정의함

#### Field 구성

| Field Name    | Database Type | GraphQL Type      | Description                    |
| ------------- | ------------- | ----------------- | ------------------------------ |
| type          | string        | cnst.PriceTagType | PriceTag의 타입 정보           |
| thing         | ObjectId      | gql.shared.Thing  | PriceTag의 재화 정보(Optional) |
| token         | ObjectId      | gql.shared.Token  | PriceTag의 재화 정보(Optional) |
| price         | number        | Number            | 가격                           |
| discountPrice | number        | Number            | 할인된 가격                    |

#### Type 구성

| Name         | Types        |
| ------------ | ------------ |
| PriceTagType | token, thing |
