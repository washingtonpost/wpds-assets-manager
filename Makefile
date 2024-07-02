build-library:
	npx @svgr/cli --out-dir build src
	rm -rf asset/*
	npx tsup
	npx vite build