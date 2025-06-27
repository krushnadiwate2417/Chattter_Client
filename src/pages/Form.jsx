import { useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useState } from "react";
import { fetching } from "../utils/fetching";
import { LOGIN, SIGNUP } from "../utils/constant";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";

function Form() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      ...(pathname === '/signUp' && { firstName }),
      ...(pathname === '/signUp' && { lastName }),
      email,
      password
    };
    try {
      dispatch(showLoader());
      const result = await fetching({
        path: pathname,
        method: "POST",
        body: body,
        url: pathname === '/signUp' ? SIGNUP : LOGIN,
      });
      dispatch(hideLoader());
      result && localStorage.setItem('token', result.token);
      if (result.success) {
        toast.success(result.message);
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          {pathname === "/signUp" ? "Create an Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {pathname === "/signUp" && (
            <div>
              <Input
                placeholder="First Name"
                type="text"
                value={firstName}
                setText={setFirstName}
              />
            </div>
          )}

          {pathname === "/signUp" && (
            <div>
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                setText={setLastName}
              />
            </div>
          )}

          <div>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              setText={setEmail}
            />
          </div>

          <div>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              setText={setPassword}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition duration-200"
          >
            {pathname === "/signUp" ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/80">
          {pathname === "/signUp" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-400 hover:underline"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                type="button"
                className="text-blue-400 hover:underline"
                onClick={() => navigate("/signUp")}
              >
                Create an Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Form;
