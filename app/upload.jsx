import React from "react";
import * as Kit from "@washingtonpost/wpds-ui-kit";

export const Upload = () => {
  const [files, setFiles] = React.useState([]);
  const [error, sendError] = React.useState(null);

  const handleFileChange = (e) => {
    // if file extension is not an SVG, return
    if (!e.target.files[0].name.match(/\.svg$/)) {
      sendError("File must be an SVG");
    } else {
      setFiles([...files, ...e.target.files]);
    }
  };

  return (
    <Kit.Box
      as="form"
      action="/api/upload"
      method="POST"
      encType="multipart/form-data"
      css={{
        display: "grid",
        gap: "$200",
      }}
    >
      <Kit.AppBar>
        <Kit.Container>
          <h1>Upload - WAM</h1>
        </Kit.Container>
      </Kit.AppBar>

      <Kit.Container
        css={{
          paddingBlockEnd: "$200",
        }}
      >
        <Kit.Fieldset>
          {error && (
            <Kit.AlertBanner.Root
              variant="error"
              css={{
                marginBlockEnd: "$200",
              }}
              dismissable={true}
              onClick={() => {
                sendError(null);
                // clear out the file input
                document.getElementById("assets").value = "";
              }}
            >
              <Kit.AlertBanner.Trigger />
              <Kit.AlertBanner.Content>{error}</Kit.AlertBanner.Content>
            </Kit.AlertBanner.Root>
          )}
          <Kit.InputText
            css={{
              width: "60vw",
              height: "40vh",
            }}
            type="file"
            name="assets"
            id="assets"
            multiple
            label="Drag to Upload Assets"
            onChange={handleFileChange}
          />
        </Kit.Fieldset>
        <Kit.Fieldset>
          <Kit.Button type="submit">Upload</Kit.Button>
        </Kit.Fieldset>
      </Kit.Container>

      <Kit.Container
        css={{
          paddingBlockEnd: "$200",
        }}
      >
        <h2>Ready to Upload Assets</h2>
        <ul>
          {files.map((file) => (
            <li key={file.name}>
              {file.name}
              <img
                width={100}
                src={URL.createObjectURL(file)}
                alt={file.name}
              />
            </li>
          ))}
        </ul>
      </Kit.Container>
    </Kit.Box>
  );
};
