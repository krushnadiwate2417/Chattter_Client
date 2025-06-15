export async function fetching({path,method,url,body,setError,token}){
    try {
        const response = await fetch(url,{
            method : method,
            headers : {
                "Content-Type" : "application/json",
                ...(path !== '/signUp' || path !== '/login' ? 
                    {"Authorization" : `Bearer ${token}`} : null)
            },
            ...(method === "POST" || method === "PATCH" ? {body : JSON.stringify(body)} : null)
        });
        
        const result = await response.json();
        if(!response.ok){ return setError(result.message);}
        
        return result;
    } catch (error) {
        return setError(error.message)
    }
}