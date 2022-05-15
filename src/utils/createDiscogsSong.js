import { grabIdFromYoutubeUrl } from "./grabIdFromUrl"
export const createDiscogsSong = (data) => {
    const song = {
        url: data.hasOwnProperty('videos') ? grabIdFromYoutubeUrl(data.videos[0].uri) : "",
        artist: data.artists[0].name,
        title: data.title,
        year: data.year,
        genres: data.genres,
        styles: data.styles,
        discogsUrl: data.id,
    }
    return song
}