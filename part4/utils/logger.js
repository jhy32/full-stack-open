const error = (text) => {
    console.error(text)
}

const info = (...text) => {
    console.log(...text)
}

module.exports = {
    error, 
    info
}