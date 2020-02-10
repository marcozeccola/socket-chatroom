const moment = require('moment');
let generateMessage = (from, text)=>{
    return {
        from,
        text,
        hour: moment().valueOf()
    }
}

let generateLocationMessage = (from, lat, long)=>{
    return{
        from,
        url: `https://www.google.com/maps?q=${lat},${long}`,
        hour: moment().valueOf()
}
}
module.exports = {generateMessage, generateLocationMessage };