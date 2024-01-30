import { IChildren } from "../interface/children-interface";


export default function MainTemplate({children} : IChildren){


  return (
    <div>
        {children}
    </div>
  )
}