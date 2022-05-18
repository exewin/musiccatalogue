import React, {useState, useContext} from "react"
import styled from "styled-components"
import {databaseClear, databaseCreateUser, databaseLogin, databaseSaveToFile, databaseLoadFromFile} from "../database"
import {Context} from "../Context"
import {useNavigate} from "react-router-dom";
import {Button, Popconfirm, Input, Form} from "antd";
import { UploadOutlined } from '@ant-design/icons';

const Container = styled.div`
margin: 0;
padding: 15px;
background-color: plum;
border-radius: 5px;
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

    const showFile = (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target.result
            databaseLoadFromFile(text)
        }
    }

    return(
        <Container>
            <Form
                layout="inline"
            >
                <Form.Item>
                    <Input
                        value={login}
                        type="text" 
                        placeholder="username"
                        onChange={e=>setLogin(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Input
                        value={password}
                        type="password" 
                        placeholder="password"
                        onChange={e=>setPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item><Button onClick={logUser} type="primary">Login</Button></Form.Item>
                <Form.Item><Button onClick={createUser}>Create Account</Button></Form.Item>
            </Form>
            <br/>
            <Form
                layout="inline"
            >
                <Form.Item>
                    <Popconfirm
                        title="Warning this will erase all information! Continue?"
                        onConfirm={databaseClear}
                        okText="Yes"
                        cancelText="No"
                    ><Button type="danger">Clear Current Database</Button>
                    </Popconfirm>
                </Form.Item>
                <Form.Item><Button onClick={databaseSaveToFile}>Save Database To File</Button></Form.Item>

                <Form.Item tooltip="Warning, this will override current database." label="Load Database from JSON file">
                    <Button style={{padding:'0'}}>
                        <label style={{cursor:'pointer', padding: "15px", width:'100%'}} htmlFor="fileUpload">Upload <UploadOutlined/></label>
                    </Button>
                </Form.Item>
                <Form.Item hidden={true}>
                    <input type="file" id="fileUpload" accept=".json" onChange={showFile}/>
                </Form.Item>
            </Form>
        </Container>
    )
}

export {Login}

