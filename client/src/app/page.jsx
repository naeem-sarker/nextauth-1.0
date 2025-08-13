import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await auth();
  if(!session) {
    redirect("/login")
  }
  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Link href={"/login"}>Go Log In Page</Link>
      <Link href={"/users"}>Get Users</Link>
    </div>
  );
};

export default Home;
