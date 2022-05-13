import React, {useContext} from "react"
import styled from "styled-components"
import {databaseRemoveSong} from "../database"
import {Context} from "../Context"
import {message, Popconfirm} from "antd"
import { useNavigate } from "react-router"

const Tr = styled.tr`
    background-color: "#faf";
`

const ButtonTd = styled.td`
    border: none;
    background: none;
    text-align: right;
`

const SettingButton = styled.span`
    cursor: pointer;
    margin-left: 2px;
    &:hover{
        text-shadow: 1px 1px green;
    }
`


const Song = ({position, song, tick}) => {

    const {id, artist, title, url, year, genre, style} = song
    const navigate = useNavigate()
    const {user, setCurSong} = useContext(Context)

    const handleRemoveButton = () => {
         databaseRemoveSong(user.userData.login, id)
        tick(prev => !prev)
    }

    const handleEditButton = () => {
        navigate(`/dashboard/edit?id=${id}`)
    }

    const handlePlayButton = () => {
        setCurSong(song)
    }

    const handleCopyButton = () => {
        const link = `https://www.youtube.com/watch?v=${url}`
        navigator.clipboard.writeText(link)
        message.success(`link copied`, 0.5)
    }

    return(
        <Tr style={{backgroundColor:'beige'}}>
            <td>{position+1}</td>
            <td>{artist}</td>
            <td>{title}</td>
            <td>{year}</td>
            <td>{genre} - {style}</td>
            <ButtonTd>
                {url && <SettingButton title="Play song" onClick={handlePlayButton}>🎵</SettingButton>}
                {url && <SettingButton title="Copy link to clipboard" onClick={handleCopyButton}>📋</SettingButton>}
                <SettingButton title="Edit song" onClick={handleEditButton}>🔧</SettingButton>
                <Popconfirm
                    title="Remove this song?"
                    onConfirm={handleRemoveButton}
                    okText="Yes"
                    cancelText="No"
                ><SettingButton title="Delete song">❌</SettingButton>
                </Popconfirm>
            </ButtonTd>
        </Tr>
    )
}

export {Song}
