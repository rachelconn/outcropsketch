import fetch from 'node-fetch';

import SerializedProject from '../classes/serialization/project';
import { evaluateAnnotation } from './evaluateAnnotation';

function fetchAnnotation(url: string): Promise<string> {
  return fetch(url)
    .then((response) => {
      if (response.ok) return response.text();
      console.error(`Unable to fetch from url ${url}.`)
      process.exit(1);
    });
}

async function main() {
  if (process.argv.length !== 4) {
    console.error('Invalid arguments.\n  Usage: ts-node getEvaluation.ts [originalImageURL] [annotationImageURL]');
    process.exit(1);
  }

  const [originalImageURL, annotationImageURL] = process.argv.slice(2);

  // Fetch annotations
  const original = fetchAnnotation(originalImageURL);
  const annotation = fetchAnnotation(annotationImageURL);
  await Promise.all([original, annotation])
    .then(([original, annotation]) => {
      // Parse original project
      const originalProject: SerializedProject = JSON.parse(original);

      // Set annotation project data correctly
      const annotationProject: SerializedProject = { ...originalProject }
      annotationProject.project = annotation;

      return evaluateAnnotation(originalProject, annotationProject);
    })
    .then((evaluation) => {
      console.log(evaluation);
    });
}

main();
