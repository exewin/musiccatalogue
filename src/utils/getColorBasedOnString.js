const colors = ['volcano', 'magenta', 'red', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']

export const getColor = string =>{
    let result = colors[string.charCodeAt(0)%colors.length]
    return result
}

