import { getUserById, getUsers } from "@/actions/userActions";
import { auth } from "@/auth";
import React from "react";

const Dashboard = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  await getUsers();
  await getUserById();

  return <div>Dashboard</div>;
};

export default Dashboard;
