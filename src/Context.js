import React, {useState, useEffect} from "react"

const Context = React.createContext()

const ContextProvider = ({children}) => {
    const [userData, setUserData] = useState({login: "", token: false})
    const [curSong, setCurSong] = useState(null)

    const user = {
        userData,
        set: (login, mode) => {
            setUserData({login, token:mode})
        }
    }

    useEffect(()=>{
        if(curSong==null)
            document.title = "MCAT"
        else if(curSong.title && curSong.artist)
            document.title = `${curSong.artist} - ${curSong.title}`
    },[curSong])

    return (
        <Context.Provider value={{user, curSong, setCurSong}}>
            {children}
        </Context.Provider>
    )

}

export {ContextProvider, Context}