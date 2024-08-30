import { Navigate } from "react-router-dom";

const LoginPage = ({ axiosInstance }) => {
  return <Navigate to={import.meta.env.BASE_URL + "/"} />;
};

export default LoginPage;
