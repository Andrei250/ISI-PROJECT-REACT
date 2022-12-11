import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../firebase";
import './Auth.scss'

const Auth = (props) => {
    let [authMode, setAuthMode] = useState("signin")
    let [registerEmail, setRegisterEmail] = useState('');
    let [registerPassword, setRegisterPassword] = useState('');
    let [loginEmail, setLoginEmail] = useState('');
    let [loginPassword, setLoginPassword] = useState('');
    let [errorMessageRegister, setErrorMessageRegister] = useState('');
    let [errorMessageLogin, setErrorMessageLogin] = useState('');
    const navigate = useNavigate();

    const changeAuthMode = () => {
        setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    const signUp = async (e) => {
        e.preventDefault();

        setErrorMessageRegister('');

        firebaseAuth.createUserWithEmailAndPassword(registerEmail, registerPassword).then(async (response) => {
            sessionStorage.setItem('Auth Token', response.user!.refreshToken);
            navigate('/app', { replace: true });

        }).catch((error) => {
            setErrorMessageRegister(error.message);
        })
    }

    const signIn = async (e) => {
        e.preventDefault();

        setErrorMessageLogin('');

        firebaseAuth.signInWithEmailAndPassword(loginEmail, loginPassword).then(async (response) => {
            console.log(response);
            sessionStorage.setItem('Auth Token', response.user!.refreshToken);
            navigate('/app', { replace: true });
        }).catch((error) => {
            setErrorMessageLogin(error.message);
        })
    }

    if (authMode === "signin") {
        return (
            <div className="Auth-form-container">
                <form className="Auth-form">
                    {
                        errorMessageLogin.length > 0 &&
                        <div className={'alert alert-danger my-3'} role="alert">
                            {errorMessageLogin}
                        </div>
                    }
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Sign In</h3>
                        <div className="text-center">
                            Not registered yet?{" "}
                            <span className="link-primary" onClick={changeAuthMode}>
                                Sign Up
                            </span>
                        </div>
                        <div className="form-group mt-3">
                            <label>Email address</label>
                            <input
                                type="email"
                                className="form-control mt-1"
                                placeholder="Enter email"
                                onChange={(e) => { setLoginEmail(e.target.value) }}

                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Enter password"
                                onChange={(e) => { setLoginPassword(e.target.value) }}

                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary" onClick={signIn}>
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign Up</h3>
                    <div className="text-center">
                        Already registered?{" "}
                        <span className="link-primary" onClick={changeAuthMode}>
                            Sign In
                        </span>
                    </div>

                    {
                        errorMessageRegister.length > 0 &&
                        <div className={'alert alert-danger my-3'} role="alert">
                            {errorMessageRegister}
                        </div>
                    }

                    <div className="form-group mt-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            className="form-control mt-1"
                            placeholder="Email Address"
                            onChange={(e) => { setRegisterEmail(e.target.value) }}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Password"
                            onChange={(e) => { setRegisterPassword(e.target.value) }}
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" onClick={signUp}>
                            Register
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Auth;