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
  // use a PAT to authenticate with GitHub using a request.header
  // const token = req.headers.authorization.replace("Bearer ", "");
  // const octokit = new Octokit({ auth: token });

  const chunks = [];

  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", async () => {
    const boundary = extractBoundary(req.headers["content-type"]);
    const buffer = Buffer.concat(chunks);
    const parts = parseMultipartFormdata(buffer, boundary);

    // parts.map(async (part) => {
    //   console.log(part.filename);
    //   if (part.filename) {
    //     const filePath = part.filename;
    //     // process the file with SVGO
    //     const result = await optimize(part.data, {
    //       path: filePath,
    //       multipass: true,
    //       plugins: [
    //         "convertStyleToAttrs",
    //         "inlineStyles",
    //         "prefixIds",
    //         "removeDimensions",
    //         {
    //           name: "removeUselessStrokeAndFill",
    //           params: {
    //             removeNone: true,
    //           },
    //         },
    //       ],
    //     });

    //     // write the optimized file to the same path
    //     fs.writeFileSync(
    //       `${isDev ? "" : "/tmp/"}${filePath}`,
    //       result.data,
    //       "utf8"
    //     );
    //   }
    // });

    // create a new commit in a new branch with the files
    const branchName = "feat/new-assets";

    // const files = parts.map((part) => {
    //   console.log(part.filename);
    //   // add tmp to the path if we're not in dev
    //   return `${isDev ? "" : "/tmp/"}${part.filename}`;
    // });

    // get the sha of the last commit of the default branch
    const mainRef = await octokit.git.getRef({
      owner,
      repo,
      ref: "heads/main",
    });

    // create a reference for a branch
    const newBranchRef = await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: mainRef.data.object.sha,
    });

    const tree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: "main",
      tree: parts.map((part) => {
        // write file to tmp
        fs.writeFileSync(
          `${isDev ? "" : "/tmp/"}${part.filename}`,
          part.data,
          "utf8"
        );

        return {
          path: `src/${part.filename}`,
          mode: "100644",
          type: "blob",
          content: fs.readFileSync(
            `${isDev ? "" : "/tmp/"}${part.filename}`,
            "base64"
          ),
        };
      }),
    });

    // create a commit with the new tree
    const commit = await octokit.git.createCommit({
      owner,
      repo,
      message: "feat: new assets",
      tree: tree.data.sha,
      parents: [newBranchRef.data.object.sha],
      author: {
        name: "WPDS Assets Manager 👩‍🌾",
        email: "wpds@washingtonpost.com",
      },
    });

    // update a reference
    const ref = await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
      sha: commit.data.sha,
    });

    // get the sha of the last commit of the default branch
    // const mainRef = await octokit.git.getRef({
    //   owner,
    //   repo,
    //   ref: "heads/main",
    // });

    // map over files and createOrUpdateFileContents
    // const newFiles = files.map(async (file) => {
    //   const cleanedPath = file.replace("/tmp/", "");
    //   const contents = await octokit.repos.createOrUpdateFileContents({
    //     owner,
    //     repo,
    //     path: `src/${cleanedPath}`,
    //     message: `feat: new asset - ${cleanedPath.replaceAll(".svg", "")}`,
    //     content: fs.readFileSync(file, "base64"),
    //     branch: branchName,
    //     committer: {
    //       name: "WPDS Assets Manager 👩‍🌾",
    //       email: "wpds@washingtonpost.com",
    //     },
    //     author: {
    //       name: "WPDS Assets Manager 👩‍🌾",
    //       email: "wpds@washingtonpost.com",
    //     },
    //   });
    // });

    // await octokit.pulls.create({
    //   owner,
    //   repo,
    //   title: `feat: new assets - ${files
    //     .map((file) => file.replaceAll(".svg", "").replaceAll("/tmp/", ""))
    //     .join(", ")}`,
    //   head: branchName,
    //   base: "main",
    // });

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("File uploaded successfully");
  });
};

module.exports = upload;
