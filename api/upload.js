const fs = require("fs");
const { Octokit } = require("@octokit/rest");

const createBranchAndPullRequest = async () => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const { data: branches } = await octokit.rest.repos.listBranches({
    owner: "washingtonpost",
    repo: "wpds-assets-manager",
  });

  const branchName = `wam-${branches.length + 1}`;

  await octokit.rest.git.createRef({
    owner: "washingtonpost",
    repo: "wpds-assets-manager",
    ref: `refs/heads/${branchName}`,
    sha: "main",
  });

  // add file from tmp to branch
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: "washingtonpost",
    repo: "wpds-assets-manager",
    path: "src/boop.svg",
    message: "Add boop.svg",
    content: fs.readFileSync("/tmp/boop.svg", "base64"),
    branch: branchName,
  });

  await octokit.rest.pulls.create({
    owner: "washingtonpost",
    repo: "wpds-assets-manager",
    title: "New SVG",
    head: branchName,
    base: "main",
    body: "New SVG",
  });

  return branchName;
};

const upload = async (req, res) => {
  const writeStream = fs.createWriteStream("/tmp/boop.svg");

  // pipe the request stream to the write stream
  req.pipe(writeStream);
  
  await createBranchAndPullRequest();

  // send a success response when the file is uploaded
  req.on("end", () => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "File uploaded successfully" }));
  });
};

module.exports = upload;
