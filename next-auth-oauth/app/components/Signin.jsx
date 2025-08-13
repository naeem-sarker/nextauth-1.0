import Link from "next/link";
import React from "react";
import { doSignIn } from "../actions";

const Signin = () => {
  return (
    <form action={doSignIn}>
      {/* <Link href="/api/auth/signin">Sign In</Link> */}
      <button className="submit">Sign In with Google</button>
    </form>
  );
};

export default Signin;
