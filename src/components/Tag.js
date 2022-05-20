import React from "react"
import styled, { keyframes, css } from "styled-components"

const ColorfulBox = styled.div`
    cursor: pointer;
    user-select: none;
    border: 1px solid;
    margin: 0px 3px;
    padding: 2px 3px;
    border-radius: 3px;
    min-height: 10px;
    max-inline-size: 150px;
    overflow-wrap: break-word;
    display:inline-block;
    overflow: hidden;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-size: smaller;
    background-color: ${props=>props.bgColor};
    color: ${props=>props.textColor};
    text-decoration: ${props=>props.selected && "underline"};
    transition: 0.2s all;
    &:hover{
        background-color: white;
    }
`

export const Tag = ({children, handleClick, color, selected}) => {
    return(
        <ColorfulBox selected={selected} onClick={handleClick} bgColor={color.primary} textColor={color.secondary}>{children}</ColorfulBox>
    )
}