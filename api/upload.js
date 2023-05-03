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

    for (const part of parts) {
      if (part.filename) {
        const filePath = part.filename;
        fs.writeFileSync(
          `${isDev ? "" : "/tmp/"}${filePath}`,
          part.data,
          "utf8"
        );
        console.log(part.data);
        console.log(`Saved file to ${filePath}`);
      }
    }

    // create a new commit in a new branch with the files
    const branchName =
      // use the date string prefixed by wam-bot-
      `wam-bot-${Date.now()}`;

    const files = parts.map((part) => {
      console.log(part.filename);
      // add tmp to the path if we're not in dev
      return `${isDev ? "" : "/tmp/"}${part.filename}`;
    });

    const tree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: "main",
      tree: files.map((path) => {
        console.log(path);
        return {
          // remove first slash
          path: path.replace("/", ""),
          mode: "100644",
          type: "blob",
          content: fs.readFileSync(path, "base64"),
        };
      }),
    });

    // get the sha of the last commit of the default branch
    const mainRef = await octokit.git.getRef({
      owner,
      repo,
      ref: "heads/main",
    });

    const newRef = await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: mainRef.data.object.sha,
    });

    // loop over all files and create a commit for each
    for (const file of files) {
      console.log("🛋️", file);
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: `src/${file}`,
        message: `feat: new asset - ${file.replaceAll(".svg", "")}`,
        content: fs.readFileSync(file, "base64"),
        sha: tree.data.sha,
        branch: branchName,
        committer: {
          name: "WPDS Assets Manager 👩‍🌾",
          email: "wpds@washingtonpost.com",
        },
        author: {
          name: "WPDS Assets Manager 👩‍🌾",
          email: "wpds@washingtonpost.com",
        },
      });
    }

    // create a pull request
    await octokit.pulls.create({
      owner,
      repo,
      title: `feat: new assets - ${files
        .map((file) => file.replaceAll(".svg", ""))
        .join(", ")}`,
      head: branchName,
      base: "main",
      body: `feat: new assets - ${files
        .map((file) => file.replaceAll(".svg", ""))
        .join(", ")}`,
    });

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("File uploaded successfully");
  });
};

module.exports = upload;
