import React, {useContext, useEffect, useState} from "react"
import styled from "styled-components"
import {Context} from "../../Context"
import {databaseGetSongList, databaseRemoveSong} from "../../database"
import { Table, Space, Popconfirm, Tag } from 'antd'
import { useNavigate } from "react-router"
import youtubeIcon from "../../images/youtubeIcon.png"
import discogsIcon from "../../images/discogsIcon.png"
import {filterStylesData} from "../../utils/filterStylesData"
import chroma from 'chroma-js';

const ratingScale = chroma.scale(['red', 'orange', 'green', "green", 'teal', 'purple']).domain([1,50,80,90,95,100,100])
const yearScale = chroma.scale(['steelblue', 'lightseagreen', 'seagreen', 'olive', 'darkgoldenrod', 'salmon']).domain([1960,2025])

const Container = styled.div`
    border: 1px solid gray;
`

const Img = styled.img`
    width:16px;
`

const Number = styled.span`
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    padding: 5px;
    border-radius: 5px;
    color:white;
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
        showSorterTooltip: false,
        sorter: (a, b) => a.artist > b.artist ? 1 : -1
        
    },
    {
        title: 'Title',
        dataIndex: 'title',
        showSorterTooltip: false,
        sorter: (a, b) => a.title > b.title ? 1 : -1
    },
    {
        title: 'Year',
        dataIndex: 'year',
        showSorterTooltip: false,
        sorter: (a, b) => a.year - b.year,
        render: (td) => <Number style={{backgroundColor:yearScale(td)}}>{td}</Number> ,
    },
    {
        title: 'Genres',
        dataIndex: 'genres',
    },
    {
        title: 'Styles',
        dataIndex: 'styles',
        filterSearch: true,
        filterMultiple: false,
        filters: filterStylesData,
        onFilter: (value, record) => {
            return record.styles ? record.styles.indexOf(value) >= 0 : 0
        },
        render: tags => (
            <span>
                {tags && tags.map(tag => <Tag color={
                    filterStylesData.find(a=>a.text === tag) ? filterStylesData.find(a=>a.text === tag).color : ""
                } key={tag}> {tag} </Tag> )} 
            </span>
        ),
    },
    {
        title: 'Rating',
        dataIndex: 'rating',
        width: 25,
        align: 'center',
        showSorterTooltip: false,
        sorter: (a, b) => a.rating - b.rating,
        render: (td) => <Number style={{backgroundColor:ratingScale(td)}}>{td}</Number> ,
    },
    {
        title: 'Action',
        key: 'action',
        align: "right",
        render: (song) => (
            <Space>
            {song.url && <a onClick={()=>handlePlayButton(song)} title="Play song">🎵</a>}
            {song.url && <a href={`https://www.youtube.com/watch?v=${song.url}`} target="_blank" title="Open on YouTube"><Img src={youtubeIcon}/></a>}
            {song.discogsUrl && <a href={`https://www.discogs.com/release/${song.discogsUrl}`} target="_blank" title="Open on Discogs"><Img src={discogsIcon}/></a>}
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