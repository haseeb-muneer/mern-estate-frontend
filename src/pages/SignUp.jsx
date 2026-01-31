import React, { useState } from "react";
import { data, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";
const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setError(null);
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center font-semibold text-3xl my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="focus:outline-none
          bg-white rounded-lg p-3"
          type="text"
          id="username"
          placeholder="username"
          onChange={handleChange}
        />
        <input
          className="focus:outline-none bg-white p-3 rounded-lg"
          type="email"
          id="email"
          placeholder="email"
          onChange={handleChange}
        />
        <input
          className="focus:outline-none
          bg-white p-3 rounded-lg"
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80
        uppercase"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>

      <div className="flex mt-5 gap-2">
        <p className="">Have an account?</p>
        <Link to="/signin">
          <span className="text-blue-700">SignIn</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
