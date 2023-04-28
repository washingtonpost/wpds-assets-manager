const fs = require("fs");
const path = require("path");
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = "washingtonpost";
const repo = "wpds-assets-manager";

const createBranchAndPullRequest = async () => {
  // read the file to upload
  const fileContent = fs.readFileSync("/tmp/boop.svg");

  octokit.repos
    .createOrUpdateFile({
      owner,
      repo,
      path: fileName,
      message: "Add new file",
      content: fileContent.toString("base64"),
    })
    .then(() => {
      console.log(`File ${fileName} uploaded successfully`);

      // create a new branch
      const branchName = `new-file-${Date.now()}`;
      const mainBranch = "main";
      octokit.git
        .createRef({
          owner,
          repo,
          ref: `refs/heads/${branchName}`,
          sha: mainBranch,
        })
        .then(() => {
          console.log(`Branch ${branchName} created successfully`);

          // create a new pull request
          octokit.pulls
            .create({
              owner,
              repo,
              title: `Add ${fileName}`,
              head: branchName,
              base: mainBranch,
              body: "Please review and merge this file",
            })
            .then(() => {
              console.log(`Pull request created successfully`);
            })
            .catch((error) => {
              console.error(`Error creating pull request: ${error}`);
            });
        })
        .catch((error) => {
          console.error(`Error creating branch: ${error}`);
        });
    })
    .catch((error) => {
      console.error(`Error uploading file: ${error}`);
    });
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
