# 대성닛블 쇼핑몰

## ⚡️ Getting Started

### 📚 준비하기
- `docker` [설치하기](https://docs.docker.com/engine/install/)
- `docker-compose` [설치하기](https://docs.docker.com/compose/install/)
- `node >= 18.17.0` [설치하기](https://nodejs.org/en/download/package-manager)
- `prisma` [설치하기](https://www.prisma.io/docs/getting-started/quickstart)
- `make` 설치하기
```shell
# mac
brew update
brew install make

# ubuntu
sudo apt-get update
sudo apt-get -y install make
```

### 📁 DB 서버(도커) 띄우기

- `./mockenv` 파일을 참고하여 `./.env` 파일을 생성
- `./env/mysql/mockenv` 파일을 참고하여 `./env/mysql/.env` 파일을 생성
```shell
# Version mysql:8.0.39
# Port 3305:3306 (local-port:container-port)

# Database 서버 동작시키고 prisma 스키마 => 테이블 마이그레이션 한번에 처리하기
make init
```
<details>
<summary>자세한 내용 👈</summary>

- `mysql:8.0.39` 버전을 사용하며 로컬포트 `3305`에서 동작 👉 [도커파일](./docker-compose.yml)
- DB를 동작시키는 경우 `./env/mysql/data` 로컬 디렉토리로 볼륨 마운트 되므로 컨테이너가 죽어도 데이터가 유지됨
- 스키마를 정의하는 방법 두가지
    1. DDL을 직접 선언하고 DB 띄우기
        1. `./env/mysql/initdb.d/` 디렉토리에 원하는 `.sql` 파일을 추가하고 **DB 띄우기** (DB가 실행됨과 동시에 존재하는 sql 파일이 이름 순서로 실행됨)
        2. `make pull` 명령어로 DB에 만들어진 테이블 구조를 프리즈마 스키마(모델)로 자동 생성하기
    2. 프리즈마 스키마(모델)로 선언하고 DB 띄운 다음 테이블 생성하기
        1. `./prisma/schema.prisma` 파일에 스키마를 선언하고 **DB 띄우기**
        2. `make migrate` 명령어로 프리즈마 스키마에 선언한 테이블을 DB에 마이그레이션 하기
```shell
# Database 서버 동작
make start

# Database 서버 중지 (다시 띄우면 데이터 유지)
make stop

# Database 서버 중지하고 데이터 삭제
make clean

# Prisma 스키마 => Database 테이블 마이그레이션
make migrate

# Database 테이블 => Prisma 스키마 모델 자동 생성
make pull
```
</details>

### 🖥 웹 서버 띄우기

```shell
# Node Version 18.17.0 이상
# Local http://localhost:3000

# 의존성 설치
npm install

# Prisma 클라이언트 코드 생성
make generate

# 개발 서버 동작
npm run dev
```
