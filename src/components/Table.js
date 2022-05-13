import React from "react"
import styled from "styled-components"

const List = styled.table`
width:100%;
border:1px solid;
background-color: bisque;
border-radius: 2px;
`

const Th = styled.th`
cursor: pointer;
&:hover{
    background-color: sandybrown;
}`

const Table = ({headers, sort, mark, children}) => {
    return(
        <List>
            <thead><tr style={{width:`100%`, border:`1px solid`}}>
                {headers.map((header,id) => (
                    <Th key={id} onClick={()=>sort(header)}>
                        {header}
                        {mark == header && '🔻'}
                    </Th>
                ))}
            </tr></thead>
            <tbody>
                {children}
            </tbody>
        </List>
    )
}

export {Table}