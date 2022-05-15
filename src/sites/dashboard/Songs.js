import React, {useContext, useEffect, useState} from "react"
import styled from "styled-components"
import {Context} from "../../Context"
import {databaseGetSongList, databaseRemoveSong} from "../../database"
import { Table, Space, Popconfirm, message } from 'antd'
import { useNavigate } from "react-router"
import './customStyles/column.css'
import youtubeIcon from "../../images/youtubeIcon.png"

const Container = styled.div`
    border: 1px solid gray;
`

const Img = styled.img`
    width:16px;
`

const Songs = () => {

    const [songs, setSongs] = useState([])
    const {user, setCurSong} = useContext(Context)
    const navigate = useNavigate()
    const updateSongList = () => setSongs(databaseGetSongList(user.userData.login))

    useEffect(()=>{
        updateSongList()
    },[])

    const handleRemoveButton = id => {
        databaseRemoveSong(user.userData.login, id)
        updateSongList()
    }

    const handleEditButton = id => {
        navigate(`/dashboard/edit?id=${id}`)
    }

    const handlePlayButton = song => {
        setCurSong(song)
    }

    const columns = [
    {
        title: 'Artist',
        dataIndex: 'artist',
        sorter: (a, b) => a.artist > b.artist ? 1 : -1
        
    },
    {
        title: 'Title',
        dataIndex: 'title',
        sorter: (a, b) => a.title > a.title ? 1 : -1
    },
    {
        title: 'Year',
        dataIndex: 'year',
        sorter: (a, b) => a.year - b.year,
        className: 'year',
    },
    {
        title: 'Action',
        key: 'action',
        align: "right",
        render: (song) => (
            <Space>
            {song.url && <a onClick={()=>handlePlayButton(song)} title="Play song">🎵</a>}
            {song.url && <a href={`https://www.youtube.com/watch?v=${song.url}`} target="_blank" title="Open on YouTube"><Img src={youtubeIcon}/></a>}
            <a onClick={()=>handleEditButton(song.id)} title="Edit song details">🔧</a>
            <Popconfirm
                title="Remove this song?"
                onConfirm={()=>handleRemoveButton(song.id)}
                okText="Yes"
                cancelText="No"
            ><a title="Delete song">❌</a>
            </Popconfirm>
            </Space>
        ),
      },
    ];

    
    return(
        <Container>
            <Table
                rowKey={record => record.id}
                size="small"
                pagination={{pageSize:100, hideOnSinglePage:true}}
                columns={columns}
                dataSource={songs}
                onRow={(song) => {
                    return {
                      onDoubleClick: () => {song.url && handlePlayButton(song)}
                    }
                }}
            />
            
        </Container>
        )
}

export {Songs}