const colors = [
    {primary: "#f5c2b8", secondary: "#9b240c"},
    {primary: "#d3b5be", secondary: "#4c061b"},
    {primary: "#fad8c8", secondary: "#a65832"},
    {primary: "#f3ece3", secondary: "#766144"},
    {primary: "#fef0b6", secondary: "#b19008"},
    {primary: "#dcecc3", secondary: "#318526"},
    {primary: "#e2dfc0", secondary: "#9e952c"},
    {primary: "#ceecdf", secondary: "#408767"},
    {primary: "#d6d6e8", secondary: "#53537d"},
    {primary: "#bfe2fa", secondary: "#1d6fa6"},
    {primary: "#bec5c8", secondary: "#1a2b32"},
    {primary: "#ffeed3", secondary: "#cc881b"},
    {primary: "#ccffb8", secondary: "#3bb30c"},
    {primary: "#feccf9", secondary: "#c802b6"},
    {primary: "#d3d0c9", secondary: "#222a1f"},
    
]

export const getColor = (string) => colors[string.charCodeAt(0)%colors.length]