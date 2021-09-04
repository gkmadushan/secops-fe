import React from "react";
import Layout from "../layout/unauthenticated";
import styles from "../styles/login.module.scss";
import Link from 'next/link'

export default function Login() {
    return (
        <div className={[styles.form, "col-md-6"].join(" ")}>
            <pre><h1>Login</h1></pre>
            <form>
                <small id="emailHelp" className="form-text text-muted">Enter your login details below</small>
                <pre>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                    <br />
                    <input type="password" className="form-control" id="password" placeholder="Password" />
                    <br />
                    <input type="password" className="form-control" id="password" placeholder="Ontime Password (OTP)" />
                </pre>

                {/* <small id="emailHelp" className="form-text text-muted">Hit Enter >> </small> */}
                <Link href="/" passRef>
                    <button type="submit" className="btn btn-primary">Login</button>
                </Link>
            </form>
        </div>
    )
}

Login.getLayout = function getLayout(page) {
    return (
        <>
            <Layout>
                {page}
            </Layout>
        </>
    )
}
