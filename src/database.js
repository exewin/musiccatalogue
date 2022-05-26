import {message} from "antd"
import {nanoid} from "nanoid"
import {saveAs} from "file-saver"
import {createDefaultOptions} from "./utils/createDefaultOptions"

let database = []
const DATABASE_LABEL = "music_catalogue_database"

export const databaseLoad = () => {
    const data = localStorage.getItem(DATABASE_LABEL)
    if(data)
        database = JSON.parse(data)
}

const databaseSave = () => localStorage.setItem(DATABASE_LABEL, JSON.stringify(database))

export const databaseCreateUser = (login, password) => {
    if(!createUserValidate(login, password))
        return
    if(!userExists(login)){
        database.push({
            login, 
            password, 
            songs:[],
            genres:[],
            styles:[],
            options:createDefaultOptions(),
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
    if(!userExists(login)){
        message.error(`user ${login} not found`)
    }
    else{
        const user = findUser(login)
        if(user){
            if(user.password === password){
                message.success(`Welcome ${login}!`, 1)
                return true
            }
            else
                message.error(`wrong password`)
        }
    }
    return false
}

export const databaseAddSong = (login, song, id) => {
    const user = findUser(login)
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
    const user = findUser(login)
    if(user){
        const arr = user.songs.filter(song => song.id !== id)
        user.songs = arr
    }
    databaseSave()
}

export const databaseGetConcreteSong = (login, id) => {
    let song = {}
    const user = findUser(login)
    if(user)
        song = user.songs.find(song => song.id === id)
    
    return song
}

export const databaseGetListInfo = login => {
    const user = findUser(login)
    if(user) 
        return [user.songs, user.genres, user.styles, user.hasOwnProperty("options") ? user.options : createDefaultOptions()]
    return [[],[],[],{}]
}

export const databaseSetOptions = (login, options) => {
    const user = findUser(login)
    if(user)
        user.options = options
}

export const databaseDeleteUser = login => {
    database = database.filter(u => u.login !== login)
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
    const user = findUser(login)
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
    const newStyles = styles.concat(user.styles)
    const removeDuplicates = [...new Set(newStyles)]
    user.styles = removeDuplicates
}

const databaseAddGenres = (user, genres) => {
    const newgenres = genres.concat(user.genres)
    const removeDuplicates = [...new Set(newgenres)]
    user.genres = removeDuplicates
}

const findUser = login => {
    if(database && database.length > 0)
        return database.find(user => user.login === login)
    else
        return false
}

const userExists = login => {
    if(findUser(login)) 
        return true
    else
        return false
}

const createUserValidate = (login, password) => {
    if(login.length < 3 || password.length < 3) {
        message.error(`username and password must be at least 3 characters long.`)
        return false
    }
    return true
}
