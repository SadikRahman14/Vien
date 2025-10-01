// Login.jsx
import React, { useState, useContext, useEffect } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login"); // "Login" | "Signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const { token, setToken, navigate, backend_url } = useContext(ShopContext);

  const base = (backend_url || "").replace(/\/$/, "");

  const api = axios.create({
    baseURL: base,
    withCredentials: false,
  });

  // Auth axios (sends/receives httpOnly cookies)
  const apiAuth = axios.create({
    baseURL: base,
    withCredentials: true,
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErr("");
    setLoading(true);

    try {
      if (currentState === "Signup") {
        // 1) Register (no credentials needed)
        await api.post("/api/v1/users/register", { name, email, password });

        // 2) Immediately log in (sets httpOnly cookies)
        const { data } = await apiAuth.post("/api/v1/users/login", {
          email,
          password,
        });

        const accessToken = data?.data?.accessToken;
        if (accessToken) setToken(accessToken);

        navigate("/");
      } else {
        // Regular login (needs credentials)
        const { data } = await apiAuth.post("/api/v1/users/login", {
          email,
          password,
        });

        const accessToken = data?.data?.accessToken;
        if (accessToken) setToken(accessToken);

        navigate("/");
      }
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if(token) navigate("/");
  }, [token]);

  const showName = currentState === "Signup";

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 mb-10 text-gray-700"
      noValidate
    >
      <div className="text-3xl font-medium transition-all duration-500">
        <Title txt1={currentState} />
      </div>

      {err && (
        <div
          role="alert"
          className="w-full text-sm text-red-600 border border-red-300 rounded-md p-2"
        >
          {err}
        </div>
      )}

      <div
        className={[
          "w-full overflow-hidden transition-all duration-500 ease-in-out will-change-transform",
          showName
            ? "max-h-20 opacity-100 scale-100 mt-0"
            : "max-h-0 opacity-0 scale-95 -mt-2",
        ].join(" ")}
        aria-hidden={!showName}
      >
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="rounded-lg w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          tabIndex={showName ? 0 : -1}
          required={showName}
        />
      </div>

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="rounded-lg w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
        autoComplete="email"
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="rounded-lg w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
        autoComplete={currentState === "Login" ? "current-password" : "new-password"}
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Your Password?</p>
        {currentState === "Login" ? (
          <p
            className="cursor-pointer"
            onClick={() => {
              setErr("");
              setCurrentState("Signup");
            }}
          >
            Create Account
          </p>
        ) : (
          <p
            className="cursor-pointer"
            onClick={() => {
              setErr("");
              setCurrentState("Login");
            }}
          >
            Login Here
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="transition-all duration-500 bg-[#07414e] hover:bg-[#0C586A] disabled:opacity-50 text-white font-light px-8 py-2 mt-4"
      >
        {loading
          ? "Please wait…"
          : currentState === "Login"
          ? "L O G I N"
          : "S I G N U P"}
      </button>
    </form>
  );
};

export default Login;
