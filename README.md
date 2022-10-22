# NestJS Boilerplate

예외처리, 로깅, 인증, 이메일/카카오/구글 로그인 기능을 지원합니다.

### 실행방법

1. DB 서버를 연결해주세요.
2. test용 db를 만들어주세요. (create database nestjs_test;)
3. sql 폴더에 있는 user, user_social 테이블을 생성해주세요.
4. .env.test / .env.development 파일을 만들어주세요.
5. `npm ci` 명령으로 package를 설치합니다.
6. `npm run test:e2e` 테스트를 실행합니다.
7. `npm run start:dev` api 서버를 실행합니다.
8. `http://localhost:PORT/docs` 에서 swagger를 확인할 수 있습니다.

- docker-compose.yml

```
version: '3.8'

services:
  db:
    container_name: mysql
    image: mysql:5.7
    restart: always
    volumes:
      - ./docker-volume/mysql/data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=ajdajdsiasia
    ports:
      - 3306:3306
```

- .env.test

```
PORT=30000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=ajdajdsiasia
MYSQL_DATABASE=nestjs_test
JWT_SECRET=nestjs-boilerplate
JWT_EXP=1d
KAKAO_CLIENT_ID=kakao_client_id
```
