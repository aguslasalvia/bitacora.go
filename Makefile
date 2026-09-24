BIN_DIR := bin
BINARY  := $(BIN_DIR)/app

.PHONY: build build-frontend run test clean

# El binario lee scripts/DDL.sql y web/ (build de Astro) con paths relativos
# al cwd, así que build siempre los deja al lado (cd bin && ./app para
# correrlo).
build: build-frontend
	go build -o $(BINARY) ./cmd/bitacora
	cp -r ./scripts $(BIN_DIR)/
	rm -rf $(BIN_DIR)/web
	mv ./web $(BIN_DIR)/

build-frontend:
	cd frontend && npm install && npm run build

run: build-frontend
	go run ./cmd/bitacora

test:
	go test -v ./...

clean:
	rm -rf $(BIN_DIR) web
