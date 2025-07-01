import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";


function Profile(){

    const user = useSelector(state => state.userReducer.user);
    const [image,setImage] = useState('');

    async function handleImageUpload(event){
        const file = event.target.files[0];
        
        const reader = new FileReader(file);

        reader.readAsDataURL(file);

        reader.onloadend = async ()=>{
            setImage(reader.result)
        }
    }


    function getFullName() {
        if (!user) return "";
        const fName =
        user.firstName[0].toUpperCase() +
        user.firstName.slice(1).toLowerCase();
        const lName =
        user.lastName[0].toUpperCase() +
        user.lastName.slice(1).toLowerCase();
        return fName + " " + lName;
    }

    return <>
        <div>
            <div>
                {
                    user?.profilePic ? 
                    user?.profilePic : 
                    (`${user?.firstName[0].toUpperCase() + user?.lastName[0].toUpperCase()}`)
                }
            </div>
            <div>
                <h1>{getFullName()}</h1>
            </div>
            <div>
                <h2>{user?.email}</h2>
            </div>
            <div>
                <h3>Account Created On : {moment(user?.createdAt).format("DD-MM-YYYY hh:mm A")}</h3>
            </div>
            <div>
                <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageUpload}
                />
            </div>
        </div>
    </>
}

export default Profile;