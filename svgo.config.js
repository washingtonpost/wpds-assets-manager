const path = require("path");

const getFilePrefix = (filePath = "svg") => {
  const base = path.basename(filePath, path.extname(filePath));
  return base
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

module.exports = {
  plugins: [
    "convertStyleToAttrs",
    "inlineStyles",
    {
      name: "prefixIds",
      params: {
        delim: "-",
        prefix: (_, info) => getFilePrefix(info?.path),
      },
    },
    "removeDimensions",
    {
      name: "removeUselessStrokeAndFill",
      params: {
        removeNone: true,
      },
    },
  ],
};
