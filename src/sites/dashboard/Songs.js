import React, {useContext, useEffect, useState} from "react"
import styled from "styled-components"
import {Song} from "../../components/Song"
import {Context} from "../../Context"
import {databaseGetSongList} from "../../database"
import { Table } from "../../components/Table"
import { dynamicSort } from "../../utils/dynamicSort"
import { Input } from "antd"

const Container = styled.div`
    background-color: aliceblue;
`

const Songs = () => {

    const {Search} = Input
    const [tick, setTick] = useState(false)
    const [songs, setSongs] = useState([])
    const [sorting, setSorting] = useState("#")
    const {user} = useContext(Context)

    const onSearch = () => {
        //search
        sortList(sorting)
    }
    
    const sortList = key => {
        setSorting(key)
        setSongs(prev=>prev.sort(dynamicSort(key)))
    }

    useEffect(()=>{
        setSongs(databaseGetSongList(user.userData.login))
    },[])

    const noSongsMsg = (
        <p>no songs yet</p>
    )
    const mappedSongs = songs.map((item,id)=><Song 
        tick={setTick}
        key={id}
        position={id}
        song={item}
        />)
    return(
        <Container>

            <Search placeholder="search by artist" onSearch={onSearch} style={{ width: 200 }} />

            {mappedSongs.length > 0 ? 
            <Table 
                headers={["#", "Artist", "Title", "Year", "Genre", "Actions"]}
                sort={sortList}
                mark={sorting}
            >
                {mappedSongs}
            </Table> 
            : noSongsMsg}
        </Container>
        )
}

export {Songs}