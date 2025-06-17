

export function SearchInput({searchKey,setSearchKey}){
    return <>
        <div>
            <input 
                type="text" 
                placeholder="Search..." 
                value = {searchKey}
                onChange={(e)=>setSearchKey(e.target.value)}
            />
            <button>Search</button>
        </div>
    </>
}