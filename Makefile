include node_modules/make-node/main.mk

MOCHAFLAGS = --require ./test/bootstrap/node
JSDOCFLAGS = -c etc/conf.json


# Perform self-tests.
check: test

apidoc: $(SOURCES)
	$(JSDOC) $(JSDOCFLAGS) -t node_modules/@www.passportjs.org/jsdoc-template -d wwwhtml $^
