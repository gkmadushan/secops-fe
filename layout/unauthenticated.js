import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../assets/images/logo.png";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

function unauthenticated({ children }) {
  return (
    <>
      <Head>
        <title>SecOps - Automated Vulnerablity Management System</title>
      </Head>
      <ToastContainer autoClose={8000} />
      <div className="mt-4 text-center">
        <Link href="/">
          <a>
            <Image src={Logo} alt="SecOps Robot - Logo" />
          </a>
        </Link>
      </div>
      <div className="container">
        <div className={["d-flex", "justify-content-center"].join(" ")}>
          {children}
        </div>
      </div>
    </>
  );
}

export default unauthenticated;
