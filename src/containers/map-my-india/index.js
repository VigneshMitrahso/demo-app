import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import { useDispatch } from "react-redux";
import { mapMyIndiaToken } from "../../action/serveyReport";
import { _getStorageValue } from "../../comman/localStorage";
import { USER_ID } from "../../comman/constants";

const MapMyIndia = (props) => {
    const [token, setToken] = useState("");
    const dispatch = useDispatch();
    const success = (data) => {
        setToken(data.access_token);
    }

    const failiure = () => {

    }

    useEffect(() => {
        _getStorageValue(USER_ID).then((id) => {
            dispatch(mapMyIndiaToken(id, success, failiure))
        });
    }, [])

    return (
        <div className="geo-tracking-container">
            <Header isAdmin={true} link="/landingPage" />
            <div className="agent-travel-data" >
                <iframe
                    src={`https://insight.mappls.com/insight-public/app/dashboard/8d65b6aa3064eda2177bcc418725307a?access_token=${token}`}
                    width="100%"
                    height="100%"
                    style={{ border: "1px solid black" }}
                    title="Example Website"
             
                />
            </div>
        </div>
    );
};

export default MapMyIndia;
