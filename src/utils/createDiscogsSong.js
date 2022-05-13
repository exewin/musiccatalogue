import { grabIdFromUrl } from "./grabIdFromUrl"
export const createDiscogsSong = (data) => {
    const song = {
        url: data.hasOwnProperty('videos') ? grabIdFromUrl(data.videos[0].uri) : "",
        artist: data.artists[0].name,
        title: data.title,
        year: data.year,
        genre: data.genres[0],
        style: data.styles[0],
    }
    return song
}