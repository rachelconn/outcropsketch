import paper from 'paper-jsdom-canvas';
import React from 'react';
import SerializedProject from '../../../classes/serialization/project';
import LabelViewer from './LabelViewer';
import { LabelType } from '../../../classes/labeling/labeling';
import { loadLabelsFromJSON } from '../../../utils/loadLabelsFromFile';
import exportProjectToJSON, { serializeProject } from '../../../utils/exportProjectToJSON';
import { labelViewerReducer } from '../../../redux/reducer';
import { createStore } from 'redux';
import displayDifference from '../../../utils/displayDifference';
import { useStore } from 'react-redux';

interface LabelComparisonViewerProps {
  trueLabels: SerializedProject,
  annotation: SerializedProject,
}

const LabelComparisonViewer: React.FC<LabelComparisonViewerProps> = ({ trueLabels, annotation }) => {
  const store = useStore();

  const [paperScope, setPaperScope] = React.useState<paper.PaperScope>();

  const handleFinishRender = (labelViewerPaperScope: paper.PaperScope) => setPaperScope(labelViewerPaperScope);

  React.useEffect(() => {
    if (!paperScope) return;

    // TODO: render annotation
    displayDifference(paperScope, annotation, store)
      .then(() => paperScope.view.update());

  }, [paperScope]);

  return <LabelViewer project={trueLabels} onFinishRender={handleFinishRender} />;
};

export default LabelComparisonViewer;
