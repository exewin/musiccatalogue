import React, {useState, useContext} from "react"
import styled from "styled-components"
import {databaseClear, databaseCreateUser, databaseLogin} from "../database"
import {Context} from "../Context"
import {useNavigate} from "react-router-dom";
import {Button, Popconfirm, Input} from "antd";

const Form = styled.div`
margin: 0;
padding: 15px;
`

const Login = () => {
    const navigate = useNavigate()
    const {user} = useContext(Context)
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    const logUser = () => {
        if(databaseLogin(login, password)){
            user.set(login, true)
            navigate("/dashboard")
        }
    }
    const createUser = () => {
        databaseCreateUser(login, password)
    }

    return(
        <Form>
                <Input style={{ width: '20%' }}
                    value={login}
                    type="text" 
                    placeholder="username" 
                    onChange={e=>setLogin(e.target.value)}
                />
                <br/>

                <Input style={{ width: '20%' }}
                    value={password}
                    type="password" 
                    placeholder="password"
                    onChange={e=>setPassword(e.target.value)}
                />
                <br/>

                <Button onClick={logUser}>Login</Button>
                <Button onClick={createUser}>Create Account</Button>
                <Popconfirm
                    title="Warning this erase all information! Continue?"
                    onConfirm={databaseClear}
                    okText="Yes"
                    cancelText="No"
                ><Button type="danger">Clear Database</Button>
                </Popconfirm>
        </Form>
    )
}

export {Login}