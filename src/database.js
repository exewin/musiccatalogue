import {message} from "antd"
import {nanoid} from "nanoid"

let database = []
const DATABASE_LABEL = "music_catalogue_database"


export const databaseLoad = () => {
   const data = localStorage.getItem(DATABASE_LABEL)
   database = JSON.parse(data)
   //databaseDisplay()
}

const databaseSave = () => {
    localStorage.setItem(DATABASE_LABEL, JSON.stringify(database))
}

export const databaseCreateUser = (login, password) => {
    if(!databaseCreateUserValidate(login, password))
        return
    if(!databaseUserExists(login)){
        database.push({
            login, 
            password, 
            songs:[],
            genres:[],
            styles:[],
        })
    databaseSave()
    message.success(`account ${login} created!`, 1)
    } else
        message.error(`${login} is taken!`)
}

export const databaseClear = () => {
    database = []
    databaseSave()
    message.info(`database cleared!`)
}

export const databaseLogin = (login, password) => {
    let success = false
    if(!databaseUserExists(login))
    {
        message.error(`user ${login} not found`)
        return
    }
    else
    {
        database.find(user => {
            if(user.login === login)
            {
                if(user.password === password)
                {
                    message.success(`Welcome ${login}!`, 1)
                    success = true
                    return
                }
                else 
                {
                    message.error(`wrong password`)
                    return
                }
            }
        })
    }
    return success
}

const findUser = login => {
    if(database.length > 0){
        return database.find(user => user.login === login)
    }
    else{
        return false
    }
}


const databaseUserExists = login => {
    if(findUser(login)) {
        return true
    }
    else {
        return false
    }
}

const databaseDisplay = () => {
    console.log(database)
}

const databaseCreateUserValidate = (login, password) => {
    if(login.length < 3 || password.length < 3) {
        message.error(`username and password must be at least 3 characters long.`)
        return false
    }

    return true
}

export const databaseAddSong = (login, song, id) => {
    database.find(user => {
        if(user.login === login){
            if(id!=null){
                const arr = user.songs.map(concreteSong=> {
                    if(id===concreteSong.id){
                        song.id = id
                        return song
                    }
                    else return concreteSong

                })
                user.songs = arr
                message.success(`song ${song.title} edited`)
            }
            else{
                song.id = nanoid()
                user.songs.push(song)
                message.success(`song ${song.title} added`)
            }
            databaseAddGenres(user, song.genres)
            databaseAddStyles(user, song.styles)
            databaseSave()
        }
    })
}

export const databaseRemoveSong = (login, id) => {
    database.find(user => {
        if(user.login === login)
        {
            console.log(id)
            const arr = user.songs.filter(song => song.id != id)
            user.songs = arr
        }
    })
    databaseSave()
}

export const databaseGetConcreteSong = (login, id) => {
    let song = {}
    database.find(user => {
        if(user.login === login)
        {
            song = user.songs.find(song => song.id == id)
        }
    })
    return song
}

export const databaseGetListInfo = login => {
    let songs = []
    let styles = []
    let genres = []
    database.find(user => {
        if(user.login === login)
        {
            songs = user.songs
            styles = user.styles
            genres = user.genres
        }
    })
    return [songs, genres, styles]
}


const databaseAddStyles = (user, styles) => {
    let newStyles = styles.concat(user.styles)
    let removeDuplicates = [...new Set(newStyles)]
    user.styles = removeDuplicates
}

const databaseAddGenres = (user, genres) => {
    let newgenres = genres.concat(user.genres)
    let removeDuplicates = [...new Set(newgenres)]
    user.genres = removeDuplicates
}