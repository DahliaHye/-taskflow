import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const Header = memo(({ user, onLogOut }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div 
        className="logo" 
        onClick={() => {
          if (user) {
            navigate("/tasks");
          } else {
            navigate("/login");
          }
        }}
        style={{ cursor: "pointer" }}
      >
        <h1 className="logo-name">최고의 업무 협업 Tool: TaskFlow</h1>
        {user && <span className="logo-user">@{user.userid}</span>}
      </div>
      {user && (
        <nav className="menu">
          <button 
            className="menu-item has-submenu"
            onMouseEnter={(e) => {
              const submenu = e.currentTarget.querySelector('.submenu');
              if (submenu) submenu.style.display = 'block';
            }}
            onMouseLeave={(e) => {
              const submenu = e.currentTarget.querySelector('.submenu');
              if (submenu) submenu.style.display = 'none';
            }}
          >
            업무
            <div className="submenu">
              <a 
                href="#" 
                className="submenu-item"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/tasks");
                }}
              >
                전체 업무
              </a>
              <a 
                href="#" 
                className="submenu-item"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/tasks/new");
                }}
              >
                업무 생성
              </a>
              <a 
                href="#" 
                className="submenu-item"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/mypage");
                }}
              >
                내 업무 (담당자)
              </a>
              <a 
                href="#" 
                className="submenu-item"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/tasks?myTasksOnly=true");
                }}
              >
                내가 생성한 업무
              </a>
            </div>
          </button>
          <button 
            className="menu-item" 
            onClick={() => {
              if (window.confirm("로그아웃을 하시겠습니까?")) {
                onLogOut();
                navigate("/login");
              }
            }}
          >
            로그아웃
          </button>
        </nav>
      )}
    </header>
  );
});

export default Header;
