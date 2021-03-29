import React from 'react';
import loadLabelsFromFile from '../../../utils/loadLabelsFromFile';
import UtilityButton, { UtilityButtonProps } from '../UtilityButton/UtilityButton';

const LoadFileButton: React.FC = () => {
  const fileInput = React.useRef<HTMLInputElement>();

  // When file input is updated, load the file specified
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) loadLabelsFromFile(file);
  };

  // When the visual button is clicked, intercept the event and click on the file input
  const handleButtonClick = () => {
    fileInput.current?.click();
  };

  return (
    <>
      <input type="file" accept=".json" onChange={handleInputChange} ref={fileInput} hidden />
      <UtilityButton icon="open.svg" onClick={handleButtonClick} />
    </>
  );
};

export default LoadFileButton;
