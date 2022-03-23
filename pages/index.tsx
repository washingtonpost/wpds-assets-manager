import * as Kit from "@washingtonpost/wpds-ui-kit";
import * as AllAssets from "./../asset/esm/index";

export type IconName = string;

export interface IconProps {
  name: IconName;
  className?: string;
  fill?: string;
}

export function getIconUrl(name: IconName): string {
  return `/icons-embed/${name}.svg`;
}

const StyledSVG = Kit.styled("svg", {
  size: "$400",
});

export function SpriteAsset(props: IconProps) {
  return (
    <StyledSVG
      css={{
        color: props.fill,
      }}
    >
      <use href={`${getIconUrl(props.name)}#wpds-asset-id`} />
    </StyledSVG>
  );
}

const Section = Kit.styled("section", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gridGap: "1rem",
});

const AssetContainer = Kit.styled("div", {
  border: "1px solid $subtle",
  background: Kit.theme.colors.subtle,
  padding: "$100",
  borderRadius: "$075",
});

const Homepage = () => {
  return (
    <Section>
      <h1>WPDS Assets Manager</h1>

      <h2>
        test using the new sprite asset component <pre>SpriteAsset</pre>
      </h2>
      <SpriteAsset name="15-back" fill="$cta" aria-hidden="true" />

      {Object.keys(AllAssets).map((Asset) => {
        const Component = AllAssets[Asset];
        return (
          <article key={Asset}>
            <h2>{Asset}</h2>
            <AssetContainer>
              <Component />
            </AssetContainer>
          </article>
        );
      })}
    </Section>
  );
};

export default Homepage;
