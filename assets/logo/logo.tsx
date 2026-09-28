import type { SVGAttributes } from "react";
import Image from "next/image";

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <div className="flex items-center gap-2.5">
        <Image src={"/neon.jpeg"} width={20} height={20} alt="logo"/>
    </div>
  );
};

export default Logo;
