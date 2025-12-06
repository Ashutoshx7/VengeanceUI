"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, useScroll } from "framer-motion";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const Navbar1 = () => {
  const { scrollY } = useScroll();
  const [isDown, setisDown] = useState(false);

  scrollY.on("change", (latest) =>
    latest > 20 ? setisDown(true) : setisDown(false)
  );
  return (
    <motion.div
      animate={
        isDown
          ? {
              scaleX: 0.99,
              boxShadow: `0 4px 15px rgba(0, 0, 0, 0.05)`,
              y: 10,
              border: "1px solid rgba(255, 255, 255, 0.02)",
              borderRadius: "16px",
            }
          : { scaleX: 1 }
      }
      transition={{ duration: 0.2, ease: "easeIn" }}
      className=" fixed top-4 inset-x-[2vw] sm:inset-x-[10vw] h-15 flex items-center  justify-between px-8   bg-background backdrop-blur-lg  "
    >
      <Link href={"/"}>
        <img
          src="/logo/bg-less.png"
          alt="PIXEL PERFECT"
          className="w-8 dark:hidden block "
        />
        <img
          src="/logo/final-dark.png"
          alt="PIXEL PERFECT"
          className="w-8 hidden dark:block "
        />
      </Link>

      <div className=" flex  gap-8 ">
        {navItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <motion.div
              whileHover={{
                "--w": "100%",
              }}
              transition={{ duration: 0.2 }}
              style={{
                width: "var(--w, 0%)",
              }}
              className="  text-xs font-medium border-b-2 "
            >
              {item.name}
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};
