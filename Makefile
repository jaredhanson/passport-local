NODE = node
TEST = ./node_modules/.bin/vows
TESTS ?= test/*-test.js

test:
	@NODE_ENV=test NODE_PATH=lib $(TEST) $(TEST_FLAGS) $(TESTS)

docs: docs/api.html

docs/api.html: lib/passport-local/*.js
	dox \
		--title Passport-Local \
		--desc "Local username and password authentication strategy for Passport" \
		$(shell find lib/passport-local/* -type f) > $@

docclean:
	rm -f docs/*.{1,html}

.PHONY: test docs docclean
