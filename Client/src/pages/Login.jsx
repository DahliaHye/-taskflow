import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await logIn(userid, password);
      navigate("/tasks");
    } catch (error) {
      setError(error);
    }
  };

  const setError = (error) => {
    setText(error.toString());
    setIsAlert(true);
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    switch (name) {
      case "userid":
        return setUserid(value);
      case "password":
        return setPassword(value);
    }
  };

  return (
    <>
      <Banner text={text} isAlert={isAlert} />
      <form className="auth-form" onSubmit={onSubmit}>
        <h1 style={{ color: "var(--color-purple-light)", marginBottom: "16px" }}>
          로그인
        </h1>
        <input
          type="text"
          name="userid"
          placeholder="아이디를 입력하세요"
          value={userid}
          onChange={onChange}
          className="form-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={onChange}
          className="form-input"
          required
        />
        <button className="form-btn auth-form-btn" type="submit">
          로그인
        </button>
        <button
          type="button"
          className="form-btn"
          onClick={() => navigate("/register")}
          style={{ background: "var(--color-purple-dark)" }}
        >
          회원가입
        </button>
      </form>
    </>
  );
};

export default Login;
