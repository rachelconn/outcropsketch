import React from 'react';
import { createPortal } from 'react-dom';
import Typography from '../Typography/Typography';
import closeIcon from '../../../icons/close.svg';
import errorIcon from '../../../icons/error.svg';
import styles from './ErrorAlert.css';


interface ErrorAlertProps {
  response?: Response,
  errorText?: string,
  onDismiss?: () => any,
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ response, errorText, onDismiss }) => {
  if (response && errorText) throw Error('ErrorAlert can only take one of the following props: response, errorText. Make sure you are only setting one!');
  const [message, setMessage] = React.useState('');
  const [visible, setVisible] = React.useState(true);

  const handleCloseClick = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  React.useEffect(() => {
    // Ignore null or ok responses
    if (!response || response.ok) return;

    // Determine proper message to display
    if (response.status === 500) {
      setMessage('An internal error occurred. Try again later, and contact us if the problem persists.');
      setVisible(true);
    }
    response.json()
      .then((json) => {
        setMessage(json['reason'] ?? json['detail']);
        setVisible(true);
      })
      .catch((e) => {
        setMessage('An unknown error occurred.');
        setVisible(true);
        console.error(e);
      });
  }, [response]);

  React.useEffect(() => {
    setMessage(errorText);
  }, [errorText]);

  const wrapperStyle = (visible && message) ? {} : { display: 'none' };

  return (
    <>
      {
        createPortal((
          <div style={wrapperStyle} className={styles.errorAlertWrapper}>
            <div className={styles.errorAlertContainer}>
              <div className={styles.errorIconContainer}>
                <img width={24} height={24} src={errorIcon} />
              </div>
              <Typography variant="body1">
                {message}
              </Typography>
              <div className={styles.closeIconContainer} onClick={handleCloseClick}>
                <img width={24} height={24} src={closeIcon} />
              </div>
            </div>
          </div>
        ), document.getElementById('root'))
      }
    </>
  );
};

export default ErrorAlert;
