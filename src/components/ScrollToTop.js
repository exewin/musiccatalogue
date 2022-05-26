import React, { useState, useEffect } from "react"
import { Button } from "antd"
import styled from "styled-components"
import { UpOutlined } from "@ant-design/icons"

const FixedDiv = styled.div`
position: fixed;
bottom: 8px;
left: 12px;
`

export const ScrollToTop = () => {
    const [showTopBtn, setShowTopBtn] = useState(false)

    useEffect(() => {
        window.addEventListener("scroll", handleButtonVisibility)
        return () => window.removeEventListener("scroll", handleButtonVisibility)
    }, [])

    const handleButtonVisibility = () => {
        if (window.scrollY > 400)
            setShowTopBtn(true)
        else
            setShowTopBtn(false)
    }
    
    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return(
        <FixedDiv showTopBtn>
            {showTopBtn && <Button shape="circle" size="large" onClick={goToTop}><UpOutlined /></Button>}
        </FixedDiv>
    )
}