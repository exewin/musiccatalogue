import React, {useContext, useEffect, useState} from "react"
import styled from "styled-components"
import {Context} from "../../Context"
import {databaseGetSongList, databaseRemoveSong} from "../../database"
import { Table, Switch, Radio, Form, Space, Input, Popconfirm, message } from 'antd';
import { useNavigate } from "react-router"

const Container = styled.div`
    background-color: aliceblue;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
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

    const handleCopyButton = url => {
        const link = `https://www.youtube.com/watch?v=${url}`
        navigator.clipboard.writeText(link)
        message.success(`link copied`, 0.5)
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
    },
    {
        title: 'Action',
        key: 'action',
        align: "right",
        render: (song) => (
            <Space>
            {song.url && <a onClick={()=>handlePlayButton(song)}>🎵</a>}
            {song.url && <a onClick={()=>handleCopyButton(song.url)}>📋</a>}
            <a onClick={()=>handleEditButton(song.id)}>🔧</a>
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
                      onDoubleClick: () => {song.url && handlePlayButton(song)}, // double click row
                    };
                }}
            />
            
        </Container>
        )
}

export {Songs}