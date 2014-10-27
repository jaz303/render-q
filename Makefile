all: dist/render-q.js dist/render-q.min.js

dist:
	mkdir -p dist

dist/render-q.js: index.js dist
	browserify -o $@ -s renderq $<

dist/render-q.min.js: dist/render-q.js
	./node_modules/.bin/uglifyjs < $< > $@

clean:
	rm -rf dist