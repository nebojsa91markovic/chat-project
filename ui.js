//User Interface

export class ChatUI {
    constructor(ul) {
        this.chatui = ul;
    }

    set chatui(value) {
        this._chatui = value
    }

    get chatui() {
        return this._chatui
    }

    clear() {
        this.chatui.innerHTML = '';
    }

    templateLI(msg) {
        let dataId = msg.id;
        msg = msg.data();
        let li = document.createElement('li');
        let msgClass = 'msgTemplate col-6 col-t-6';
        if(msg.username == localStorage.getItem('chat_project_username')){
            msgClass = 'myMsgTemplate col-6 col-t-6';
        }
        li.className = msgClass;
        let p = document.createElement('p');
        p.className = 'msgUser';
        p.innerHTML = msg.username;
        let span1 = document.createElement('span');
        span1.className = 'msgText';
        span1.innerHTML = msg.message;
        let span2 = document.createElement('span');
        span2.className = 'msgTime';
        span2.innerHTML = this.showTimeOfMsg(msg.create_at.toDate());
        
        let trashcan = document.createElement('img');
        trashcan.src = "images/trashcan.jpg";
        trashcan.className = "trashcan";
        li.setAttribute('data-id', dataId)
        p.appendChild(span1);
        li.appendChild(p);
        li.appendChild(span2);
        li.appendChild(trashcan);
        this.chatui.appendChild(li);
        let chat = document.querySelector('.chat');
        chat.appendChild(this.chatui);
        let chatFocus = document.querySelector('.msgUl');
        chatFocus.scrollTop = chatFocus.scrollHeight;
        
    }
    showTimeOfMsg(dateTime) {
        let time = '';
        let d = dateTime;
        let today = new Date();
        if(`${d.getDate()}.${d.getMonth()}.${d.getFullYear()}` != `${today.getDate()}.${today.getMonth()}.${today.getFullYear()}`){
            time = this.formatDate(d);
        }
        else {
            time = this.formatDate(d).substr(13);
        }
        return time;
    }

    formatDate(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        day = String(day).padStart(2, "0");
        month = String(month).padStart(2, "0");
        year = String(year).padStart(2, "0");
        hours = String(hours).padStart(2, "0");
        minutes = String(minutes).padStart(2, "0");

        let strDate = `${day}.${month}.${year} - ${hours}:${minutes}`;
        return strDate
    }
}