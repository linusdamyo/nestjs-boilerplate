# NestJS Boilerplate

예외처리, 로깅, 인증, 로그인

### 실행방법

1. DB 서버를 연결해주세요.
2. `src/_config` 아래 `.env.test` 파일을 확인해주세요.
3. `pnpm i --frozen-lockfile` 로 package를 설치합니다.
4. `pnpm test` 테스트를 실행합니다.
5. `pnpm test:e2e` 테스트를 실행합니다.
6. `pnpm start:dev` api 서버를 실행합니다.
6.1. `src/_config/.env.development` 설정이 필요합니다.

- docker-compose.yml

```
version: '3'

services:
  pg:
    container_name: pg
    image: postgres:17
    restart: always
    volumes:
        - ./docker-volume/pg/data:/var/lib/postgresql/data
    environment:
        - POSTGRES_DB=postgres
        - POSTGRES_USER=postgres
        - POSTGRES_PASSWORD=postgres
    ports:
        - 54320:5432
```

- .env.test

```
DATABASE_HOST=localhost
DATABASE_PORT=54320
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres
DATABASE_SYNCHRONIZE=true
DATABASE_LOGGING=false

JWT_SECRET=gyfsu8-muwdIw-dijbam
JWT_EXPIRES_IN=1h

PINO_LOG_LEVEL=fatal
```
