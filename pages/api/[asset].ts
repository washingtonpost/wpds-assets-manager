import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import rgbHex from "rgb-hex";
import { theme } from "@washingtonpost/wpds-ui-kit";

/**
 * Serves SVGs Assets from the assets folder
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  try {
    let asset = fs.readFileSync(
      `${path.resolve("./public")}/${String(req.query.asset)}.svg`,
      "utf8"
    );

    /**
     * This works only if the SVG has a fill atribute on the root
     * like so: <svg fill="[color]" />
     */
    if (req.query.fill) {
      try {
        const rgb = theme.colors[String(req.query.fill)]?.value;

        asset = asset.replace(/fill="(.*?)"/g, `fill="#${rgbHex(rgb)}"`);
      } catch (error) {
        console.error(error);
      }
    }

    res.statusCode = 200;

    res.setHeader(
      "Cache-Control",
      "public, immutable, no-transform, s-maxage=31536000, max-age=31536000"
    );

    res.setHeader("Content-Type", "image/svg+xml");

    return res.end(asset);
  } catch (err) {
    console.error(err);
    res.status(404).send("Not found");
  }
}
