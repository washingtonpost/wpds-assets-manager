# WPDS Assets Manager (Logos, Icons, Illustrations)

1. SVGS are not bound to sizes (remove width and height properties) prefer viewBox
2. Icon component will have fixed sizes
3. Approval process 1 week.

Package names

- "@washingtonpost/wpds-assets"

folder structure

```
assets/src/<asset>.svg
assets/dist/<asset>.svg
```

npx svgr --title-prop --template svgr-template.js --no-svgo --memo -d dist/react assets

- [ ] make sure typescript works like modules and shit

## set up

npm install
npm run build. the TS react components will be in assets/dist

## assets service idea

- [ ] use edge function

www: washingtonpost.com/wpds/assets/<icon-name>?color=$blue400&size=16
origin: wpds-assets-manager.preview.now.washingtonpost.com/api/assets/<icon-name>?color=$blue400&size=16
