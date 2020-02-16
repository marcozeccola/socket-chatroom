//TODO sistemare lo scrolltoBottom che non funziona e fare stile della chat
//SECTION Client-side
let socket = io();
let btn = document.querySelector('#submit-btn');
let messageInput = document.querySelector('#message-input');
let box = document.querySelector('#messages-box');
let sendLocation = document.querySelector('#send-location');
let lastMessage = document.querySelector('.boxx').lastElementChild;
let usersList = document.querySelector('#users');
//restare sull'ultimo messaggio
function scrollToBottom() {
    lastMessage.scrollIntoView();
}
//connnessione
socket.on('connect', () => {
    console.log("connesso al server dal client");
    //RegEx che crea oggetto con name e room
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');
    //all submit della form iniziale. passo due parametri il primo è l'oggetto dell url il secondo una callback per un eventuale errore
    socket.emit('join', params, function (err) {
        if (err) {
            window.location.href = '/';
            alert(err);
        }
    })
});

//disconnessione
socket.on('disconnect', () => {
    console.log("disconnesso al server");
});
socket.on('updateUsers', (users) => {
    console.log(users);
    let ol = document.createElement('ol');
    users.forEach((user) => {
        let li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    });

    usersList.innerHTML = "";
    usersList.appendChild(ol);

})
//riceve messaggio dal server
socket.on('showMessage', (message) => {
    //funzione per formattare data-> ora pm/am
    const timeFormat = moment(message.hour).format('LT');
    const template = document.querySelector('#template').innerHTML;
    const mytemplate = document.querySelector('#mychat-template').innerHTML;

    console.log(message.id, socket.id)
    if (message.id == socket.id) {

        //mustache rendering del mytemplate ossia il messaggio a destra 
        var html = Mustache.render(mytemplate, {
            from: message.from,
            text: message.text,
            hour: timeFormat
        });
    } else {

        //mustache rendering del template messaggio a sinistra
        var html = Mustache.render(template, {
            from: message.from,
            text: message.text,
            hour: timeFormat
        });

    }

    //crea un  div per ogni messaggio
    const div = document.createElement('div');
    div.innerHTML = html;
    //mostra il messaggio
    box.append(div);

    scrollToBottom();

})
//riceve messaggio dal server
socket.on('showLocationMessage', (message) => {
    //funzione per formattare data-> ora pm/am
    const timeFormat = moment(message.hour).format('LT');
    const template = document.querySelector('#mylocation-template').innerHTML;

    const mytemplate = document.querySelector('#location-template').innerHTML;
    if (message.id == socket.id) {
        //mustache rendering del template
        var html = Mustache.render(template, {
            from: message.from,
            url: message.url,
            hour: timeFormat
        });
    } else {

        //mustache rendering del template
        var html = Mustache.render(mytemplate, {
            from: message.from,
            url: message.url,
            hour: timeFormat
        });
    }
    //crea un div per ogni messaggio
    const div = document.createElement('div');

    div.innerHTML = html;
    //mostra il messaggio
    box.append(div);

    scrollToBottom();
})


//inivio messaggio
btn.addEventListener('click', (e) => {
    //non fa riaggiornare la pagina
    e.preventDefault();
    socket.emit('message', {
        from: " Default",
        text: messageInput.value
    })
    //reset input dopo invio
    messageInput.value = " ";
})


//inivio posizione
sendLocation.addEventListener('click', (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
        return alert('non pupoi usare geolocalizzazzione');
    }

    navigator.geolocation.getCurrentPosition((position) => {

        //invio al server lat e long
        socket.emit('location', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        })
    }, () => {
        alert('qualcosa è andato storto nel codificare posizione')
    })
})