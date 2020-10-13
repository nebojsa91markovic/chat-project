
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
                    callback(change.doc);
                }
            })
        });
    }

    getChatsDate(start, end, callback) {
        let startDate = new Date(start);
        let endDate = new Date(end);
        startDate = firebase.firestore.Timestamp.fromDate(startDate)
        endDate = firebase.firestore.Timestamp.fromDate(endDate)

        this.unsub = this.chat
        .where('room', '==', this.room)
        .where('create_at', '>=', startDate)
        .where('create_at', '<', endDate)
        .orderBy('create_at')
        .onSnapshot( snapshot => {
            snapshot.docChanges().forEach(change => {
                if(change.type == 'added'){
                    callback(change.doc);
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

    async delChat(msg) {
        let delLi = document.querySelectorAll(`[data-id="${msg}"]`);
        
        let doc = db.collection('chats').doc(`${msg}`);
        doc.get()
        .then(doc => {
            if(doc.exists) {
                let data = doc.data();
                if(data.username == this.username){
                    if(confirm("Do you really wish to delete this message!?")){
                        db.collection('chats').doc(`${msg}`).delete()
                        .then(() => {
                            console.log('Task sucessfully deleted!');
                        })
                        .catch(error => {
                            console.log(`Cannot delete task: ${error}`);
                        })
                    }
                }
            }
            else {
                console.log(`No document with id: ${doc.id}`);
            }
        })
        .catch(err => console.log(err));
    }
}


