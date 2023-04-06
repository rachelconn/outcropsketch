import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';
import paper from 'paper-jsdom-canvas';
import projectToMask, { maskToString } from './projectToMask';
import removeExtension, { getExtension } from './filenameManipulation';
import { loadLabelsFromString } from './loadLabelsFromFile';
import SerializedProject from '../classes/serialization/project';
import chunk from './chunk';

let numThreads = 1;
let threadIdx = 0;
if (process.argv.length > 2) {
  [numThreads, threadIdx] = process.argv.slice(2).map((x) => parseInt(x));
}

const INPUT_DATA_PATH = path.join('.', 'input');
const OUTPUT_IMAGE_DATA_PATH = path.join('.', 'converted', 'x');
const OUTPUT_LABEL_DATA_PATH = path.join('.', 'converted', 'y');

if (!fs.existsSync(OUTPUT_IMAGE_DATA_PATH)) fs.mkdirSync(OUTPUT_IMAGE_DATA_PATH, { recursive: true });
if (!fs.existsSync(OUTPUT_LABEL_DATA_PATH)) fs.mkdirSync(OUTPUT_LABEL_DATA_PATH, { recursive: true });

const files = chunk(fs.readdirSync(INPUT_DATA_PATH), numThreads, threadIdx);

// Create project
paper.setup(new paper.Size(1, 1));

async function main() {
  for (const filename of files) {
    // Determine paths to read/write and read from the file
    const fileToConvert = path.join(INPUT_DATA_PATH, filename);
    const fileText = fs.readFileSync(fileToConvert, 'utf8');
    const baseFilename = removeExtension(filename);

    const { image, imageName } = JSON.parse(fileText) as SerializedProject;
    // Image should have the same name as the csv file, but have the appropriate extension
    const imageFile = path.join(OUTPUT_IMAGE_DATA_PATH, `${baseFilename}.${getExtension(imageName)}`);
    const labelFile = path.join(OUTPUT_LABEL_DATA_PATH, `${baseFilename}.csv`);


    // Save image to output folder - need to do this first to definitively determine image size
    const imageData = image.split(',');
    if (imageData.length === 1) {
      console.log(`WARNING: Image for ${filename} is not base64 data, unable to create the image associated with this file.`);
      continue;
    }
    const buf = Buffer.from(imageData[1], 'base64');
    fs.writeFileSync(imageFile, buf);
    console.log(`Successfully created image for ${filename}.`);

    // Skip if labels have already been created to save time
    if (fs.existsSync(labelFile)) {
      console.log(`WARNING: A labeled image already exists for ${filename}. Skipping...`);
      continue;
    }

    // Load labels into project and save mask
    try {
      // Read image size
      let { width, height, orientation } = sizeOf(imageFile);
      // Orientation 5-8 means actual image is rotated or flipped 90/270 degrees
      if (orientation >= 5) [width, height] = [height, width];

      await loadLabelsFromString(fileText, {});
      // Manually resize canvas since SketchCanvas no longer does
      paper.view.viewSize = new paper.Size(Math.round(width), Math.round(height));
      paper.view.center = new paper.Point(0, 0);
      const labelFileContents = maskToString(projectToMask(), filename);

      fs.writeFileSync(labelFile, labelFileContents);
      console.log(`Successfully created labels for ${filename}.`);
    }
    catch (e) {
      console.log(`ERROR: exception creating labels for ${filename}.\n  ${e}`);
    }
  }
}

main();
