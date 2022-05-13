import React from "react"
import styled from "styled-components"

const Container = styled.div`
background-color: steelblue;
position: relative;
`

const Logo = styled.h1`
position: absolute;
right: 5px;
margin: 0;
text-align: right;
color: limegreen;
text-shadow: 1px 1px green;
font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
font-style: italic;
`

const Header = () => {
    return(
        <Container>
            <Logo title="Music Catalogue by exewin">MCAT🎧</Logo>
        </Container>
    )
}

export {Header}