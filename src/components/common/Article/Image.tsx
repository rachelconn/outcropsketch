import * as React from 'react';
import Typography from '../Typography/Typography';
import styles from './styles.css';

interface ImageProps {
  src: string;
  caption?: string;
};

const Image: React.FC<ImageProps> = ({ src, caption }) => {
  const captionComponent = caption ? (
    <Typography className={styles.imageCaption} variant="subtitle">
      {caption}
    </Typography>
  ) : undefined;

  return (
    <div className={styles.imageContainer}>
      <img className={styles.image} src={src} />
      {captionComponent}
    </div>
  );
};

export default Image;
