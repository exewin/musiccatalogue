import {message} from "antd"
import {nanoid} from "nanoid"
import {saveAs} from "file-saver"

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
    const user = database.find(u => u.login === login)
    if(user){
        if(id){
            const arr = user.songs.map(concreteSong=> {
                if(id===concreteSong.id){
                    song.id = id
                    return song
                }
                return concreteSong
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
}

export const databaseRemoveSong = (login, id) => {
    const user = database.find(u => u.login === login)
    if(user){
        const arr = user.songs.filter(song => song.id != id)
        user.songs = arr
    }
    databaseSave()
}

export const databaseGetConcreteSong = (login, id) => {
    let song = {}
    const user = database.find(u => u.login === login)
    if(user)
        song = user.songs.find(song => song.id === id)
    
    return song
}

export const databaseGetListInfo = login => {
    const user = database.find(u => u.login === login)
    if(user) return [user.songs, user.genres, user.styles]
    return [[],[],[]]
}

export const databaseDeleteUser = login => {
    const filteredDatabase = database.filter(u => u.login != login)
    database = filteredDatabase
    databaseSave()
}

export const databaseSaveToFile = () => {
    const db = JSON.stringify(database)
    const file = new File([db], `musicCatalogueDatabase-${Date.now()}.json`, {type: "text/plain;charset=utf-8"})
    saveAs(file)
}

export const databaseLoadFromFile = text => {
    const db = JSON.parse(text)
    database = db
    databaseSave()
}

export const databaseClearFilters = (login) => {
    const user = database.find(u => u.login === login)
    if(user){
        let usedStyles = []
        let usedGenres = []
        user.songs.forEach(s => {
            usedGenres = usedGenres.concat(s.genres)
            usedStyles = usedStyles.concat(s.styles)
        })
        const newGenres = [...new Set(usedGenres)]
        const newStyles = [...new Set(usedStyles)]
        const operationInfo = {
            genresResult: user.genres.length - newGenres.length, 
            stylesResult: user.styles.length - newStyles.length,
        }
        user.genres = newGenres
        user.styles = newStyles
        databaseSave()
        return operationInfo
    }
    
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