import React from 'react';
import styles from './Typography.css';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle' | 'body1' | 'body2' | 'button';

interface TypographyProps {
  className?: string;
  variant: TypographyVariant;
}

const variantClass: Record<TypographyVariant, string> = {
  h1: styles.h1,
  h2: styles.h2,
  h3: styles.h3,
  h4: styles.h4,
  h5: styles.h5,
  h6: styles.h6,
  subtitle: styles.subtitle,
  body1: styles.body1,
  body2: styles.body2,
  button: styles.button,
};

/**
 * Typography component to standardize text appearance. Variants are based off of Google's material guidelines,
 * and modified slightly. They can be found here: https://material.io/design/typography/the-type-system.html#type-scale.
 */
const Typography: React.FC<TypographyProps> = ({
  className, variant, children,
}) => {
  let fullClassName = `${styles.typographyBase} ${variantClass[variant]}`;
  if (className) fullClassName += ` ${className}`;

  return (
    <div className={fullClassName}>
      {children}
    </div>
  );
};

export default Typography;
