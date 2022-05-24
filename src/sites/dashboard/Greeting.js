import React from "react"
import styled from "styled-components"

const Container = styled.div`
background-color:white;
max-width: 800px;
margin: 0 auto;
padding:5px;
border: 1px solid;
`

export const Greeting = () => {
    return(
        <Container>
            <p>
                Welcome to MCAT - Music Catalogue by exewin, an application which main goal is to store data
                about your favourite songs and display it with detailed information in a table. Additional
                functionalities, MCAT provides are:
            </p>
            <ul className="greetingList">
                <li>Sort table by artist, title, year or rating</li>
                <li>Filter table by genre or style</li>
                <li>Find song by title or artist</li>
                <li>Quick add song by Discogs ID</li>
                <li>Mini video player</li>
            </ul>
        </Container>
    )
}