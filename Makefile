build-library:
	npx @svgr/cli --out-dir build src
	rm -rf asset/*
	tsc --noEmit false --isolatedModules false --sourceMap true --declaration -m commonjs --outDir asset
	tsc --noEmit false --isolatedModules false --sourceMap true --outDir asset/esm
	npx vite build
	node ./scripts/svg-to-png.js