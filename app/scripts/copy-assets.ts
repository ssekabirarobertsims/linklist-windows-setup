import fs from "fs";
import path from "path";

const appRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(appRoot, "..");

const distRoot = path.join(projectRoot, "dist", "app");

const assets = [
  {
    source: path.join(appRoot, "windows"),
    destination: path.join(distRoot, "windows"),
  },
  {
    source: path.join(appRoot, "public"),
    destination: path.join(distRoot, "public"),
  },
];

for (const asset of assets) {
  if (!fs.existsSync(asset.source)) {
    console.warn(`Skipping missing asset: ${asset.source}`);
    continue;
  }

  fs.cpSync(asset.source, asset.destination, {
    recursive: true,
  });

  console.log(`Copied: ${asset.source}`);
}

console.log("Static Electron assets copied successfully.");
