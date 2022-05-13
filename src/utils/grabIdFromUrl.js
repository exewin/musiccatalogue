export const grabIdFromUrl = url => {
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