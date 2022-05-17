export const grabIdFromYoutubeUrl = url => {
    if(!url)
        return

    if(url.indexOf("=") < 0)
        return url

    const res = url.split("=");
    return res[1].substring(0,11)
}

export const grabIdFromDiscogsUrl = url => {
        const reg = new RegExp('(?<=\/)[0-9]+(?=\-)')
        if(reg.test(url))
        {
            return url.match(reg)[0]
        }
        else
            return url
}