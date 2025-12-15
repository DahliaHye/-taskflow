import {
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import Header from "../components/Header";
import Login from "../pages/Login";

// 전역 인증 저장소
const AuthContext = createContext({});
// 외부에서 토큰 접근
const contextRef = createRef();
export function AuthProvider({ authService, authErrorEventBus, children }) {
  // 로그인 사용자 상태 저장
  const [user, setUser] = useState(undefined);
  // 토큰을 외부에서 꺼냄
  useImperativeHandle(contextRef, () => (user ? user.token : undefined));
  // 인증 에러 발생 시 자동으로 로그아웃
  useEffect(() => {
    authErrorEventBus.listen((err) => {
      console.log(err);
      setUser(undefined);
    });
  }, [authErrorEventBus]);
  // 초기 로드 시 로그인 상태 확인하지 않음 (명시적 로그인만 허용)
  // useEffect(() => {
  //   // 자동 로그인 비활성화 - 사용자가 명시적으로 로그인해야 함
  // }, [authService]);
  const signUp = useCallback(
    async (userid, password, name, role) =>
      authService
        .signup(userid, password, name, role)
        .then((user) => setUser(user)),
    [authService]
  );
  const logIn = useCallback(
    async (userid, password) =>
      authService.login(userid, password).then((user) => setUser(user)),
    [authService]
  );
  const logOut = useCallback(
    async () => authService.logOut().then(() => setUser(undefined)),
    [authService]
  );
  const context = useMemo(
    () => ({ user, signUp, logIn, logOut }),
    [user, signUp, logIn, logOut]
  );
  // 항상 children을 렌더링하여 /register 등 공개 페이지가 동작하도록 함
  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}
export class AuthErrorEventBus {
  listen(callback) {
    this.callback = callback;
  }
  notify(error) {
    this.callback(error);
  }
}
export default AuthContext;
export const useAuth = () => useContext(AuthContext);
export const fetchToken = () => contextRef.current;
