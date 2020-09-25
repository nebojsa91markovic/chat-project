
import {Chatroom} from "./chat.js";
import {ChatUI} from "./ui.js";

let chatsDB = db.collection('chats');
let rooms = document.querySelector('.rooms');
let ul = document.querySelector('.msgUl');
let colPicker = document.querySelector('input[type="color"]');
let btnColPicker = document.querySelector('#btnUpdateColor');
let btnSetDates = document.querySelector('#btnSetDates');


let pageBckground = () => {
    let userBckground = localStorage.getItem('chat_project_background');
    if(userBckground == null || userBckground == '') {
        localStorage.setItem('chat_project_background', '#ffffff');
    }
    let color = localStorage.getItem('chat_project_background');
    colPicker.value = color;
    document.body.style.backgroundColor = color;

}
pageBckground();

btnColPicker.addEventListener('click', event => {
    event.preventDefault();
    localStorage.setItem('chat_project_background', colPicker.value);
    pageBckground();
});

btnSetDates.addEventListener('click', event => {
    event.preventDefault();
    let chatShowStart = document.querySelector('#chatShowStart').value;
    let chatShowEnd = document.querySelector('#chatShowEnd').value;
    if(chatShowStart == '' || chatShowEnd == '') {
        alert('You need to input valid time!');
    }
    else {
        ulChatList.clear();
        chatroom.getChatsDate(chatShowStart, chatShowEnd, data => {ulChatList.templateLI(data)} )
    }
});

function checkUsername() {
    let getUsername = localStorage.getItem("chat_project_username");
    if (getUsername == null || getUsername == '') {
        localStorage.setItem("chat_project_username", 'anonymous');
    }
    getUsername = localStorage.getItem('chat_project_username');
    document.getElementById("inputUsername").placeholder = `Type new username: ${getUsername}`;
    return localStorage.getItem("chat_project_username");
}

function showRoom() {
    let getRoom = localStorage.getItem('chat_project_room');
    if(getRoom == null) {
        localStorage.setItem('chat_project_room', "general");
    }
    let r = localStorage.getItem('chat_project_room');
    let activeRoom = document.querySelector(`#${r}`);
    activeRoom.focus();
    return localStorage.getItem('chat_project_room');
}

let ulChatList = new ChatUI (ul);
let chatroom = new Chatroom(showRoom(), checkUsername());

chatroom.getChats(data => {ulChatList.templateLI(data)})

rooms.addEventListener('click', event => {
    let watchRoom = event.target.id;
    if(event.target.className.includes('roomBtns')){        //this if so if you click on ul or div tag don't do nothing
        chatroom.updateRoom(watchRoom);
        printRoom();
    }
    else {
        document.getElementById(localStorage.getItem('chat_project_room')).focus();
    }
});
function printRoom() {
    ulChatList.clear();
    chatroom.getChats(data => {ulChatList.templateLI(data);})
}


ul.addEventListener('click', event => {
    if(event.target.tagName === 'IMG') {
       let id = event.target.parentElement.getAttribute('data-id');
       event.target.parentElement.parentElement.removeChild(event.target.parentElement)
       chatroom.delChat(id);
    }
})


let btnSend = document.querySelector('#btnSend');
let msg = document.querySelector('#inputMessage');
msg.addEventListener('keyup', event => {
    if(event.keyCode == 13){
        btnSend.click;
    }
})
btnSend.addEventListener('click', event => {
    event.preventDefault();
    let msg = document.querySelector('#inputMessage').value;
    let msgTest =  msg.replace(/\s/g, '');
    if( msgTest.length != 0){
        chatroom.addChat(msg)
        .then( () => {document.querySelector('#inputMessage').value = ''})
        .catch( err => {console.log(err);});
    }
    else {
        alert("You can't send EMPTY message");
    }
})

let btnUpdate = document.querySelector('#btnUpdate');
btnUpdate.addEventListener('click', event => {
    event.preventDefault();
    let username = document.querySelector('#inputUsername');
    if(username.value != '' || username.value != localStorage.getItem('chat_project_username')){
        localStorage.setItem("chat_project_username", username.value);
        chatroom.updateUsername(username.value);
        document.getElementById("inputUsername").placeholder = `Type new username: ${username.value}`;

        printRoom();

        let notification = document.querySelector('.notificationOnUsernameChanged');
        notification.innerHTML = username.value;
        notification.style.display = 'block';
        username.value = '';
        setTimeout(function() {
            notification.style.display = 'none';
        }, 3000);
    }
    else {
        alert("You can't put EMPTY username or You already have set the same username!")
    }
    checkUsername()
})
