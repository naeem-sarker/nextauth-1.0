import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

const Users = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const res = await fetch("http://localhost:4000/users", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  console.log(data);
  return (
    <div>
      <h2>Fetched Users</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
};

export default Users;
