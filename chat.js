
export class Chatroom {
    constructor(rm, user){
        this.room = rm;
        this.username = user;
        this.chat = db.collection('chats');
        this.unsub;
    }
    set room(value) {
        this._room = value;
    }
    set username(value) {
        if(value.length > 1 && value.length < 11){
            if(value.indexOf(' ') >= 0){
                alert('Username must not contain spaces! ')
            }
            else {
                this._username = value;
            }
        }
        else {
            alert('Username must be between 2 and 10 characters!')
        }
    }
    get room() {
        return this._room;
    }
    get username() {
        return this._username;
    }

    async addChat(msg) {
        let docChat = {
            username: this.username,
            room: this.room,
            message: msg,
            create_at: firebase.firestore.Timestamp.fromDate(new Date())
        }
        console.log(this.room)
        
        // let response = await this.chat.add(docChat); 
        // return response;
        this.chat.add(docChat)
        .then(() => {
            console.log('Chat sucessfully added!');
        })
        .catch(error => {
            console.log(`Cannot add chat: ${error}`);
        })
    }

    getChats(callback) {
        this.unsub = this.chat
        .where('room', '==' , this.room)
        .orderBy('create_at')
        .onSnapshot( snapshot => {
            snapshot.docChanges().forEach(change => {
                if(change.type == 'added'){
                    //update ceta (dadaj novu poruku na ekran)
                    callback(change.doc.data());
                }
            })
        });
    }

    updateUsername(newUsername) {
        this.username = newUsername;
    }

    updateRoom(newRoom) {
        this.room = newRoom;
        localStorage.setItem('chat_project_room', newRoom);
        if(this.unsub()){
            this.unsub();
        };
    }
}


