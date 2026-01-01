
"use client"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

import {
  FileText,
  Github,
  Instagram,
  LinkedinIcon,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

const Footer = () => {

  const icons = [
    {
      icon: Instagram,
      link: "https://www.instagram.com/epitome0.0/",
    }
  ]

  const firstLI = [
    {
      li: '01 Components',
      href: '/docs/components-overview'
    },
    {
      li: '02 Templates',
      href: '/templates'
    },
  ]

  const secondLI = [
    {
      li: '03 Playground',
      href: '/playground'
    },
    {
      li: '04 Pricing',
      href: "/pricing"
    },

  ]
  return (



    <div className=" md:flex justify-center  ">
      <section className="min-h-svh md:min-h-0 md:w-7xl mx-4 grid grid-cols-1 md:grid-cols-[1fr_2fr] grid-rows-[1fr_1fr_1fr_1fr] h-80">


        <div className=" md:border-b md:border-r md:border-foreground/10  py-4 ">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl font-light text-balance">
            A carefully crafted React component library for building modern, responsive web applications.
            <br /> Every component is designed with attention to detail.
          </p>

          {/* {
            icons.map((el , id)=>{
              return <div className="" key={id} >
               <span>{el.icon}</span>
              </div>
            })
          } */}


        </div>

        <div className=" p-4 md:border-b md:border-foreground/10 ">

          <div className="grid grid-cols-[2fr_2fr_1fr] md:grid-cols-[1fr_1fr_2fr] w-fit  gap-4 font-medium text-foreground/70 ">

            <ul>

              {
                firstLI.map((el, id) => {
                  return <Link key={id} href={el.href}>
                    <li className="hover:text-foreground"> {el.li}</li>
                  </Link>
                })
              }
            </ul>
            <ul>
              {
                secondLI.map((el, id) => {
                  return <Link key={id} href={el.href}>
                    <li className="hover:text-foreground">{el.li}</li>
                  </Link>
                })
              }

            </ul>

            <div className="py-2 flex gap-4 ">
              <Link href='https://github.com/Ashutoshx7/VengeanceUI'>
                < Github className="hover:text-foreground" />
              </Link>

            </div>
          </div>
        </div>

        <div className="perspective-distant transform-3d md:border-r md:border-foreground/10  flex items-center justify-center ">
          <motion.img

            src="/logo/bg-less.png"
            alt="Logo"
            className="  size-30 md:size-60 w-auto dark:invert rotate-180"
            draggable={false}

            whileHover={{
              scale: 1.1
            }}

            transition={{
              duration: 0.3
            }}

          />

        </div>

        <div className="flex text-[3rem] md:text-[6rem] items-center md:justify-center bg-[ #e91e63] overflow-hidden md:relative">
          <h1 className="vengeanceUI-text">
            VengeanceUI
          </h1>
        </div>
      </section>
    </div>

  );
};

export default Footer;

