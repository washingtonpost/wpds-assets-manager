copy-assets-into-public-directory:
	mkdir -p public
	cp -r ./src/* ./public

svg-to-react:
	npx @svgr/cli --out-dir asset src

build:
	make svg-to-react
	npx -p typescript tsc asset/*.tsx --declaration --allowJs --emitDeclarationOnly --jsx preserve
	npx parcel build asset/*.tsx --no-cache
	make copy-assets-into-public-directory
	npx next build

dev:
	make copy-assets-into-public-directory
	npx next dev