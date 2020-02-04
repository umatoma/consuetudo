
build:
	@cd hosting && npm install && npm run build

deploy:
	@make build
	@firebase deploy --only hosting,firesture:rules
