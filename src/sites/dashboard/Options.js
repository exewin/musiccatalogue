import React, {useContext} from "react"
import styled from "styled-components"
import { Context } from "../../Context"
import {Button, Popconfirm, message} from "antd"
import {databaseDeleteUser} from "../../database"

const Container = styled.div`

`

export const Options = () => {

    const {user} = useContext(Context)

    const deleteButton = () => {
        databaseDeleteUser(user.userData.login)
        message.info(`User ${user.userData.login} deleted`)
        user.set("", false)
    }

    return(
        <Container>
            <Popconfirm
                title="Are you sure?"
                onConfirm={deleteButton}
                okText="Yes"
                cancelText="No"
            >
                <Button type="danger">Delete account</Button>
            </Popconfirm>
            <Button title="Clears filters created by songs, which have been deleted">Clear unused filters</Button>
        </Container>
    )
}