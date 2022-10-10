import * as React from 'react';
import styles from './styles.css';

interface EmbeddedPresentationProps {
  src: string;
};

const EmbeddedPresentation: React.FC<EmbeddedPresentationProps> = ({ src }) => (
  <iframe
    src={src}
    className={styles.presentationContainer}
    width="1280"
    height="749"
    allowFullScreen
  />
);

export default EmbeddedPresentation;
