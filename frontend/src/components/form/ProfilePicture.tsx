import { useEffect, useRef, useState } from 'react';
import defaultPP from '../../image/default.png'

interface IProfilePictureProps{
  label? : any,
  register? : any,
  rules? : any,
  error? : any,
  className : string,
  disabled? : boolean,
  currentImg : any;
}

export default function ProfilePicture({ label , register , rules , error, className, disabled, currentImg} : IProfilePictureProps) {
  const [image, setImage] = useState(currentImg);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    
    }
  };
  const handleImageChange = (files: FileList | null, ev: any) => {

    if (files && files.length > 0) {
      const file = files[0];

      const reader = new FileReader();
      register(label, { value: file, ...rules });
      console.log(file)
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result.toString());

        }
      };
      reader.readAsDataURL(file);
      setImage(null);
    }
  };

  const handleDeleteClick = () => {
    setImage(defaultPP)
  };

  return (
    <div className="form-control profile-picture" style={{display:'flex', justifyContent:'center'}}>
      <div className="profile-container">
        <div className={`profile-picture-preview ${className}`} onClick={handleImageClick}>
          {image && <img src={image} alt="Profile Preview" />}
        </div>
        <input type="file"        
          onChange={(e) => {
              handleImageChange(e.target.files, e)
            }} 
            ref={fileInputRef}
            style={{ display: 'none' }}
          disabled={disabled}
        />
      </div>
      {error && <span className="error">{error.message}</span>}
    </div>
  );
};


