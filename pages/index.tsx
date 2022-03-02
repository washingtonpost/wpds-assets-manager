import * as Kit from "@washingtonpost/wpds-ui-kit";
import * as AllAssets from "./../asset/esm/index";

const AssetContainer = Kit.styled("article", {
  border: "1px solid $subtle",
  background: "$accessible",
  padding: "$100",
  borderRadius: "$100",
});

const Homepage = () => {
  return (
    <>
      <h1>WPDS Assets Manager</h1>

      {Object.keys(AllAssets).map((Asset) => {
        const Component = AllAssets[Asset];
        return (
          <section key={Asset}>
            <AssetContainer>
              <h2>{Asset}</h2>
              <Kit.Icon label={Asset}>
                <Component />
              </Kit.Icon>
            </AssetContainer>
          </section>
        );
      })}
    </>
  );
};

export default Homepage;
