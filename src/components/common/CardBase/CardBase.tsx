import React from 'react';
import Button from '../Button/Button';
import Typography from '../Typography/Typography';
import styles from './CardBase.css';

interface CardButtonProps {
  text: string,
  onClick: () => any,
  visible?: boolean,
}

interface CardBaseProps {
  title: string,
  description: string,
  buttons?: CardButtonProps[],
  image?: string,
}

const CardBase: React.FC<CardBaseProps> = ({
  title, description, buttons, image,
}) => {
  const buttonComponents: JSX.Element[] = (buttons ?? []).map((props) => {
    if (!(props.visible ?? true)) return undefined;
    return <Button onClick={props.onClick} key={props.text}>{props.text}</Button>
  });

  // Remove image from document flow if not present
  const imageStyle = image ? {} : { display: 'none' };

  return (
    <div className={styles.courseCardPaper}>
      <div className={styles.courseCardContent}>
        <img style={imageStyle} className={styles.courseCardImage} src={image} />
        <div>
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body1">{description}</Typography>
        </div>
        <div className={styles.courseCardButtons}>
          {buttonComponents}
        </div>
      </div>
    </div>
  );
};

export default CardBase;
