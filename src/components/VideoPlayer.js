import React, {useState, useContext} from "react";
import styled from "styled-components"
import {Context} from "../Context"

const Iframe = styled.iframe`
position: relative;
`
const Button = styled.button`
position: absolute;
cursor: pointer;
border: none;
background: none;
right: 0;
`
const Container = styled.div`
position: absolute;
right: 0;
bottom: 0;`

const VideoPlayer = () => {
    const {curSong, setCurSong} = useContext(Context)
    return(
        curSong &&
        <Container>
            <Button title="turn off and hide player" onClick={()=>setCurSong(null)}>❌</Button>
            <br/>
            <Iframe
                type="text/html" width="400" height="200"
                src={`https://www.youtube.com/embed/${curSong.url}?autoplay=1&controls=0"`}
            />
        </Container>
    )
}

export {VideoPlayer}