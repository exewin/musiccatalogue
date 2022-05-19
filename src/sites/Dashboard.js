import React, {useEffect, useContext} from "react"
import styled from "styled-components"
import {Context} from "../Context"
import {useNavigate} from "react-router-dom";
import {Link, Outlet} from "react-router-dom";
import {Button} from "antd"


const ProfileBox = styled.div`
background-color: #afb2ca;
border-radius: 0px 0px 2px 2px;
padding: 7px;
`

const Username = styled.span`
color:#ff4706;
font-size: large;
font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
font-weight: 500;
text-shadow: 1px 1px rgba(0,0,0,0.7);
`

const Dashboard = () => {
    const navigate = useNavigate()
    const {user} = useContext(Context)

    useEffect(()=>{
        if(user.userData.token===false)
        {
            navigate("/")
        }
    },[user])

    const logout = () => {
        user.set("", false)
    }

    return(
        <ProfileBox>
            <p title={`Hello sir ${user.userData.login}`}>User: <Username>{user.userData.login}</Username> </p>
            <Link to="/dashboard/songs"><Button title="Display full list of songs">List 📜</Button></Link>
            <Link to="/dashboard/edit"><Button title="Add song to list">Add ✏️</Button></Link>
            <Link to="/dashboard/options"><Button title="Additional functionalities">Options 🔨</Button></Link>
            <Button title="Logout and return to login screen" onClick={logout}>Logout</Button>
            <hr/>
            <Outlet/>
        </ProfileBox>
        
        )
}

export {Dashboard}