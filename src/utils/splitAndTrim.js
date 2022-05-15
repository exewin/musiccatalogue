export const splitAndTrim = string =>{
    let arr = string.split(',')
    for(let i = 0; i < arr.length; i++){
        arr[i] = arr[i].trim()
    }
    arr = capitalizeWords(arr)
    return arr
}

function capitalizeWords(arr) {
    return arr.map(element => {
      return element.charAt(0).toUpperCase() + element.substring(1);
    });
  }