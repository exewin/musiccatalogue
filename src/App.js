import React, {useEffect} from "react"
import styled from "styled-components"
import {Routes, Route, BrowserRouter} from "react-router-dom"
import {databaseLoad} from "./database"
import {ContextProvider} from "./Context"
import {Header} from "./components/Header"
import {Login} from "./sites/Login"
import {Dashboard} from "./sites/Dashboard"
import {PageNotFound} from "./sites/PageNotFound"
import {Songs} from "./sites/dashboard/Songs"
import {Greeting} from "./sites/dashboard/Greeting"
import {Options} from "./sites/dashboard/Options"
import {Edit} from "./sites/dashboard/Edit"
import {VideoPlayer} from "./components/VideoPlayer"
import logoMcat from "./images/logomcat.png"

const Container = styled.div`
background-color: #222;
background-image: url(${props => props.logoMcat});
background-repeat: no-repeat;
background-position: center;
background-size: 10%;
height: 100vh;
max-width: 1200px;
margin: 0 auto;
`

export const App = () => {

  useEffect(()=>{
    databaseLoad()
  },[])

  return (
    <>
    
      <ContextProvider>
       <Container logoMcat={logoMcat}>
          <BrowserRouter>
          <Header/>
            <Routes>
              <Route index element={<Login/>}/>
              <Route path="dashboard" element={<Dashboard/>}>
                <Route exact path="" element={<Greeting/>}/>
                <Route path="songs" element={<Songs/>}/>
                <Route path="edit" element={<Edit/>}>
                  <Route path=":artist:title" element={<Edit/>}/>
                </Route>
                <Route path="options" element={<Options/>}/>
                <Route path="*" element={<PageNotFound/>}/>
              </Route>

              <Route path="*" element={<PageNotFound/>}/>
            </Routes>
          </BrowserRouter>
        </Container>
        <VideoPlayer/>
       </ContextProvider>
    
    </>
  )
}