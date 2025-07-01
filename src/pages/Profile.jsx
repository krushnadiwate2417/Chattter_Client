import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetching } from "../utils/fetching";
import { UPLOAD_PROFILE_PIC } from "../utils/constant";
import toast from "react-hot-toast";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setUser } from "../redux/userSlice";


function Profile({socket}) {
    const navigate = useNavigate();
    const {pathname} = useLocation();
  const user = useSelector((state) => state.userReducer.user);
  const dispatch = useDispatch();
  const [image, setImage] = useState("");

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      setImage(reader.result);

            try {
        dispatch(showLoader());
        const response = await fetching({
        url : UPLOAD_PROFILE_PIC,
        method : "POST",
        body : {
            image : reader.result
        },
        token : localStorage.getItem('token'),
        path : pathname
      })

      if(response.success){
        dispatch(hideLoader());
        toast.success(response.message)
        dispatch(setUser(response.data));
      }
      } catch (error) {
        dispatch(hideLoader());
        toast.error(error.message)
      }


    };
  }

  function getFullName() {
    if (!user) return "";
    const fName =
      user.firstName[0].toUpperCase() + user.firstName.slice(1).toLowerCase();
    const lName =
      user.lastName[0].toUpperCase() + user.lastName.slice(1).toLowerCase();
    return fName + " " + lName;
  }

  function handleLogout(){
    socket.emit('logout',user._id)
    localStorage.removeItem('token');
    navigate("/login");
  }


  useEffect(()=>{
    if(user?.profilePic){
        setImage(user?.profilePic)
    }
  },[image])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
      <div className="bg-slate-800 text-white p-8 rounded-2xl w-full max-w-md shadow-xl space-y-6">
        {/* Profile Pic or Initials */}
        <div className="flex items-center justify-center">
          {user?.profilePic || image ? (
            <img
              src={image || user.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-600"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
              {user?.firstName[0].toUpperCase()}
              {user?.lastName[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="text-center text-2xl font-semibold">{getFullName()}</h1>

        {/* Email */}
        <h2 className="text-center text-white/70">{user?.email}</h2>

        {/* Created Date */}
        <h3 className="text-center text-sm text-white/50">
          Account Created On:{" "}
          <span className="text-white/70">
            {moment(user?.createdAt).format("DD-MM-YYYY hh:mm A")}
          </span>
        </h3>

        {/* Upload Button */}
        <div className="text-center">
          <label className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
            Upload Profile Pic
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={handleLogout}
          >Log Out</button>
        </div>

      </div>
       <div className="absolute top-6 left-6">
            <button
                onClick={() => navigate("/")}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg shadow transition"
            >
                ← Back to Home
            </button>
        </div>
    </div>
  );
}

export default Profile;
