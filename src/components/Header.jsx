import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();

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

  return (
    <header className="w-full bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700 shadow-sm">
      {/* App Title */}
      <h1 className="text-white text-2xl font-bold tracking-wide">
        Chatter
      </h1>

      {/* User Section */}
      {user && (
        <div className="flex items-center space-x-4">
          {/* Initials Badge */}
          <div onClick={()=>{
            navigate('/profile')
          }}  className="bg-blue-600 cursor-pointer text-white font-semibold w-10 h-10 flex items-center justify-center rounded-full">
            {user.firstName[0].toUpperCase()}
            {user.lastName[0].toUpperCase()}
          </div>

          {/* Full Name */}
          <h3 className="text-white font-medium text-lg">{getFullName()}</h3>
        </div>
      )}
    </header>
  );
}
