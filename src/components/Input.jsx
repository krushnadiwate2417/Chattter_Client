

export default function Input({value,placeholder,type,setText}){
    return <input 
    placeholder={placeholder} 
    type={type} 
    value={value}
    onChange={(e)=>setText(e.target.value)}
    />
}