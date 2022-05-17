export const splitAndTrim = string =>{
  if(!string)
    return string
    
    const arr = string.split(',').map(i => i.trim())
    return capitalizeWords(arr)
}

const capitalizeWords = arr => {
    return arr.map(element => element.charAt(0).toUpperCase() + element.substring(1))
}