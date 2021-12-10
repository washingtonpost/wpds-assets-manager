# WPDS Assets Manager (Logos, Icons, Illustrations)

## Contributing

1. Approval process 1 week.
1. Add your SVG asset to the `./src` directory.

## Using Asset Manager

### Installation

```sh
npm i @washingtonpost/wpds-assets
```

### Code Examples

An example of how to use our Theme and Icon component to create an icon for the screen.

```jsx
import { Icon } from "@washingtonpost/ui-icon";
import { theme } from "@washingtonpost/ui-theme";
import Garlic from "@washingtonpost/wpds-assets/asset/garlic";

function MyStuff() {
  return (
    <Icon label="Garlic" size="16">
      <Garlic fill={theme.colors.green100} />
    </Icon>
  );
}
```

or

```jsx
export const MyPage = () => {
  return <img src="https://assets.build.washingtonpost.com/garlic" />;
};
```
