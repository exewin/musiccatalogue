import React from "react"
import styled from "styled-components"

const ColorfulBox = styled.span`
    cursor: pointer;
    user-select: none;
    border: 1px solid;
    margin: 3px;
    padding: 3px;
    border-radius: 3px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: smaller;
    background-color: ${props=>props.bgColor};
    color: ${props=>props.textColor};
    transition: 0.2s all;
    &:hover{
        background-color: white;
    }
`

export const Tag = ({children, handleClick, color}) => {
    return(
        <ColorfulBox onClick={handleClick} bgColor={color.primary} textColor={color.secondary}>{children}</ColorfulBox>
    )
}