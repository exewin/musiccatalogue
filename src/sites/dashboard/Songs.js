import React, { useContext, useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { Context } from "../../Context"
import { useNavigate } from "react-router"
import { databaseGetListInfo, databaseRemoveSong } from "../../database"
import { Table, Space, Popconfirm, Tag, Switch, Form, Input, Empty, Button } from 'antd'
import { SearchOutlined } from "@ant-design/icons"
import youtubeIcon from "../../images/youtubeIcon.png"
import discogsIcon from "../../images/discogsIcon.png"
import chroma from 'chroma-js'
import { getColor } from "../../utils/getColorBasedOnString"

const ratingScale = chroma.scale(['red', 'orange', 'gold',"green", 'teal', 'purple']).domain([1,40,64,80,90,100,100])
const yearScale = chroma.scale(['steelblue', 'lightseagreen', 'seagreen', 'olive', 'darkgoldenrod', 'salmon']).domain([1960,2025])

const Container = styled.div`
    border: 1px solid gray;
    padding: 5px;
    background-color: white;
`

const Img = styled.img`
    width:16px;
`

const Number = styled.span`
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    padding: 5px;
    border-radius: 5px;
    color:white;
    //background-color is controlled with inline style
`

const Songs = () => {

    const myRef = useRef(null)
    const {Search} = Input
    const [songs, setSongs] = useState([])
    const [genres, setGenres] = useState([])
    const [styles, setStyles] = useState([])
    const [toggleRating, setToggleRating] = useState(true)
    const {user, setCurSong} = useContext(Context)
    const navigate = useNavigate()
    const updateSongList = () =>{
        const [dbsongs, dbgenres, dbstyles] = databaseGetListInfo(user.userData.login)
        setSongs(dbsongs)
        setStyles(dbstyles)
        setGenres(dbgenres)
    }

    useEffect(()=>{
        updateSongList()
    },[])

    const mappedGenreFilters = genres.map(g => ({
        text: g,
        value: g,
        color: getColor(g)
    }))

    const mappedStyleFilters = styles.map(s => ({
        text: s,
        value: s,
        color: getColor(s)
    }))

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

    let locale = {
        emptyText: <Empty  description="This list is empty..." />
    }

    let columns = [
    {
        title: 'Artist',
        dataIndex: 'artist',
        showSorterTooltip: false,
        sorter: (a, b) => a.artist > b.artist ? 1 : -1,
        onFilterDropdownVisibleChange: (mode) => mode && myRef.current.focus(),
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
            return( 
                <><Search
                    ref={myRef}
                    autoFocus
                    value={selectedKeys[0]}
                    onChange={(e)=>{
                        setSelectedKeys(e.target.value?[e.target.value]:[])
                    }}
                    onSearch={()=>{
                        confirm()
                    }}
                />
                <Button size="small" onClick={()=>{
                    clearFilters()
                    confirm()
                }}>Clear</Button></>
            )
        },
        filterIcon: () => <SearchOutlined/>,
        onFilter: (value, record) => record.artist.toLowerCase().includes(value.toLowerCase()),
        
    },
    {
        title: 'Title',
        dataIndex: 'title',
        showSorterTooltip: false,
        sorter: (a, b) => a.title > b.title ? 1 : -1,
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
            return( 
                <><Search
                    autoFocus
                    value={selectedKeys[0]}
                    onChange={(e)=>{
                        setSelectedKeys(e.target.value?[e.target.value]:[])
                    }}
                    onSearch={()=>{
                        confirm()
                    }}
                />
                <Button size="small" onClick={()=>{
                    clearFilters()
                    confirm()
                }}>Clear</Button></>
            )
        },
        filterIcon: () => <SearchOutlined/>,
        onFilter: (value, record) => record.title.toLowerCase().includes(value.toLowerCase()),
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
        filterSearch: true,
        filterMultiple: false,
        filters: mappedGenreFilters,
        onFilter: (value, record) => {
            return record.genres ? record.genres.indexOf(value) >= 0 : 0
        },
        render: tags => (
            <span>
                {tags && tags.map(tag => <Tag key={tag} color={
                    mappedGenreFilters.find(a=>a.text === tag) ? mappedGenreFilters.find(a=>a.text === tag).color : ""
                }> {tag} </Tag> )} 
            </span>
        ),
    },
    {
        title: 'Styles',
        dataIndex: 'styles',
        filterSearch: true,
        filterMultiple: false,
        filters: mappedStyleFilters,
        onFilter: (value, record) => {
            return record.styles ? record.styles.indexOf(value) >= 0 : 0
        },
        render: tags => (
            <span>
                {tags && tags.map(tag => <Tag key={tag} color={
                    mappedStyleFilters.find(a=>a.text === tag) ? mappedStyleFilters.find(a=>a.text === tag).color : ""
                }> {tag} </Tag> )} 
            </span>
        ),
    },
    {
        title: 'Rating',
        dataIndex: 'rating',
        width: 25,
        align: 'center',
        hidden: toggleRating,
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
    ].filter(col => !col.hidden)
    
    return(
        <Container>
            <Form layout="inline" style={{ marginBottom: 2 }}>
                <Form.Item label="Hide ratings">
                    <Switch checked={toggleRating} onChange={()=>setToggleRating(!toggleRating)}/>
                </Form.Item>
            </Form>
                <Table
                    rowKey={record => record.id}
                    size="small"
                    pagination={{pageSize:100, hideOnSinglePage:true}}
                    columns={columns}
                    dataSource={songs}
                    locale={locale}
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