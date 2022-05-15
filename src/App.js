import React, {useEffect} from "react"
import styled from "styled-components"
import {Routes, Route, BrowserRouter} from "react-router-dom";
import {databaseLoad} from "./database"
import {ContextProvider} from "./Context";
import {Header} from "./components/Header"
import {Login} from "./sites/Login"
import {Dashboard} from "./sites/Dashboard"
import {PageNotFound} from "./sites/PageNotFound";
import {Songs} from "./sites/dashboard/Songs";
import {Edit} from "./sites/dashboard/Edit";
import {VideoPlayer} from "./components/VideoPlayer";

const Container = styled.div`
background-color: teal;
height: 100vh;
max-width: 1200px;
margin: 0 auto;
`

function App() {

  useEffect(()=>{
    databaseLoad()
  },[])

  return (
    <>
    
      <ContextProvider>
       <Container>
          <BrowserRouter>
            <Header/>
            <Routes>
              <Route index element={<Login/>}/>
              <Route path="dashboard" element={<Dashboard/>}>
                <Route path="songs" element={<Songs/>}/>
                <Route path="edit" element={<Edit/>}>
                  <Route path=":artist:title" element={<Edit/>}/>
                </Route>
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

export default App;
