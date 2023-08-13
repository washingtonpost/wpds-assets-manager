import React from "react";
import * as Kit from "@washingtonpost/wpds-ui-kit";
import * as AllAssets from "./../build";
import { Upload } from "./upload";

const pageStyles = Kit.globalCss({
  body: {
    margin: 0,
    padding: "$100",
    fontFamily: "$body",
  },
  h1: {
    fontSize: "$200",
    fontWeight: "$bold",
    marginBlockEnd: "$100",
    fontFamily: "$headline",
  },
  h2: {
    fontSize: "$150",
    fontWeight: "$bold",
    marginBlockEnd: "$100",
    fontFamily: "$headline",
  },
});

const App = () => {
  pageStyles();

  if (window.location.pathname === "/upload") {
    return <Upload />;
  }

  return (
    <>
      <h1>WPDS Assets Manager</h1>
      <h2>
        <a href="/upload">Upload Assets</a>
      </h2>
      <Kit.Box
        css={{
          display: "flex",
          // masoncary layout with flexbox
          flexWrap: "wrap",
          gap: "$200",
          justifyContent: "center",
          alignItems: "center",
          paddingBlockEnd: "$200",
        }}
      >
        {Object.keys(AllAssets).map((Asset) => {
          const Component = AllAssets[Asset];
          return (
            <Kit.Box
              as="article"
              key={Asset}
              css={{
                background: "$alpha50",
                borderRadius: "$100",
                textAlign: "center",
              }}
            >
              <h3>{Asset}</h3>
              <Kit.Box
                as="svg"
                css={{
                  color: "$pink200",
                  border: "1px solid $pink200",
                }}
                asChild
              >
                <Component />
              </Kit.Box>
            </Kit.Box>
          );
        })}
      </Kit.Box>
    </>
  );
};

export default App;
