import { useState, useRef  } from 'react'
import './uploader.css'
import { MdBackup } from "react-icons/md";
import Loading from '../Loading/Loading';


interface UploaderProps {
  onPredict: () => void;
  onNotPredict: () => void;
}

const Uploader: React.FC<UploaderProps> = ({onPredict, onNotPredict} ) =>{
  const country = [
    'Brazil','Canada','Finland','Japan','United-Kingdom','United_States', 
  ];
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [filename, setFilename] = useState("No Selected file");
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:8090/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: image }),
      });

      const result = await response.json();
      setPrediction(country[result.predictedIndex - 1]);
      onPredict();
    } catch (error) {

      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setFilename("No selected file");
    setImage(null);
    setPrediction('')
  }

  const handleImageChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setPrediction('')
      const file = files[0];
      setFilename(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
      setImage(null);
      setPrediction('')
      onNotPredict();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    handleImageChange(files);
  };
  
  return(
    <main>
    {
      loading ?
      <>
        <Loading/>
      </> :
      <>
        {
          prediction !== ''&& (
            <>
              <p className='result'>Hasil Prediksi : {prediction}</p>
            </>
          )
        }
        <form action=""
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className='upload-form'
        >
          <input type="file" accept='image/*' className='input-field' ref={inputRef} hidden
            onChange={({target: {files}}) => {
              handleImageChange(files)
            }}
          />
          {image ? 
          <img src={image} style={{ width: '250px', height: '250px' }} alt={filename} />
          :
          <>
            <MdBackup style={{width:'5vw', height:'5vw'}}/>
            <p className='text-3xl'>Drag and drop image</p>
            <p className='pt-6 text-xl'>or browse picture from your computer</p>
          </>
          }

        </form>

        <section className='uploaded-row'>
        <MdBackup/>
          <span className='uploaded-content'>
            {filename}
            <div onClick={handleDelete}>
              <MdBackup/>
            </div>
          </span>
        </section>
        <button
          style={{
            color: 'white',
            backgroundColor: '#1475cf',
            borderRadius: '2rem',
            padding:'1rem 2rem',
            marginTop:'3vh',
            boxShadow:'none',
            outline:'none'

          }}

          className='upload-btn'
          onClick={handlePredict}
        >
          Upload
        </button>  
      </>
    }



    </main>
  );
}

export default Uploader;