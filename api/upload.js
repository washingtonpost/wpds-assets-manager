const fs = require("fs");
const path = require("path");

const upload = async (req, res) => {
  // get the file name from the headers
  const fileName = "boop.svg";

  // create a write stream to the file
  const filePath = path.join(__dirname, fileName);
  const writeStream = fs.createWriteStream(filePath);

  // pipe the request stream to the write stream
  req.pipe(writeStream);

  // send a success response when the file is uploaded
  req.on("end", () => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "File uploaded successfully" }));
  });
};

module.exports = upload;
