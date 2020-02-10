class Users {
    //SECTION constructor
    constructor() {
        this.users = [];
    }

    //SECTION metodi

    //aggiunge utenti con id room e name
    addUser(id, name, room) {
        let user = {
            id,
            name,
            room
        };
        this.users.push(user);
        return user;
    }

    //rimuove user dall'id
    removeUser(id) {
        
        let user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    //lista degli utenti in una room
    getUserList(room) {
        //filtra gli users con l'attributo room uguale alla rooma passata
        let users = this.users.filter((user) => user.room === room);

        //array dei nomi della room
        let namesArray = users.map((user) => user.name);

        return namesArray;
    }

    //trova utente da id
    getUser(id) {
        //filtra users e trova l'utente con l'id passato (undefined se non trovato) 
        return this.users.filter((user) => user.id === id)[0];
    }

}

module.exports = {
    Users
};