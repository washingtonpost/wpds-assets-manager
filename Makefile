copy-assets-into-public-directory:
	mkdir -p public
	cp -r ./src/* ./public

svg-to-react:
	npx @svgr/cli --out-dir dist src --index-template index-template.js

build:
	make svg-to-react
	npx -p typescript tsc dist/*.tsx --declaration --allowJs --emitDeclarationOnly --jsx preserve
	npx parcel build dist/*.tsx --no-cache
	# make copy-assets-into-public-directory
	# next build

dev:
	make copy-assets-into-public-directory
	next dev