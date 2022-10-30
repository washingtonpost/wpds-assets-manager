build-library:
	npx @svgr/cli --out-dir build src
	npx vite build
	npx tsup build/*.tsx --minify --format esm,cjs --dts --sourcemap --legacy-output --dts-only --outDir asset