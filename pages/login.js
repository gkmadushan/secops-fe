import React, { useContext, useState, useEffect } from "react";
import Layout from "../layout/unauthenticated";
import styles from "../styles/login.module.scss";
import GlobalContext from "../utils/GlobalContext";
import { useRouter } from "next/router";
import Axios from "../hooks/useApi";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState("");
  const global = useContext(GlobalContext);
  const router = useRouter();
  const [response, setResponse] = useState(null);

  async function login(username, password, otp) {
    const response = await Axios.post(
      "/oauth/token",
      `username=${username}&password=${password}&otp=${otp}`
    );
    if (response.status !== 200 && response.data && response.data.detail) {
      setErrors(response.data.detail);
      return false;
    } else {
      localStorage.setItem("userdata", JSON.stringify(response.data));
      global.update({
        user: response.data,
      });
      router.push("/");
    }
  }

  const loginHandler = () => {
    login(username, password, otp);
  };

  return (
    <div className={[styles.form, "col-md-6"].join(" ")}>
      <pre>
        <h1>Login</h1>
      </pre>

      <small id="emailHelp" className="form-text text-muted">
        Enter your login details below
      </small>
      <pre>
        <input
          type="email"
          name="username"
          required={true}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control"
          id="email"
          aria-describedby="emailHelp"
          placeholder="Enter email"
        />
        <br />
        <input
          type="password"
          name="password"
          required={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          id="password"
          placeholder="Password"
        />
        <br />
        <input
          type="text"
          name="otp"
          autoComplete="off"
          required={true}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="form-control"
          id="otp"
          placeholder="Ontime Password (OTP)"
        />
      </pre>

      {errors ? <div className="alert alert-warning">{errors}</div> : null}
      <button type="submit" className="btn btn-primary" onClick={loginHandler}>
        Login
      </button>
    </div>
  );
}

Login.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
