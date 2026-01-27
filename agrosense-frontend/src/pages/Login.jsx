import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const nav = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    const res = await api("/api/auth/login","POST",{email,password});
    if(res.token){
      localStorage.setItem("token",res.token);
      nav("/dashboard");
    }else{
      alert(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 grid place-items-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white border p-8">
        <div className="text-2xl font-bold">Login</div>

        <form className="mt-6 space-y-3" onSubmit={submit}>
          <input className="w-full border rounded-xl p-3" placeholder="Email"
            value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded-xl p-3" placeholder="Password" type="password"
            value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="w-full bg-green-600 text-white rounded-xl p-3 font-semibold">
            Login
          </button>
        </form>

        <div className="text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-700 font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
