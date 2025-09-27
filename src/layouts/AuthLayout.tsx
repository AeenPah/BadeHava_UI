import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, Outlet, useLocation } from "react-router-dom";

function AuthLayout() {
  /* -------------------------------------------------------------------------- */
  /*                                React Router                                */
  /* -------------------------------------------------------------------------- */

  const { pathname } = useLocation();

  const isLogin = pathname === "/auth/login";

  return (
    <Card className="mt-8 mx-6">
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Sign Up"} to your account</CardTitle>
        <CardDescription>
          {isLogin
            ? "Enter your username below to login to your account"
            : "Create a new account by filling in the details below"}
        </CardDescription>
        <Button asChild variant="link" className="px-0">
          <Link to={isLogin ? "/auth/register" : "/auth/login"}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        <Outlet />
      </CardContent>
    </Card>
  );
}

export default AuthLayout;
