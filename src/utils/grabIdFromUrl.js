export const grabIdFromYoutubeUrl = url => {
    if(!url)
        return

    let validate = url.indexOf("=")
    if(validate < 0)
    {
        return url
    }
    let res = url.split("=");
    let id = res[1].substring(0,11)
    return id
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