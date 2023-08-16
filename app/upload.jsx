import React from "react";
import * as Kit from "@washingtonpost/wpds-ui-kit";

export const Upload = () => {
  const [files, setFiles] = React.useState([]);
  const [error, sendError] = React.useState(null);
  const [success, sendSuccess] = React.useState(null);
  const [pullRequest, setPullRequest] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);

  const handleFileChange = (e) => {
    // if file extension is not an SVG, return
    if (!e.target.files[0].name.match(/\.svg$/)) {
      sendError("File must be an SVG");
    } else {
      setFiles([...files, ...e.target.files]);
    }
  };

  // if search params are present, show success message
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("success") &&
      params.get("success") === "true" &&
      params.get("pr")
    ) {
      sendSuccess(true);
      // save params to state
      setPullRequest(params.get("pr"));
    }

    // fake isLoading state using params
    if (params.get("loading") && params.get("loading") === "true") {
      setLoading(true);
    }
  }, []);

  // use view transition api to show loading state

  if (isLoading) {
    return (
      <Kit.Box>
        <Kit.Container
          css={{
            top: 0,
            left: 0,
            background: "$signal",
            zIndex: 100,
            position: "absolute",
            height: "100%",
            boxSizing: "border-box",
            color: "$onPrimary",
            fontSize: "$200",
          }}
        >
          <progress />
          <p>
            🍕 One moment while we prepare your assets. This may take a few 🧄
          </p>
        </Kit.Container>
      </Kit.Box>
    );
  }

  return (
    <Kit.Box
      as="form"
      id="upload"
      action="/api/upload"
      method="POST"
      encType="multipart/form-data"
      css={{
        display: "grid",
        gap: "$200",
      }}
      onSubmit={
        files.length > 0
          ? (e) => {
              e.preventDefault();
              setLoading(true);
              // fetch the upload endpoint
              fetch("/api/upload", {
                method: "POST",
                body: new FormData(document.getElementById("upload")),
                // send enctype header
                headers: {
                  enctype: "multipart/form-data",
                },
                redirect: "follow",
              })
                .then((res) => {
                  if (res.ok) {
                    // redirect to the pull request page
                    window.location.href = res.url;
                  } else {
                    sendError(
                      `Something went wrong. Please try again. ${JSON.stringify(
                        res
                      )}`
                    );
                  }
                })
                .catch((err) => {
                  sendError(`Something went wrong. Please try again. ${err}`);
                });
            }
          : (e) => {
              e.preventDefault();
              sendError("You must select at least one file to upload");
            }
      }
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
          {success && (
            <Kit.AlertBanner.Root
              variant="success"
              css={{
                marginBlockEnd: "$200",
              }}
              dismissable={true}
              onClick={() => {
                sendSuccess(null);
                // clear out history
                window.history.replaceState(
                  {},
                  document.title,
                  window.location.pathname
                );
              }}
            >
              <Kit.AlertBanner.Trigger />
              <Kit.AlertBanner.Content>
                Your assets have been uploaded successfully. They are now
                available in the <a href={pullRequest}>pull request</a>.
                Visually inspect the icons in the Preview page. It is available
                in the pull request page. Then contact the #sred-team channel
                requesting a code review.
              </Kit.AlertBanner.Content>
            </Kit.AlertBanner.Root>
          )}

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
