module.exports = {
  plugins: [
    "convertStyleToAttrs",
    "inlineStyles",
    "prefixIds",

    {
      name: "removeUselessStrokeAndFill",
      params: {
        removeNone: true,
      },
    },
  ],
};
