# stakePool

stakePool

#### Field 구성

| Field Name | Database Type     | GraphQL Type         | Description                |
| ---------- | ----------------- | -------------------- | -------------------------- |
| entries    | fetch.entrySchema[] | [fetch.Entry]          | staking한 유저들의 정보    |
| type       | string            | cnst.StakePoolTypes  | staking의 타입             |
| webview    | ObjectId          | fetch.platform.Webview | staking한 웹뷰(게임?) 대상 |
| totalValue | number            | Number               | staking 총 개 수           |

#### Type 구성

| Name          | Types             |
| ------------- | ----------------- |
| StakePoolType | exchange, staking |

## 스칼라 구성

advertise의 스칼라 구성을 설명함.

#### Entry

| Field Name | Database Type | GraphQL Type      | Description      |
| ---------- | ------------- | ----------------- | ---------------- |
| user       | ObjectId      | fetch.platform.User | staking한 유저   |
| expireAt   | date          | Date              | staking 만기일자 |
| value      | number        | Number            | staking한 개 수  |
