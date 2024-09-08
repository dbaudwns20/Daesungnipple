# 디비 도커로 실행시키기
.PHONY: start
start:
	@echo "Starting database..."
	@docker-compose up -d

# 디비 도커 중지하지만 기존 데이터 삭제되지 않음
.PHONY: stop
stop:
	@echo "Stopping database..."
	@docker-compose down

# 디비 도커 중지하고 기존 데이터 모두 삭제
.PHONY: clean
clean:
	@echo "Cleaning database..."
	@docker-compose down
	@rm -rf ./env/mysql/data

# 프리즈마 스키마를 데이터베이스에 마이그레이션
.PHONY: migrate
migrate:
	@echo "Migrating Prisma schema to database..."
	@npx prisma migrate dev --name init

# 데이터베이스의 테이블을 프리즈마 스키마로 가져오기
.PHONY: pull
pull:
	@echo "Pulling Prisma schema from database..."
	@prisma db pull --schema=./prisma/schema.prisma

# 프리즈마 클라이언트 코드 생성
.PHONY: generate
generate:
	@echo "Generating Prisma client..."
	@prisma generate --schema=./prisma/schema.prisma

# 디비 도커로 실행시키고 프리즈마 스키마 마이그레이션
# 디비 띄우고 바로 마이그레이션 하면 디비가 준비되기 전에 마이그레이션을 실행할 수 있으므로 15초 대기
.PHONY: init
init:
	@make start
	@echo "Waiting for database..."
	@{ \
		for i in $$(seq 1 15); do \
			printf "\rWaiting $$((i)) seconds..."; \
			sleep 1; \
		done; \
		printf "\n"; \
	}
	@make migrate
