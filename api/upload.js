const fs = require("fs");

const upload = async (req, res) => {
  const writeStream = fs.createWriteStream("/tmp/boop.svg");

  // pipe the request stream to the write stream
  req.pipe(writeStream);

  // send a success response when the file is uploaded
  req.on("end", () => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "File uploaded successfully" }));
  });
};

module.exports = upload;
