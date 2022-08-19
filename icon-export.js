// use process.env
require("dotenv").config();
const figmaApiExporter = require("figma-api-exporter").default;

const exporter = figmaApiExporter(process.env.FIGMA_API_KEY);

const canvasIds = ["Icons", "Logos"];
const fs = require("fs");
const saveDirectory = "./src";

function exportIcons() {
  // clean out the existing export folder
  // but if it doesn't exist, don't delete it
  if (fs.existsSync(saveDirectory)) {
    fs.rmdirSync(saveDirectory, { recursive: true });
  }

  // map over canvasIds and export each canvas's SVGS
  Promise.all(
    canvasIds.map(async (canvas) => {
      try {
        exporter
          .getSvgs({
            fileId: process.env.FIGMA_FILE_ID,
            canvas,
          })
          .then((svgsData) =>
            exporter.downloadSvgs({
              saveDirectory: saveDirectory,
              svgsData: svgsData.svgs,
              lastModified: svgsData.lastModified,
            })
          );
      } catch (error) {
        console.log(error);
      }
    })
  );
}

exportIcons();
