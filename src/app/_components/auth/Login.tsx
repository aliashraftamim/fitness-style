"user client";

import { useLoginMutation } from "@/redux/features/auth/authApi";
import { selectCurrentUser, setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthForm } from "./AuthForm";

const Login = () => {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const currentUser = useAppSelector(selectCurrentUser);
  console.log("🚀 ~ Login ~ currentUser:", currentUser);

  if (currentUser) {
    router.push("/");
    router.refresh();
  }

  const handleLogin = async (values: Record<string, string | boolean>) => {
    const res = await login({
      email: values.email,
      password: values.password,
    }).unwrap();

    if (res?.success) {
      dispatch(
        setUser({ user: res?.data?.user, token: res?.data.access_token })
      );
      toast.success(res?.data?.message || "Login successful");

      if (currentUser) {
        router.push("/");
        router.refresh();
      }
    }
  };

  return (
    <div className="">
      <AuthForm
        fields={[
          {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "your@email.com",
          },
          { label: "Password", name: "password", type: "password" },
        ]}
        buttonLabel="Sign In"
        onSubmit={handleLogin}
        showRemember={true}
        showForgotLink={true}
        imageLink="/images/auth/basket_ball1.png"
        heading="Login to Account!"
        description="Please enter your email and password to continue"
      />
    </div>
  );
};

export default Login;
