import React, {useState, useContext, useEffect} from "react"
import styled from "styled-components"
import {Context} from "../../Context"
import {databaseAddSong, databaseGetConcreteSong} from "../../database"
import {useSearchParams} from "react-router-dom";
import { useNavigate } from "react-router"
import { Button, Input, Form, message, InputNumber, Checkbox } from "antd";
import { grabIdFromUrl } from "../../utils/grabIdFromUrl";
import { createDiscogsSong } from "../../utils/createDiscogsSong";

const Container = styled.div`
    
`

const Edit = () => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const idParam = searchParams.get('id')

    const [stayOnPage, setStayOnPage] = useState(false)

    const [form] = Form.useForm();
    const artist = Form.useWatch('artist', form);
    const title = Form.useWatch('title', form);
    const url = Form.useWatch('url', form);
    const year = Form.useWatch('year', form);
    const style = Form.useWatch('style', form);
    const genre = Form.useWatch('genre', form);

    const discogsUrl = Form.useWatch('discogsUrl', form);

    const [songEdit, setSongEdit] = useState({})

    useEffect(()=>{
        if(idParam)
            setSongEdit(databaseGetConcreteSong(user.userData.login, idParam))
    },[])

    useEffect(()=>{
        fillForm(songEdit)
    },[songEdit])

    const fillForm = ({url, title, artist, year, genre, style}) => {
        form.setFieldsValue({
            url: url,
            title: title,
            artist: artist,
            year: year,
            genre: genre,
            style: style,
        });
    }


    const sendData = () => {
        const songObject = {artist, title, url, year, genre, style}
        databaseAddSong(user.userData.login, songObject, idParam)
        if(!stayOnPage)
            navigate(`/dashboard/songs`)
    }

    const convertUrl = () => {
        form.setFieldsValue({
            url: grabIdFromUrl(url)
        });
    }

    const fetchFromDiscogs = () => {
        fetch(`https://api.discogs.com/releases/${discogsUrl}`)
        .then(response => response.json())
        .then(data => {
            const obj = createDiscogsSong(data)
            fillForm(obj)
        })
    }

    const convertUrlBtn = (
        <Button onClick={convertUrl} size="small" title="This will pull out the ID from full link"> 
            Convert URL 
        </Button>
    )

    const onFinish = () => sendData()
    const onFinishFailed = () => message.error('Submit failed!')

    return(
        <Container>
            <br/>
            <Form 
            name="edit"
            labelCol={{span: 3}} wrapperCol={{span: 16}}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            >
                <Form.Item 
                    label="Artist" name="artist"
                    rules={[{ required: true }]}
                    >
                    <Input style={{ width: '50%' }} placeholder="example: New Order" />
                </Form.Item>

                <Form.Item 
                    label="Title" name="title"
                    rules={[{ required: true }]}
                    >
                    <Input style={{ width: '50%' }} placeholder="example: Blue Monday"/>
                </Form.Item>

                <Form.Item label="Youtube ID" name="url">
                    <Input style={{ width: '75%' }} placeholder="example: FYH8DsU2WCk" addonAfter={convertUrlBtn}/>
                </Form.Item>

                <Form.Item 
                    label="Year" name="year"
                    rules={[{required: true}]}
                    >
                    <InputNumber 
                        controls={false} style={{ width: '25%' }} placeholder="example: 1983"
                        parser={value => parseInt(value)}
                        min="1000"
                        max="9999"
                    />
                </Form.Item>

                <Form.Item label="Genre / Style">
                    <Input.Group compact>
                        <Form.Item name="genre">
                            <Input placeholder="example: Electronic"/>
                        </Form.Item>
                        <Form.Item name="style">
                            <Input placeholder="example: Synth-pop"/>
                        </Form.Item>
                    </Input.Group>
                </Form.Item>


                <Form.Item wrapperCol={{offset: 2, span: 3}}>
                    <Button type="primary" htmlType="submit">
                        {idParam ? 'Edit' : 'Add'}
                    </Button>
                </Form.Item>

                <Checkbox checked={stayOnPage} onChange={()=>setStayOnPage(!stayOnPage)}>Stay on page</Checkbox>

            <hr/>

            Experimental:
            <Form.Item name="discogsUrl">
                <Input placeholder="discogs ID"
                value = ""/>
            </Form.Item>
            
            <Button type="primary" onClick = {fetchFromDiscogs}>Fetch</Button>

            </Form>

        </Container>
    )
}

export {Edit}