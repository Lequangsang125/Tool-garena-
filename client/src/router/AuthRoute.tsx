import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactNode } from "react";

interface AuthRouteProps {
    children: ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
    const user = useSelector((state: any) => state.auth.login?.currentUser);
    console.log("User state:", user); // Debug trạng thái đăng nhập

    return user ? <Navigate to="/" replace /> : children;
};

export default AuthRoute;
