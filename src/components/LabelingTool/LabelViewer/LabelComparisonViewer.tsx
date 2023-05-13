import paper from 'paper-jsdom-canvas';
import React from 'react';
import SerializedProject from '../../../classes/serialization/project';
import LabelViewer from './LabelViewer';
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

    displayDifference(paperScope, annotation, store)
      .then(() => paperScope.view.autoUpdate = true);
  }, [paperScope]);

  return <LabelViewer project={trueLabels} onFinishRender={handleFinishRender} />;
};

export default LabelComparisonViewer;
