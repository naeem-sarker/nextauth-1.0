import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";
import Signin from "./Signin";
import Signout from "./Signout";

const Header = async () => {
  const session = await auth();

  return (
    <div>
      {session?.user ? (
        <div>
          <p>{session?.user?.name}</p>
          <Image
            src={session?.user?.image}
            alt={session?.user?.name}
            width={32}
            height={32}
          />
          <Signout />
        </div>
      ) : (
        <Signin />
      )}
    </div>
  );
};

export default Header;
