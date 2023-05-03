module.exports = {
  plugins: [
    "convertStyleToAttrs",
    "inlineStyles",
    "prefixIds",
    "removeDimensions",
    {
      name: "removeUselessStrokeAndFill",
      params: {
        removeNone: true,
      },
    },
  ],
};
