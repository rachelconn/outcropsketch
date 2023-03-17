import React from 'react';
import uploadIcon from '../../../icons/upload.svg';
import styles from '../Button/Button.css';
import Typography from '../Typography/Typography';

interface FileSelectProps {
  children: string;
  type: 'image' | 'json';
  onChange: (file: File) => any;
}

// HTML accept property values for each type prop value
const acceptForType = {
  'image': 'image/*',
  'json': '.json',
};

const FileSelect: React.FC<FileSelectProps> = ({ children, type, onChange }) => {
  const [filename, setFilename] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
      setFilename(file.name);
    }
  }

  // TODO: display name of uploaded file
  return (
    <div className={styles.fileSelectContainer}>
      <Typography variant="h6">
        {`${children}:`}
      </Typography>
      <div className={styles.fileSelectInputContainer}>
        <Typography variant="body2">{filename}</Typography>
        <label className={styles.button}>
          Upload
          <input
            className={styles.fileSelectInput}
            type="file"
            accept={acceptForType[type]}
            onChange={handleChange}
          />
          <img className={styles.icon} width={24} height={24} src={uploadIcon} />
        </label>
      </div>
    </div>
  );
};

export default FileSelect;
