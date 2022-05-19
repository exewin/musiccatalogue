import React from "react"
import styled from "styled-components"
import logoMcat from "../images/logomcat.png"

const Container = styled.div`
position: relative;
`

const Logo = styled.img`
width: 32px;
`

const LogoContainer = styled.span`
padding: 5px;
display:flex;
align-items: center;
gap:7px;
position: absolute;
font-size: 16px;
right: 0px;
margin: 0;
text-align: right;
color: #ff4706;
text-shadow: 1px 1px rgba(0,0,0,0.5);
font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
user-select: none;
`

const Header = () => {
    return(
        <Container>
            <LogoContainer title="Music Catalogue by exewin">
                MCAT <Logo src = {logoMcat}/>
            </LogoContainer>
        </Container>
    )
}

export {Header}

