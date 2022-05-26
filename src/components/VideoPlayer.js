import React, {useState, useContext} from "react";
import styled from "styled-components"
import {Context} from "../Context"

const Iframe = styled.iframe`
    position: relative;
    display:${props=>props.display};
`
const Button = styled.button`
    cursor: pointer;
    padding: 0px;
    border: none;
`
const Container = styled.div`
    position: fixed;
    right: 0;
    bottom: 0;
    text-align: right;
    border: 1px solid gray;
`

const TitleBar = styled.div`
    display: grid;
    grid-template-columns: 345px 25px 25px;
    grid-template-rows: 26px;
    padding-left: 5px;
    background-color: white;
    width: 400px;
    height: 26px;
    overflow: hidden;
`

const Title = styled.span`
    text-align: left;
`

export const VideoPlayer = () => {
    const {curSong, setCurSong} = useContext(Context)
    const [minimalized, setMinimalized] = useState(false)
    return(
        curSong &&
        <Container>
            <TitleBar>
                
                <Title>{`${curSong.artist} - ${curSong.title}`}</Title>
                <Button title="minimalize player" onClick={()=>setMinimalized(!minimalized)}>➖</Button>
                <Button title="turn off and hide player" onClick={()=>setCurSong(null)}>❌</Button>
            </TitleBar>
            <Iframe
                display={minimalized?"none":"block"}
                type="text/html" width="400" height="200"
                src={`https://www.youtube.com/embed/${curSong.url}?autoplay=1&controls=0"`}
                autoplay="1"
            />
        </Container>
    )
}