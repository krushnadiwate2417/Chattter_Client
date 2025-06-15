

export default function Input({placeholder,type,setText}){
    return <input 
    placeholder={placeholder} 
    type={type} 
    onChange={(e)=>setText(e.target.value)}
    />
}