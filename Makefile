build-library:
	npx @svgr/cli --out-dir build src
	npx tsup build/index.ts build/*.tsx --minify --format esm,cjs --dts --sourcemap --legacy-output --outDir asset
	npx vite build