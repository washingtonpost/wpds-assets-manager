# WPDS Assets Manager (Logos, Icons, Illustrations)

[Our contribution and installation docs](https://build.washingtonpost.com/foundations/wam)

## How to Upload New Assets

1. Add the new logo or icon which you received from Design to the `./src` directory.
2. Run `npm run build`
3. Open a PR with your change and then ask for help in #wpds for a review

## Formatting your SVG

We have standardized on using viewBox over width & height attributes.

## Theming

Branded logos will use WPDS Theme Colors like so where a CSS property/variable is used with a fallback hex code.

```html
fill="var(--wpds-colors-primary, #111)"
```
