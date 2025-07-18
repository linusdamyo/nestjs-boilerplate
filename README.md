# NestJS Boilerplate

예외처리, 로깅, 인증, 로그인

### 실행방법

1. docker compose 로 테스트 DB를 실행하기 때문에, docker가 설치되어 있어야 합니다.
2. `src/_config` 아래 `.env.test` 파일을 확인해주세요.
3. `pnpm i --frozen-lockfile` 로 package를 설치합니다.
4. `pnpm test` 테스트를 실행합니다.
5. `pnpm test:e2e` 테스트를 실행합니다.
6. `pnpm start:dev` api 서버를 실행합니다.
    - `src/_config/.env.development` 설정이 필요합니다.

- .env.test

```
DATABASE_HOST=localhost
DATABASE_PORT=54320
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres_test
DATABASE_SYNCHRONIZE=true
DATABASE_LOGGING=false

JWT_SECRET=gyfsu8-muwdIw-dijbam
JWT_EXPIRES_IN=1h

PINO_LOG_LEVEL=fatal
```
