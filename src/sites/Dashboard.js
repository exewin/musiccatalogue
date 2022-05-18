import React, {useEffect, useContext} from "react"
import styled from "styled-components"
import {Context} from "../Context"
import {useNavigate} from "react-router-dom";
import {Link, Outlet} from "react-router-dom";
import {Button} from "antd"


const ProfileBox = styled.div`
background-color: #bfe2fa;
border-radius: 5px;
padding: 5px;
`

const Dashboard = () => {
    const navigate = useNavigate()
    const {user} = useContext(Context)

    useEffect(()=>{
        if(user.userData.token===false)
        {
            navigate("/")
        }
    },[navigate])

    const logout = () => {
        navigate("/")
        user.set("", false)
    }

    return(
        <ProfileBox>
            <p title={`Hello sir ${user.userData.login}`}>User: {user.userData.login}</p>
            <Link to="/dashboard/songs"><Button title="Display full list of songs">List 📜</Button></Link>
            <Link to="/dashboard/edit"><Button title="Add song to list">Add ✏️</Button></Link>
            <Button title="Logout and return to login screen" onClick={logout}>Logout</Button>
            <hr/>
            <Outlet/>
        </ProfileBox>
        
        )
}

export {Dashboard}