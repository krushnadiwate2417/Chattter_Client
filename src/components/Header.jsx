import { useSelector } from "react-redux"


export function Header(){

    const { user } = useSelector((state)=>state.userReducer)

    function getFullName(){
        let fName =user &&  user?.firstName[0].toUpperCase()+user?.firstName.slice(1,user?.firstName.length).toLowerCase();
        let lName =user &&  user?.lastName[0].toUpperCase()+user?.lastName.slice(1,user?.lastName.length).toLowerCase();
        return fName + " " + lName;
    }

    return <>
        <div>
            <div><h1>Chatter</h1></div>
            <div>
                <div><h3>{user && getFullName()}</h3></div>
                <div><h3>{user && user.firstName[0].toUpperCase()+user.lastName[0].toUpperCase()}</h3></div>
            </div>
        </div>
    </>
}