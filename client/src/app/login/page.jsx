import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

const Login = async () => {
  const session = await auth();
  if (session?.user) {
    redirect("/users");
  }

  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("credentials", formData);
      }}
    >
      <h1>Login Your Account</h1>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email"
          className="border"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          className="border"
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
