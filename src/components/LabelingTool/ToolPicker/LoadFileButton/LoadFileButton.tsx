import React from 'react';
import UtilityButton, { UtilityButtonProps } from '../UtilityButton/UtilityButton';

export interface LoadFileButtonProps {
  accept: string
  icon: string;
  label: string;
  sublabel: string;
  onFileLoad: (file: File) => any;
}

const LoadFileButton: React.FC<LoadFileButtonProps> = ({ accept, icon, label, sublabel, onFileLoad }) => {
  const fileInput = React.useRef<HTMLInputElement>();

  // When file input is updated, load the file specified
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) onFileLoad(file);
  };

  // When the visual button is clicked, intercept the event and click on the file input
  const handleButtonClick = () => {
    fileInput.current?.click();
  };

  return (
    <>
      <input type="file" accept={accept} onChange={handleInputChange} ref={fileInput} hidden />
      <UtilityButton label={label} sublabel={sublabel} icon={icon} onClick={handleButtonClick} />
    </>
  );
};

export default LoadFileButton;
