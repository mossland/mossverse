로그인/가입은 다음과 같은 방식을 지원한다.
각 앱 별 가입 허용 방식은 env에서 signinTypes 설정을 통해 진행한다.

- wallet
- password
- phone
- sso
- email
- otp

유저 회원가입 과정은 다음과 같이 이루어진다.
signup x n => activateUser => signin => myKeyring => whoAmI => signadd...

- signup은 패스워드, sso, 휴대폰 등을 진행하며, keyring(status: prepare)을 리턴한다.
- activateUser는 prepare상태의 keyring을 activate로 전환하며, accessToken을 반환한다.
- signin은 status:active인 keyring에 접속하여 accessToken을 반환한다.
- 클라이언트는 accessToken을 이용하여 myKeyring, whoAmI query를 이용해 자신의 keyring과 user정보를 조회한다.
- optional한 sign정보는 signadd를 통해 이후에 추가하며, signadd는 keyring을 반환한다.
