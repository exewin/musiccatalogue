import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { Button } from "antd"

const Container = styled.div`
    text-align: center;
`

const Error = styled.p`
    color: white;
    font-size: xx-large;
    font-style: italic;
    padding-top: 25px;
`

const PageNotFound = () => {
    return(
        <Container>
            <Error>404 page not found</Error>
            <br/>
            <Link to="/"><Button>Home</Button></Link>
        </Container>
        )
}

export {PageNotFound}