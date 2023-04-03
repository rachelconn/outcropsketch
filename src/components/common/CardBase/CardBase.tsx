import React from 'react';
import Button from '../Button/Button';
import Typography from '../Typography/Typography';
import styles from './CardBase.css';

interface CardButtonProps {
  text: string,
  onClick: () => any,
  visible?: boolean,
  icon?: string,
}

interface CardBaseProps {
  title: string,
  description: string,
  subtitle?: string,
  buttons?: CardButtonProps[],
  image?: string,
}

const CardBase: React.FC<CardBaseProps> = ({
  title,
  description,
  subtitle,
  buttons = [],
  image,
}) => {
  const buttonComponents: JSX.Element[] = buttons.map((props) => {
    if (!(props.visible ?? true)) return undefined;
    return (
      <Button onClick={props.onClick} key={props.text} icon={props.icon}>
        {props.text}
      </Button>
    );
  });

  // Remove image from document flow if not present
  const imageStyle = image ? {} : { display: 'none' };

  return (
    <div className={styles.courseCardPaper}>
      <div className={styles.courseCardContent}>
        <img style={imageStyle} className={styles.courseCardImage} src={image} />
        <div>
          <Typography variant="h4">{title}</Typography>
          <Typography className={styles.subtitle} variant="h6">{subtitle}</Typography>
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
