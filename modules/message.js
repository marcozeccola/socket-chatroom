const moment = require('moment');
let generateMessage = (from, text, id)=>{
    return {
        from,
        text,
        hour: moment().valueOf(),
        id
    }
}

let generateLocationMessage = (from, lat, long, id)=>{
    return{
        from,
        url: `https://www.google.com/maps?q=${lat},${long}`,
        hour: moment().valueOf(),
        id
}
}
module.exports = {generateMessage, generateLocationMessage };