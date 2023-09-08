import paper from 'paper-jsdom-canvas';
import { LabelType, LabelValue } from '../classes/labeling/labeling';
import { StructureType } from '../classes/labeling/structureType';
import { NonGeologicalType } from '../classes/labeling/nonGeologicalType';
import { SurfaceType } from '../classes/labeling/surfaceType';
import downloadString from './downloadString';
import removeExtension from './filenameManipulation';
import store from '../redux/store';
import Layer from '../classes/layers/layers';

// Label numbers for each label: 0 corresponds to "no label" and is the default value
// IMPORTANT: these should never be allowed to change as it would lead to inconsistency
// between exports: legacy labels should be kept as-is, and new labels should have new numbers
// associated with them
const NO_LABEL_VALUE = 0;

// Despite the above warning, I still had to change these -
// make sure all csvs used for training have been generated after this change (12/5)

const structureLabels: Record<StructureType, number> = {
  [StructureType.CONTORTED]: 1,
  [StructureType.COVERED]: 2,
  [StructureType.CROSS_BEDDED]: 3,
  [StructureType.GRADED]: 4,
  [StructureType.PLANAR_BEDDED]: 5,
  [StructureType.STRUCTURELESS]: 6,
  [StructureType.UNKNOWN]: 7,
};

// IMPORTANT: these should be disjoint with the structure labels
const nonGeologicalLabels: Record<NonGeologicalType, number> = {
  [NonGeologicalType.COMPASS]: 129,
  [NonGeologicalType.FOLIAGE]: 130,
  [NonGeologicalType.HAMMER]: 131,
  [NonGeologicalType.PENCIL]: 132,
  [NonGeologicalType.PERSON]: 133,
  [NonGeologicalType.SKY]: 134,
  // NOTE: misc is interpreted the same as no label, thus it also uses 0
  [NonGeologicalType.MISC]: 135,
  [NonGeologicalType.UNSURE]: 136,
};

// These can overlap with structure and nongeological labels because they are part of different channels
const surfaceLabels: Record<SurfaceType, number> = {
  [SurfaceType.EROSION]: 1,
  [SurfaceType.FAULT]: 2,
  [SurfaceType.FRACTURE]: 3,
  [SurfaceType.PALEOSOL]: 4,
};

interface ChannelProps {
  layer: Layer,
  labelValues: Partial<Record<LabelValue, number>>,
}

// LabelType to use for each channel
const channels = new Map<number, ChannelProps>([
  // Structure and nongeological share the same channel
  [0, {
    layer: LabelType.STRUCTURE,
    labelValues: { ...structureLabels, ...nonGeologicalLabels },
  }],
  [1, {
    layer: LabelType.SURFACE,
    labelValues: surfaceLabels,
  }],
]);
// Total number of channels
const NUM_CHANNELS = channels.size;

/**
 * Converts a mask to a csv string.
 * @param mask 3d array of size [height, width, channel]
 * @param filename (optional) filename to use instead of the one in the redux store (for command line use)
 * @returns A string for a .csv with data for the mask:
 * Line 1 gives the width and height of the image.
 * Line 2 gives the name of the image being labeled.
 * Line 3 gives a flat list of mask data in the shape [height, width, channels].
 */
export function maskToString(mask: any[][][], filename: string = undefined): string {
  const dimensions = [mask[0].length, mask.length].join(',');
  const imageName = filename ?? store.getState().image.name;
  const maskData = mask.flat().join(',');
  return `${dimensions}\n${imageName}\n${maskData}`
}

/**
 * Creates a 3d array containing mask data for each channel
 * @returns Mask data for the current project state, where each entry is as follows:
 * array[y][x][channel] = label
 * The shape of the array is height x width x channels for ease of use with ML libraries
 */
export default function projectToMask(): number[][][] {
  const projectBounds = paper.project.view.bounds;
  const projectSize = projectBounds.size;
  // Fill with default value
  const mask = Array(projectSize.height).fill(0).map(
    _col => Array(projectSize.width).fill(0).map(
      _row => Array(NUM_CHANNELS).fill(NO_LABEL_VALUE)
    )
  );

  // Determine label for each pixel on each channel
  channels.forEach(({ layer, labelValues }, c) => {
    const hitTestOptions = {
      tolerance: 0.5,
      class: paper.PathItem,
      fill: true,
      // Don't count hit on fill of unclosed items (ie. surface label fill)
      // Ensure that the hit object is on one of the layers for the channel
      match: (hit) => hit.type !== 'fill' || hit.item.closed,
      stroke: true,
    };

    for (let x = 0; x < projectSize.width; x++) {
      for (let y = 0; y < projectSize.height; y++) {
        // Convert array coordinates to project coordinates
        const projectCoordinate = new paper.Point(x + projectBounds.left, y + projectBounds.top);
        // Hit test project, options ensure the hit is a PathItem from a layer for the channel
        const hit = paper.project.layers[layer].hitTest(projectCoordinate, hitTestOptions);
        if (hit) {
          const label = hit.item.data.label;
          const labelValue = labelValues[label];
          console.assert(labelValue !== undefined, `Invalid label ${label} on item ${hit.item}`);
          mask[y][x][c] = labelValue;
        }
      }
    }
  });

  return mask;
}

export function downloadMaskFile() {
  const filename = `${removeExtension(store.getState().image.name)}.csv`;

  downloadString(maskToString(projectToMask()), filename);
}
