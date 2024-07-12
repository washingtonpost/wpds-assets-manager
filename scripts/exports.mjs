import fs from "fs/promises";
import packageJson from "../package.json" assert { type: "json" };

const files = await fs.readdir("src");

const newFiles = files.map((file) => {
  let newName = file.replace(/\.[^/.]+$/, "");
  newName = `./asset/${newName}`;

  return {
    [newName]: {
      import: `${newName}.mjs`,
      require: `${newName}.js`,
    },
  };
});

const data = JSON.stringify(Object.assign({}, ...newFiles), null, 2);

packageJson.exports = {
  ...packageJson.exports,
  ...JSON.parse(data),
};

await fs.writeFile("package.json", JSON.stringify(packageJson, null, 2));
