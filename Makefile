download-assets:
	node download-figma-assets.js

build-assets:
	make download-assets
	npx svgo src/*.svg
	npx @svgr/cli --out-dir build src
	npx tsup build/*.tsx --minify --format esm,cjs --dts --sourcemap --legacy-output --outDir asset

build-all:
	make build-assets
	npx next build

dev:
	npx next dev