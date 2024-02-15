import React, { useState } from 'react';
import styles from './FileInput.module.scss';

const FileInput = ({ onFileSelect }: { onFileSelect: (file: File | null) => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className={styles.fileInput}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.input}
      />
    </div>
  );
};

export default FileInput;
