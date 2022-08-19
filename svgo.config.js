module.exports = {
  plugins: [
    "convertStyleToAttrs",
    "inlineStyles",
    "prefixIds",
    "removeDimensions",
    "reusePaths",
    "mergePaths",
    "convertShapeToPath",
    "convertTransform",
    "convertPathData",
    {
      name: "removeUselessStrokeAndFill",
      params: {
        removeNone: true,
      },
    },
  ],
};
