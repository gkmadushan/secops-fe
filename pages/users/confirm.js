import React, { useState } from 'react'
import Layout from "../../layout/unauthenticated";
import styles from "../../styles/confirm.module.scss";
import Image from 'next/image';
import { useQuery } from 'react-query';
import Axios from '../../hooks/useApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InputV1 from '../../components/input/InputV1';
import { toast } from 'react-toastify';

async function getQR() {
    let user_id = new URL(window.location.href).searchParams.get('user')
    let token = new URL(window.location.href).searchParams.get('token')
    const { data } = await Axios.get('/users/' + user_id + '/verify/' + token);
    return data;
}

async function updatePassword(password, otp) {
    let user_id = new URL(window.location.href).searchParams.get('user')
    let token = new URL(window.location.href).searchParams.get('token')
    let request = { "password": password, "otp": otp }
    const { data } = await Axios.patch('/users/' + user_id + '/verify/' + token, request);
    return data;
}

export default function Confirm() {
    const base64qr = 'data:image/png;base64, ';
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOTP] = useState("")

    const { data: qrResponse, isFetching, error, status } = useQuery(
        ['qr'],
        () => getQR(),
        { refetchOnMount: true }
    )

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        toast.promise(updatePassword(password, otp), {
            pending: 'Processing',
            success: { render() { setTimeout(() => { window.location.href = '/login' }, 1000); return `Password updated, Redirecting to Login` } },
            error: { render() { return `Failed to save password, Invalid OTP` } },
        });
    }


    if (error) {
        return <><h1 className="mt-m">Invalid or Expired Password Reset URL </h1></>
    }

    return (
        <div className={[styles.form].join(" ")}>
            <h1 align="center"> Scan below QR</h1 >
            <h4 align="left">Recomended to use below tested TOTP Apps<br /> and must be run on a different device</h4>
            <p align="left">
                <pre>Tested authenticators
                    <ul>
                        <li><a href="http://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2">Google Authenticator</a></li>
                        <li><a href="http://play.google.com/store/apps/details?id=com.azure.authenticator">Microsoft Authenticator</a></li>
                    </ul>
                </pre>
            </p>

            {isFetching ? (
                <div className="text-center"><FontAwesomeIcon icon={['fas', 'circle-notch']} spin size="5x" /></div>
            ) : (
                <Image src={base64qr + qrResponse} className={styles.qr} width="200px" height="200px" alt="SecOps Robot - Logo" />
            )}
            <br /><br />
            <form onSubmit={(e) => { handleUpdatePassword(e) }} action="#">
                <InputV1 type="password" label="Password" value={password} setValue={setPassword} required validationError="Entered Password dosen't meet the requirements" pattern=".{8,}" title="Minimum 8 Characters " />
                <InputV1 type="password" label="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} required pattern={password} validationError="Password and Confirm Password dosen't match" />
                <InputV1 type="number" label="OTP" value={otp} setValue={setOTP} required pattern="[0-9]{6}" validationError="Invalid OTP format" />
                <input className="btn btn-primary mt-2" type="submit" value="Save Password" />
            </form>
        </div >
    )
}

Confirm.getLayout = function getLayout(page) {
    return (
        <>
            <Layout>
                {page}
            </Layout>
        </>
    )
}


