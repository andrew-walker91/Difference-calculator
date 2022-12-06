install:
	npm install

install-deps:
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint .

tests:
	npm test -- --coverage --coverageProvider=v8

test-coverage:
	npm test --coverage

	.PHONY: test