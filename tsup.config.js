const { defineConfig } = require("tsup");

export default defineConfig({
  entry: [
    "build/**/*@(js|jsx|ts|tsx)",
    "!src/**/*.test.(ts|tsx)",
    "!src/**/*.stories.(ts|tsx)",
  ],
  loader: {
    ".js": "jsx",
  },
  dts: true,
  clean: true,
  format: ["cjs", "esm"],
  outDir: "asset",
  bundle: true,
  minify: true,
  sourcemap: true,
  splitting: true,
  target: "esnext",
  treeshake: true,
});
