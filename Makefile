clean:
	rm -rf node_modules

install:
	npm install

test:
	./node_modules/.bin/mocha --recursive --reporter list test

testwatch:
	./node_modules/.bin/nodemon -L -d 0 -w . --exec make test

.PHONY: clean install test testwatch
