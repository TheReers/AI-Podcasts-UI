import * as React from "react";
import Image from "next/image";
import styles from "../../globals.css"
import { useRouter } from "next/navigation";


export default function CreateButton() {
    const router = useRouter();
  return (
    <button
    className=" bg-create-gradient flex items-center justify-center rounded-full h-[42px] w-[93px] mt-3 border border-br-pink"
    onClick={() => {
        router.push("/dashboard/generate")} 
    }
   style={{
  
   }}
    type="button"
  >
<Image
            src="/dashboard/sparkle-1.svg"
            alt="card image"
            width={16}
            height={16}
            priority
          />
<span style={styles.colortext} className="ml-[1px] colortext">Create</span>
  </button>
  );
}
