//SECTION Server-side
const path = require('path');
const express = require('express');
const socket = require('socket.io');
const http = require('http');

//funzione genera messaggi
const {
    generateMessage,
    generateLocationMessage
} = require('./modules/message');

//funzione di constrollo stringhe
const {
    verify
} = require('./modules/verify');

const {
    Users
} = require('./modules/users');

//path file statici
const publicPath = path.join(__dirname, '/../public');

//se non configurato il server utilizza la porta 3000
const port = process.env.PORT || 3000;

//inizializzazzione app
let app = express();

//server da usare con socket 
let server = http.createServer(app);
let io = socket(server);

//nuovo utente
let users = new Users();

//file statici
app.use(express.static(publicPath));

//connnecion
io.on('connection', (socket) => {
    console.log("nuovo utente connesso");

    //join alla chatroom
    socket.on('join', (params, err) => {
        //verifica dei campi inseriti
        if (!verify(params.name) || !verify(params.room)) {
            //messaggio dell'alert
            return err('Nome e room sono obbligatorie');
        }

        
        //per entrare nella specifica room
        socket.join(params.room);

        //se loggato prima in altre rooms toglie l'utente
        users.removeUser(socket.id);

        //crea utente
        users.addUser(socket.id, params.name, params.room);

        //
        io.to(params.room).emit('updateUsers', users.getUserList(params.room))
        let user = users.getUser(socket.id);
        //nuovo log all'utente appena loggato
        socket.emit('showMessage', generateMessage('Admin', `Welocome ${user.name} in  ${params.room} room!`));
        
        //nuovo log agli utenti già loggati
        socket.broadcast.to(params.room).emit('showMessage', generateMessage('Admin', `l'utente ${user.name}  è entrato!`));
        err();
    })
    //socket è per la singola connessioneì
    socket.on('message', (message) => {

        let user = users.getUser(socket.id);

        //se effettivamente l'utente ha loggato e se il messaggio è verificato
        if (user && verify(message.text)) {
            //io è per tutti
            //invia al client il messaggio ricevuto
            
            io.to(user.room).emit('showMessage', generateMessage( user.name, message.text, user.id))
            //io.to
        }

    })
    //richiesta invio posizione
    socket.on('location', (coords) => {

        let user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('showLocationMessage', generateLocationMessage(user.name, coords.lat, coords.long, user.id))
        }
    })
    //disconnection
    socket.on('disconnect', () => {


        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUsers', users.getUserList(user.room));
            io.to(user.room).emit('showMessage', generateMessage('Admin', `${user.name} è uscito da ${user.room} room`));
        
            console.log("disconnesso");
        }
    });
});


server.listen(port, () => {
    console.log(`Server -> localhost:${port}`);
})