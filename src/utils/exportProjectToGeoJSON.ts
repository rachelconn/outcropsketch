import paper from 'paper-jsdom-canvas';
import store from '../redux/store';
import { LabelType } from '../classes/labeling/labeling';
import downloadString from './downloadString';
import removeExtension from './filenameManipulation';
import { removeOutsideView } from './paperLayers';

interface PointGeometry {
  type: 'Point',
  coordinates: [number, number],
}

interface LineStringGeometry {
  type: 'LineString',
  coordinates: [number, number][],
}

interface PolygonGeometry {
  type: 'Polygon',
  coordinates: [number, number][][],
}

interface GeoJSONFeature {
  type: 'Feature',
  geometry: PointGeometry | LineStringGeometry | PolygonGeometry,
  properties: any,
};

interface GeoJSON {
  type: 'FeatureCollection',
  features: GeoJSONFeature[],
};

// Converts an array of paper segments to GeoJSON point array format
function segmentsToPoints(segments: paper.Segment[]): [number, number][] {
  return segments.map((segment) => (
    // Flip vertical coordinates as GeoJSON uses Cartesian rather than screen coordinates
    [segment.point.x, -segment.point.y]
  ));
}

// Extracts structures from the project
function getStructures(): GeoJSONFeature[] {
  const structures: GeoJSONFeature[] = paper.project.layers[LabelType.STRUCTURE].children.map((item: paper.Path) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [segmentsToPoints(item.segments)]
      },
      properties: item.data,
    };
  });

  return structures;
}

// Extracts surfaces from the project
function getSurfaces(): GeoJSONFeature[] {
  return paper.project.layers[LabelType.SURFACE].children.map((item: paper.Path) => ({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: segmentsToPoints(item.segments),
    },
    properties: item.data,
  }));
}

export function exportProjectToGeoJSON() {
  // Save state of project before removing areas outside of view rect
  const initialState = paper.project.exportJSON();

  removeOutsideView(paper);

  let features = [...getStructures(), ...getSurfaces()];
  let serializedProject: GeoJSON = {
    type: 'FeatureCollection',
    features,
  };

  paper.project.clear();
  paper.project.importJSON(initialState);

  const filename = `${removeExtension(store.getState().image.name)}.geojson`;
  downloadString(JSON.stringify(serializedProject), filename);
};
