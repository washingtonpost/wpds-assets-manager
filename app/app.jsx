import React from "react";
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

const UploadAssets = () => {
  const [files, setFiles] = React.useState([]);

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  return (
    <form action="/api/upload" method="POST" encType="multipart/form-data">
      <input
        type="file"
        name="assets"
        id="assets"
        multiple
        onChange={handleFileChange}
      />
      <button type="submit">Upload</button>

      <h2>Assets</h2>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name}
            <img
              width={100}
              height={100}
              src={URL.createObjectURL(file)}
              alt={file.name}
            />
          </li>
        ))}
      </ul>
    </form>
  );
};

const App = () => {
  // if route is /upload, render <UploadAssets />
  // else render the rest of the assets
  if (window.location.pathname === "/upload") {
    return (
      <>
        <h1>Upload Assets</h1>
        <UploadAssets />
      </>
    );
  }

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
