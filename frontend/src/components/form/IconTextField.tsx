import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function IconTextfield({ type, placeholder, icon, error, onChange, value } : { type: any, placeholder : any, icon : any, error : any, onChange : any, value : any }){
  return (
    <>
      <div className="input-container" style={{margin:0}}>
        <FontAwesomeIcon icon={icon} className='icon' />
        <input
          type={type}
          className={`input-field ${error !== '' ? "error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error !== '' && <div className="error-message">{error as string ?? ''}</div>}
    </>
  )
}