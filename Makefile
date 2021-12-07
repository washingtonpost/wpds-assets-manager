copy-assets-into-public-directory:
	mkdir -p public
	cp -r ./src/* ./public

svg-to-react:
	npx @svgr/cli --out-dir assets src

build:
	make svg-to-react
	npx -p typescript tsc assets/*.tsx --declaration --allowJs --emitDeclarationOnly --jsx preserve
	npx parcel build assets/*.tsx --no-cache
	# make copy-assets-into-public-directory
	# next build

dev:
	make copy-assets-into-public-directory
	next dev