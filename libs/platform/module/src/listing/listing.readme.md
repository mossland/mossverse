# listing

listing은 제품 판매 및 제품 경매, 응모 등에 사용합니다.

#### Field 구성

| Field Name | Database Type    | GraphQL Type       | Description                                                 |
| ---------- | ---------------- | ------------------ | ----------------------------------------------------------- |
| user       | ObjectId         | gql.shared.User    | listing한 유저                                              |
| wallet     | ObjectId         | gql.shared.Wallet  | listing한 유저의 지갑 정보                                  |
| type       | String           | cnst.ListingType   | listing의 타입(token인지, thing인지, product인지)           |
| token      | ObjectId         | gql.shared.Token   | listing의 token 정보(optional)                              |
| thing      | ObjectId         | gql.shared.Thing   | listing의 thing 정보(optional)                              |
| product    | ObjectId         | gql.shared.Product | listing의 product 정보(optional)                            |
| limit      | number           | Number             | listing한 개 수                                             |
| closeAt    | date             | Date               | listing 종료시간                                            |
| tags       | string[]         | [String]           | listing 태그(검색 및 메뉴 구분용)                           |
| priceTags  | PriceTagSchema[] | [gql.PriceTags]    | listing의 가격표(여러 재화로 살 수 있게끔 Array로 되어있음) |

#### Type 구성

| Name        | Types                           |
| ----------- | ------------------------------- |
| ListingType | token, thing, product, currency |

## 스칼라 구성

listing의 스칼라 구성을 설명함.

## PriceTag

listing의 가격표를 정의함

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
