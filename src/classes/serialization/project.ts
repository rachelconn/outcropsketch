import { Label } from "../labeling/labeling";

export type Version = [number, number, number];

/**
 * Represents a serialized geoLabeler project.
 * image: Base64-serialized image.
 * project: Result from paper.project.exportJSON().
 */
export default interface SerializedProject {
  image: string;
  imageName: string;
  project: string;
  version?: Version;
  labels?: Label[],
}

export type SerializedLabelTypes = Pick<SerializedProject, 'labels'>;
