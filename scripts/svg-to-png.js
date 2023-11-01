const fs = require("fs");
const path = require("path");
const svg2img = require("svg2img");

// loop through all files in the src directory
fs.readdir(path.join(__dirname, "../src"), (err, files) => {
  files.forEach((file) => {
    // if the file is not an svg skip it
    if (!file.endsWith(".svg")) return;
    // convert svg to png
    svg2img(
      path.join(__dirname, "../src", file),
      {
        resvg: {
          fitTo: {
            mode: "width",
            value: 72,
          },
        },
      },
      function (error, buffer) {
        // write to file
        fs.writeFileSync(
          path.join(__dirname, "../png", file.replace(".svg", ".png")),
          buffer
        );
      }
    );
  });
});
