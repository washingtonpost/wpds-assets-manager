const fs = require("fs");
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = "washingtonpost";
const repo = "wpds-assets-manager";

const upload = async (req, res) => {
  const writeStream = fs.createWriteStream("/tmp/boop.svg");

  // pipe the request stream to the write stream
  req.pipe(writeStream);

  // read the file to upload
  const fileContent = fs.readFileSync("/tmp/boop.svg");

  // create a branch
  const branchResponse = await octokit.git.createRef({
    owner,
    repo,
    ref: "refs/heads/wpds-bot",
    sha: "main",
  });

  console.log(branchResponse);

  // upload the file to GitHub
  const uploadResponse = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: "boop.svg",
    message: "Upload a file",
    content: fileContent.toString("base64"),
    committer: {
      name: "WPDS Assets Manager",
      email: "wpds@washpost.com",
    },
    sha: "wpds-bot",
  });

  console.log(uploadResponse);

  // open a pull request
  const pullRequestResponse = await octokit.pulls.create({
    owner,
    repo,
    title: "Upload a file",
    head: "wpds-bot",
    base: "main",
    body: "Upload a file",
  });

  console.log(pullRequestResponse);

  // send a success response when the file is uploaded
  req.on("end", () => {
    console.log(fileContent);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "File uploaded successfully" }));
  });
};

module.exports = upload;
