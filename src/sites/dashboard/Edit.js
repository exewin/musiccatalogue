import React, {useState, useContext, useEffect} from "react"
import styled from "styled-components"
import {Context} from "../../Context"
import {databaseAddSong, databaseGetConcreteSong} from "../../database"
import {useSearchParams} from "react-router-dom";
import { useNavigate } from "react-router"
import { Button, Input, Form, message, InputNumber, Checkbox } from "antd";
import { grabIdFromYoutubeUrl, grabIdFromDiscogsUrl } from "../../utils/grabIdFromUrl";
import { createDiscogsSong } from "../../utils/createDiscogsSong";
import { splitAndTrim } from "../../utils/splitAndTrim";


const Container = styled.div`
    background-color: #fff;
    border: 1px solid;
`

const Edit = () => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const idParam = searchParams.get('id')
    const axios = require('axios').default;

    const [stayOnPage, setStayOnPage] = useState(false)

    const [form] = Form.useForm();
    const artistValue = Form.useWatch('artist', form);
    const titleValue = Form.useWatch('title', form);
    const urlValue = Form.useWatch('url', form);
    const yearValue = Form.useWatch('year', form);
    const styleValue = Form.useWatch('style', form);
    const genreValue = Form.useWatch('genre', form);
    const discogsUrlValue = Form.useWatch('discogsUrl', form);
    const ratingValue = Form.useWatch('rating', form);

    const [songEdit, setSongEdit] = useState({})

    useEffect(()=>{
        if(idParam)
            setSongEdit(databaseGetConcreteSong(user.userData.login, idParam))
    },[])

    useEffect(()=>{
        if(Object.keys(songEdit).length)
            fillForm(songEdit)
    },[songEdit])

    const fillForm = ({url, title, artist, year, genres, styles, discogsUrl, rating}) => {
        form.setFieldsValue({
            url: url,
            title: title,
            artist: artist,
            year: year,
            genre: genres && genres.join(","),
            style: styles && styles.join(","),
            discogsUrl: discogsUrl,
            rating: rating ? rating : ratingValue,
        });
    }

    const sendData = () => {
        const songObject = {
            artist: artistValue, 
            title: titleValue,
            url: grabIdFromYoutubeUrl(urlValue), 
            year: yearValue, 
            genres: splitAndTrim(genreValue), 
            styles: splitAndTrim(styleValue), 
            discogsUrl: grabIdFromDiscogsUrl(discogsUrlValue),
            rating: ratingValue
        }
        databaseAddSong(user.userData.login, songObject, idParam)
        if(!stayOnPage)
            navigate(`/dashboard/songs`)
    }

    const fetchFromDiscogs = async() => {
        try {
            const response = await axios.get(`https://api.discogs.com/releases/${grabIdFromDiscogsUrl(discogsUrlValue)}`)
            fillForm(createDiscogsSong(response.data))
        } catch (error) {
            message.error('invalid ID')
        }
      }


    const convertUrlBtn = (
        <Button size="small" onClick = {fetchFromDiscogs}>Fetch</Button>
    )

    const onFinish = () => sendData()
    const onFinishFailed = () => message.error('Submit failed!')

    return(
        <Container>
            <br/>
            <Form 
            name="edit"
            initialValues={{ rating: 50 }}
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

                <Form.Item label="Youtube ID" name="url" tooltip="Full links are also accepted.">
                    <Input style={{ width: '75%' }} placeholder="example: FYH8DsU2WCk"/>
                </Form.Item>

                <Form.Item label="Discogs ID" name="discogsUrl" 
                tooltip="Full links are also accepted. MUST be single release, not master. Click fetch to automatically fill info based on ID.">
                    <Input style={{ width: '75%' }} placeholder="example: 20755" addonAfter={convertUrlBtn}/>
                </Form.Item>

                <Form.Item 
                    label="Year" name="year"
                    rules={[{required: true}]}
                    >
                    <InputNumber 
                        controls={false} style={{ width: '25%' }} placeholder="example: 1983"
                        parser={value => parseInt(value)}
                        min={1000}
                        max={9999}
                    />
                </Form.Item>

                <Form.Item label="Genres" name="genre" tooltip="Separate multiple genres with commas.">
                    <Input placeholder="example: Electronic"/>
                </Form.Item>

                <Form.Item label="Styles" name="style" tooltip="Separate multiple styles with commas.">
                    <Input placeholder="example: Synth-pop"/>
                </Form.Item>

                <Form.Item 
                    label="Rating" name="rating"
                    tooltip="Your subjective rating. Use 1-100 range."
                    rules={[{required: true}]}
                    >
                    <InputNumber 
                        controls={false} style={{ width: '25%' }} placeholder="example: 75"
                        parser={value => parseInt(value)}
                        min={1}
                        max={100}
                    />
                </Form.Item>

                {!idParam &&
                    <Form.Item label="Stay on page" tooltip="Check to speed up adding songs.">
                        <Checkbox checked={stayOnPage} onChange={()=>setStayOnPage(!stayOnPage)}/>
                    </Form.Item>
                }

                <Form.Item wrapperCol={{offset: 2, span: 3}}>
                    <Button type="primary" htmlType="submit">
                        {idParam ? 'Edit' : 'Add'}
                    </Button>
                    {idParam && <Button onClick={()=>fillForm(songEdit)}>Revert Changes</Button>}
                </Form.Item>

            </Form>
        </Container>
    )
}

export {Edit}