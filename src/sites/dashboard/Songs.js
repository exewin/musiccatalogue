import React, { useContext, useEffect, useState, useRef } from "react"
import styled, {keyframes} from "styled-components"
import { Context } from "../../Context"
import { useNavigate } from "react-router"
import { databaseGetListInfo, databaseRemoveSong, databaseSetOptions } from "../../database"
import { Table, Space, Popconfirm, Switch, Form, Input, Empty, Button} from 'antd'
import { Tag } from "../../components/Tag"
import { SearchOutlined } from "@ant-design/icons"
import youtubeIcon from "../../images/youtubeIcon.png"
import discogsIcon from "../../images/discogsIcon.png"
import chroma from 'chroma-js'
import { createDefaultOptions } from "../../utils/createDefaultOptions"
import { getColor } from "../../utils/getColorBasedOnString"

const ratingScale = chroma.scale(['red', 'orange', 'gold',"green", 'teal', 'purple']).domain([1,40,64,80,90,100,100])
const yearScale = chroma.scale(['steelblue', 'lightseagreen', 'seagreen', 'olive', 'darkgoldenrod', 'salmon']).domain([1960,2025])

const Container = styled.div`
    border: 1px solid gray;
    padding: 5px;
    background-color: white;
    margin-bottom: 25px;
`

const Img = styled.img`
    width:16px;
`

const Number = styled.span`
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    padding: 5px;
    border-radius: 5px;
    color:white;
    text-shadow: 1px 1px #666;
    box-shadow: 2px 2px #888;
    background-color: ${props => props.color || '#fff'};
    cursor: default;
`

const FilterDropdown = styled.div`
    text-align: center;
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 300px;
    row-gap: 3px;
    width: 120px;
    display: flex;
    flex-direction: column;
`

const anima = keyframes`
  0% {
    transform: scale(1.6 , 0.5);
  }
  30% {
    transform: scale(1.55 , 0.55);
  }
  70% {
    transform: scale(0.84 , 1.26);
  }
  100% {
    transform: scale(0.8 , 1.3);
  }
`

const Pulse = styled.div`
    animation: ${anima} 0.3s alternate infinite;
    text-align: center;
`

const Songs = () => {

    const artistRef = useRef(null)
    const titleRef = useRef(null)
    const {Search} = Input
    const [songs, setSongs] = useState([])
    const [genres, setGenres] = useState([])
    const [styles, setStyles] = useState([])
    const [tableInfo, setTableInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const {user, curSong, setCurSong} = useContext(Context)
    const navigate = useNavigate()
    const updateSongList = () => {
        const [dbsongs, dbgenres, dbstyles, dboptions] = databaseGetListInfo(user.userData.login)
        setSongs(dbsongs)
        setStyles(dbstyles)
        setGenres(dbgenres)
        setTableInfo(dboptions)
    }
    
    useEffect(()=>{
        updateSongList()
    },[])

    useEffect(()=>{
        if(tableInfo.hasOwnProperty("sortedInfo"))
            databaseSetOptions(user.userData.login, tableInfo)
    },[tableInfo])

    useEffect(() => {
        if(loading){
            const timer = setTimeout(() => {
                setLoading(false)
            }, 250)
            return () => clearTimeout(timer)
        }
    }, [loading])

    const sortedInfo = tableInfo.sortedInfo || {}
    const filteredInfo = tableInfo.filteredInfo || {}
    const hiddenInfo = tableInfo.hidden || {rating:false}

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

    const handleTable = info => {
        setTableInfo(info)
    }
    
    const handleTableChange = (pagination, filters, sorter) => {
        handleTable({
            ...tableInfo,
            filteredInfo: filters,
            sortedInfo: sorter,
        })
    }

    const clearFilters = () => {
        handleTable({
            ...tableInfo,
            filteredInfo: null,
        })
    }

    const clearAllOptions = () => {
        handleTable(createDefaultOptions())
    }

    const filterWithTag = (tag, column) => {
        handleTable({
            ...tableInfo,
            filteredInfo: {
                ...filteredInfo,
                [column]: [tag]
            }
        })
    }

    const toggleColumn = (column, toggle) => {
        handleTable({
            ...tableInfo,
            hidden: {
                ...tableInfo.hidden,
                [column] : toggle
            },
        })
    }

    const emptyTableScreen = {
        emptyText: <><br/><br/><br/><br/><br/><Empty  description="This list is empty..." /><br/><br/><br/></>
    }

    let index = 0;

    const columns = [
    {
        title:"#",
        render: () => <>{++index/2}</>
    },
    {
        title: 'Artist', dataIndex: 'artist', key: 'artist',
        showSorterTooltip: false,
        sortOrder: sortedInfo.columnKey === 'artist' ? sortedInfo.order : null,
        sorter: (a, b) => a.artist > b.artist ? 1 : -1,
        filteredValue: filteredInfo.artist || null,
        onFilterDropdownVisibleChange: (visible) => visible && setTimeout(() => artistRef.current.focus(), 25),
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
            return( 
                <><Search
                    ref={artistRef}
                    value={selectedKeys[0]}
                    onChange={(e)=>{
                        setSelectedKeys(e.target.value?[e.target.value]:[])
                        confirm({ closeDropdown: false })
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
        title: 'Title', dataIndex: 'title', key: 'title',
        showSorterTooltip: false,
        sortOrder: sortedInfo.columnKey === 'title' ? sortedInfo.order : null,
        sorter: (a, b) => a.title > b.title ? 1 : -1,
        filteredValue: filteredInfo.title || null,
        onFilterDropdownVisibleChange: (visible) => visible && setTimeout(() => titleRef.current.focus(), 25),
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => {
            return( 
                <><Search
                    ref={titleRef}
                    value={selectedKeys[0]}
                    onChange={(e)=>{
                        setSelectedKeys(e.target.value?[e.target.value]:[])
                        confirm({ closeDropdown: false })
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
        title: 'Year', dataIndex: 'year', key: 'year',
        sortOrder: sortedInfo.columnKey === 'year' ? sortedInfo.order : null,
        showSorterTooltip: false,
        sorter: (a, b) => a.year - b.year,
        render: (td) => <Number color={yearScale(td)}>{td}</Number> ,
    },
    {
        title: `Genres`, dataIndex: 'genres', key: 'genres',
        filterMultiple: false,
        filters: mappedGenreFilters,
        filteredValue: filteredInfo.genres || null,
        onFilter: (value, record) => {
            return record.genres ? record.genres.indexOf(value) >= 0 : 0
        },
        filterDropdown: ({confirm, clearFilters, filters}) => {
            return(
                <div style={{textAlign:"center"}}>
                    <FilterDropdown>
                        {filters.sort((a, b) => a.text > b.text ? 1 : -1).map((f, i)=><Tag 
                            key={i}
                            selected={filteredInfo.genres && filteredInfo.genres[0] === f.text ? true : false}
                            color={mappedGenreFilters.find(a=>a.text === f.text) ? mappedGenreFilters.find(a=>a.text === f.text).color : ""}
                            handleClick={() => {
                                filterWithTag(f.value, "genres") 
                                confirm()
                            }}
                        >{f.text}</Tag>)}
                    </FilterDropdown>
                    <Button style={{margin:"3px 0px"}} size="small" onClick={()=>{
                        clearFilters()
                        confirm()
                    }}
                    >Clear filter</Button>
                </div>
            )
        },
        render: (tags) => (
            <span>
                {
                    tags && tags.map((tag, i) => 
                    <Tag 
                        selected={filteredInfo.genres && filteredInfo.genres[0] === tag ? true : false}
                        key={i}
                        color={mappedGenreFilters.find(a=>a.text === tag) ? mappedGenreFilters.find(a=>a.text === tag).color : ""}
                        handleClick={() => filterWithTag(tag, "genres")}
                    >{tag}</Tag>)
                } 
            </span>
        ),
    },
    {
        title: `Styles`, dataIndex: 'styles', key: 'styles',
        filterMultiple: false,
        hidden: hiddenInfo.styles,
        filters: mappedStyleFilters,
        filteredValue: filteredInfo.styles || null,
        onFilter: (value, record) => {
            return record.styles ? record.styles.indexOf(value) >= 0 : 0
        },
        filterDropdown: ({confirm, clearFilters, filters}) => {
            return(
                <div style={{textAlign:"center"}}>
                    <FilterDropdown>
                        {filters.sort((a, b) => a.text > b.text ? 1 : -1).map((f, i)=><Tag 
                            key={i}
                            selected={filteredInfo.styles && filteredInfo.styles[0] === f.text ? true : false}
                            color={mappedStyleFilters.find(a=>a.text === f.text) ? mappedStyleFilters.find(a=>a.text === f.text).color : ""}
                            handleClick={() => {
                                filterWithTag(f.value, "styles") 
                                confirm()
                            }}
                        >{f.text}</Tag>)}
                    </FilterDropdown>
                    <Button style={{margin:"3px 0px"}} size="small" onClick={()=>{
                        clearFilters()
                        confirm()
                    }}
                    >Clear filter</Button>
                </div>
            )
        },
        render: tags => (
            <span>
                {
                    tags && tags.map((tag, i) => 
                    <Tag
                        key={i}
                        selected={filteredInfo.styles && filteredInfo.styles[0] === tag ? true : false}
                        color={mappedStyleFilters.find(a=>a.text === tag) ? mappedStyleFilters.find(a=>a.text === tag).color : ""}
                        handleClick={() => filterWithTag(tag, "styles")}
                    >{tag}</Tag>)
                } 
            </span>
        ),
    },
    {
        title: 'Rating', dataIndex: 'rating', key: 'rating',
        width: 25,
        align: 'center',
        sortOrder: sortedInfo.columnKey === 'rating' ? sortedInfo.order : null,
        hidden: hiddenInfo.rating,
        showSorterTooltip: false,
        sorter: (a, b) => a.rating - b.rating,
        render: (td) => <Number color={ratingScale(td)}>{td}</Number> ,
    },
    {
        title: 'Action', key: 'action',
        align: "right",
        render: (song) => (
            <Space>
            {song.url && <a onClick={()=>handlePlayButton(song)} title="Play song">{curSong && song.url === curSong.url ? <Pulse>🎵</Pulse> : '🎵'}</a>}
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
            <Form layout="inline" style={{ marginBottom: 5 }}>
                <Form.Item label="Hide ratings">
                    <Switch checked={hiddenInfo.rating} onChange={(e)=>toggleColumn("rating", e)}/>
                </Form.Item>
                <Form.Item label="Hide styles">
                    <Switch checked={hiddenInfo.styles} onChange={(e)=>toggleColumn("styles", e)}/>
                </Form.Item>
                <Form.Item>
                    <Button onClick={clearFilters}>Clear filters</Button>
                </Form.Item>
                <Form.Item>
                    <Button onClick={clearAllOptions}>Clear all options</Button>
                </Form.Item>
            </Form>
                <Table
                    onChange={handleTableChange}
                    loading={loading}
                    locale={emptyTableScreen}
                    rowKey={record => record.id}
                    size="small"
                    pagination={{pageSize:9999, hideOnSinglePage:true}}
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