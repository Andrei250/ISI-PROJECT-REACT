import React, { useEffect } from "react";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../firebase";
import { sleep } from "../../utils/Utils";
import './LoadingScreen.scss'

const Loading = () => {
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    });

    const checkAuth = async () => {
        await sleep(1000);

        let user: firebase.User | null = firebaseAuth.currentUser;

        if (user === null)
            navigate('/auth', { replace: true });
        else
            navigate('/app', { replace: true });
    }

    return (
        <div className={'loading'}>
            <ReactLoading type="bubbles" color="#0000FF"
                height={100} width={75} />
        </div>
    );
}

export default Loading;