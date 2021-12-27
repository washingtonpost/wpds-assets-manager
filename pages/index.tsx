import { styled } from "@washingtonpost/wpds-ui-kit";
import * as AllAssets from "./../asset/index";

const AssetContainer = styled("article", {
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
              <Component />
            </AssetContainer>
          </section>
        );
      })}
    </>
  );
};

export default Homepage;
