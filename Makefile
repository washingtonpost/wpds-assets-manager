build-assets:
	node export-figma-assets.js
	npx svgo src/*.svg
	npx @svgr/cli --out-dir build src
	npx tsup build/*.tsx --minify --format esm,cjs --dts --sourcemap --legacy-output --outDir asset

build-all:
	make build-assets
	npx next build

dev:
	npx next dev