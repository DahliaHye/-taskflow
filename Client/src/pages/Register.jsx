import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [text, setText] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await signUp(userid, password, name, role);
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
      case "name":
        return setName(value);
      case "role":
        return setRole(value);
    }
  };

  return (
    <>
      <Banner text={text} isAlert={isAlert} />
      <form className="auth-form" onSubmit={onSubmit}>
        <h1 style={{ color: "var(--color-purple-light)", marginBottom: "16px" }}>
          회원가입
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
        <input
          type="text"
          name="name"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={onChange}
          className="form-input"
          required
        />
        <select
          name="role"
          value={role}
          onChange={onChange}
          className="form-input"
        >
          <option value="user">일반 사용자</option>
          <option value="staff">직원</option>
          <option value="admin">관리자</option>
        </select>
        <button
          className="form-btn auth-form-btn"
          type="submit"
          style={{ width: "100%", marginTop: "8px" }}
        >
          회원가입
        </button>
        <button
          type="button"
          className="form-btn form-btn-cancel"
          onClick={() => navigate("/login")}
          style={{ width: "100%", marginTop: "8px" }}
        >
          로그인으로 돌아가기
        </button>
      </form>
    </>
  );
};

export default Register;

