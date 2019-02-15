BIN=node_modules/.bin
SRC=src/**.ts
TEST=test/*_test.ts

.PHONY : all build lint format test setup clean clean-deps

all: setup format lint build test

build: $(SRC)
	$(BIN)/tsc --outDir dist --project . --pretty

lint: $(SRC)
	$(BIN)/prettier -l $(SRC) $(TEST)
	$(BIN)/tslint --project . --format codeFrame

format: $(SRC)
	$(BIN)/prettier --write $(SRC) $(TEST)

test: $(TEST)
	$(BIN)/mocha

coverage: $(SRC) $(TEST)
	$(BIN)/nyc $(BIN)/mocha

setup: node_modules

node_modules: package.json
	npm --loglevel=warn install

clean:
	rm -rf dist

clean-deps:
	rm -rf node_modules
