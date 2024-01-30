import { useRef, useState } from 'react';
import defaultPP from '../../image/default.png'

interface IProfilePictureProps{
  label : any,
  register : any,
  rules : any,
  error : any
}
export default function ProfilePicture({ label , register , rules , error  } : IProfilePictureProps) {
  const [image, setImage] = useState<string | null>(defaultPP);
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
    <div className="form-control profile-picture" style={{display:'flex', justifyContent:'center', marginBottom:'3vh'}}>
      <div className="profile-container">
        <div className="profile-picture-preview" onClick={handleImageClick}>
          {image && <img src={image} alt="Profile Preview" />}
        </div>
        <input type="file"        
          onChange={(e) => {
              handleImageChange(e.target.files, e)
            }} 
            ref={fileInputRef}
            style={{ display: 'none' }}
        />
      </div>
      {error && <span className="error">{error.message}</span>}
    </div>
  );
};


