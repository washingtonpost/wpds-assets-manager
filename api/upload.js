const fs = require("fs");
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const { optimize } = require("svgo");
const owner = "washingtonpost";
const repo = "wpds-assets-manager";

const isDev = process.env.VERCEL && process.env.VERCEL_ENV === "development";

function extractBoundary(contentType) {
  const match = /boundary=(.+)$/.exec(contentType);
  if (match) {
    return match[1];
  } else {
    throw new Error("Invalid content-type header");
  }
}

function parseMultipartFormdata(buffer, boundary) {
  const parts = [];

  const lines = buffer.toString().split("\r\n");
  let part = null;

  for (const line of lines) {
    if (line.startsWith(`--${boundary}`)) {
      if (part) {
        parts.push(part);
      }
      part = { headers: {} };
    } else if (line.startsWith("Content-Disposition")) {
      const match = /name="([^"]+)"(?:; filename="([^"]+)")?/.exec(line);
      part.name = match[1];
      part.filename = match[2];
    } else if (line.startsWith("Content-Type")) {
      part.contentType = line.split(": ")[1];
    } else if (line === "") {
      part.data = Buffer.alloc(0);
    } else if (part) {
      part.data = Buffer.concat([part.data, Buffer.from(line, "utf8")]);
    }
  }

  return parts;
}

const upload = async (req, res) => {
  const chunks = [];

  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", async () => {
    const boundary = extractBoundary(req.headers["content-type"]);
    const buffer = Buffer.concat(chunks);
    const parts = parseMultipartFormdata(buffer, boundary);

    for (const part of parts) {
      if (part.filename) {
        const filePath = part.filename;
        // process the file with SVGO
        const result = await optimize(part.data, {
          path: filePath,
          multipass: true,
          plugins: [
            "convertStyleToAttrs",
            "inlineStyles",
            "prefixIds",
            "removeDimensions",
            {
              name: "removeUselessStrokeAndFill",
              params: {
                removeNone: true,
              },
            },
          ],
        });

        // write the optimized file to the same path
        fs.writeFileSync(
          `${isDev ? "" : "/tmp/"}${filePath}`,
          result.data,
          "utf8"
        );
      }
    }

    // create a new commit in a new branch with the files
    const branchName = `feat/new-assets-${
      // use files names to create a unique branch name
      parts
        .map((part) => part.filename)
        .join("-")
      .replaceAll(".svg", "")
      // random uuid
    }-${Math.random().toString(36).substring(7)
    }`;

    // get the sha of the last commit of the default branch
    const mainRef = await octokit.git.getRef({
      owner,
      repo,
      ref: "heads/main",
    });

    const tree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: mainRef.data.object.sha,
      tree: parts.map((part) => {
        const tempPath = `${isDev ? "" : "/tmp/"}${part.filename}`;

        return {
          path: `src/${part.filename}`,
          mode: "100644",
          content: fs.readFileSync(tempPath, "utf8"),
        };
      }),
    });

    const files = parts.map((part) => part.filename);

    // create a commit with the new tree
    const commit = await octokit.git.createCommit({
      owner,
      repo,
      message: `feat: new assets - ${files
        .map((file) => file.replaceAll(".svg", "").replaceAll("/tmp/", ""))
        .join(", ")}`,
      tree: tree.data.sha,
      parents: [mainRef.data.object.sha],
      author: {
        name: "WPDS Assets Manager 👩‍🌾",
        email: "wpds@washingtonpost.com",
      },
    });

    // update a reference
    const updatedRef = await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: commit.data.sha,
    });

    const pullRequest = await octokit.pulls.create({
      owner,
      repo,
      title: `feat: new assets - ${files
        .map((file) => file.replaceAll(".svg", "").replaceAll("/tmp/", ""))
        .join(", ")}`,
      head: branchName,
      base: "main",
    });

    // delete the temporary files
    parts.forEach((part) => {
      // delete the temporary file
      fs.unlinkSync(`${isDev ? "" : "/tmp/"}${part.filename}`);
    });

    // direct to the pull request web page
    res.writeHead(302, {
      Location: // use referrer to redirect to the page where the form was submitted
        req.headers.referer + "?success=true" + `&pr=${pullRequest.data.html_url}`,
    });

    res.end();
  });
};

module.exports = upload;
