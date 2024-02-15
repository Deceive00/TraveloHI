import  { useState } from 'react';
import styles from './MultipleFileInput.module.scss';
import { MdDelete } from "react-icons/md";
const MultipleFileInput = ({ onFilesSelect } : {onFilesSelect : any}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e : any) => {
    const files = e.target.files;
    const selectedFilesArray = [];
    for (let i = 0; i < files.length; i++) {
      selectedFilesArray.push(files[i]);
    }
    setSelectedFiles(selectedFilesArray);
    onFilesSelect(selectedFilesArray);
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    console.log(updatedFiles);
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    onFilesSelect(updatedFiles);

  };

  return (
    <div className={styles.multipleFileInput}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className={styles.button}
      />
      <div className={styles.filePreviewGrid}>
        {selectedFiles.map((file, index) => (
          <div key={index} className={styles.fileItem}>
            <img src={URL.createObjectURL(file)} alt={file.name} />
            <p>{file.name}</p>
            <button type='button' className={styles.deleteButton} onClick={() => handleDeleteFile(index)}>
              <MdDelete/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleFileInput;
