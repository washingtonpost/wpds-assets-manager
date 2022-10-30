import * as Kit from "@washingtonpost/wpds-ui-kit";
import * as AllAssets from "./../build";

const Section = Kit.styled("section", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gridGap: "1rem",
});

const AssetContainer = Kit.styled("div", {
  border: "1px solid $subtle",
  background: Kit.theme.colors.subtle,
  padding: "$100",
  color: Kit.theme.colors.red100,
  borderRadius: "$075",
});

const App = () => {
  return (
    <Section>
      <h1>WPDS Assets Manager</h1>
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

export default App;