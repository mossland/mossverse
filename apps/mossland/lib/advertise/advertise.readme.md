# advertise

advertise은 광고 개제에 필요한 데이터를 정리한 모델입니다.

#### Field 구성

| Field Name | Database Type | GraphQL Type       | Description               |
| ---------- | ------------- | ------------------ | ------------------------- |
| openAt     | date          | Date               | 광고가 개제되는 시간      |
| closeAt    | date          | Date               | 광고 개제가 종료되는 시간 |
| bids       | bidSchema[]   | [fetch.Bid]          | 광고 입찰 리스트          |
| status     | string        | cnst.AdvertiseType | 현재 광고 상태            |

#### Type 구성

| Name              | Types                                    |
| ----------------- | ---------------------------------------- |
| advertiseStatuses | active, biding, publish, close, inactive |

## 스칼라 구성

advertise의 스칼라 구성을 설명함.

#### bid

| Field Name | Database Type | GraphQL Type     | Description          |
| ---------- | ------------- | ---------------- | -------------------- |
| user       | ObjectId      | fetch.User         | bid한 유저 정보      |
| value      | number        | Number           | bid 가격             |
| type       | string        | cnst.BidType     | bid한 재화 타입      |
| thing      | ObjectId      | fetch.shared.thing | bid한 재화 정보      |
| token      | ObjectId      | fetch.shared.token | bid한 재화 정보      |
| images     | ObejctId      | fetch.shared.File  | 광고에 사용될 이미지 |
| videos     | ObejctId      | fetch.shared.File  | 광고에 사용될 영상   |
