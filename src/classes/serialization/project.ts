/**
 * Represents a serialized geoLabeler project.
 * image: Base64-serialized image.
 * project: Result from paper.project.exportJSON().
 */
export default interface SerializedProject {
  image: string;
  project: string;
}
