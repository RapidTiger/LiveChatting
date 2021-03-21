let scrollEnd;
let scrollNow;
let userid;
let username;
let num = location.search.substring(5);
let owner = $('#owner').text();
let scroll;
window.onload = () => {
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
    scrollEnd = $("#messages").scrollTop();
    scroll = $("#messages");
    scroll.on('mousewheel',(e) => {
        if ($("#messages").scrollTop() > scrollEnd){
            $('#newMessage').css('display', 'none');
            scrollEnd = $("#messages").scrollTop();
        }
    });
};
profile = (id, name, friend, room) => {
    if(!($('#profileBtn').is(":checked"))) {
        $('#profile').html(`<div class="profileImg2"><img class="userimage" src="images/user/${id}.png" onerror="this.src='images/user.png'"></div>`);
        $('#profile').append(`<div>${name}</div>`)
        $('#profile').append(`<ul id="profileMenu"></ul>`)
        if (id == userid){
            $('#profileMenu').append(`<li><a href="myPage"><div><img src="images/icon/profile.png"></div><div>프로필수정</div></a></li>`);
        } else{
            if (friend == "") {
                $('#profileMenu').append(`<li><div onclick="friendRequestProgram('${id}','${name}')"><img src="images/icon/addperson.png"></div><div>친구신청</div></li>`);
            } else {
                $('#profileMenu').append(`<li><a href="chatRoom?num=${room}"><div><img src="images/icon/chat.png"></div><div>1:1채팅</div></a></li>`);
            }
            if (owner == userid){
                $('#profileMenu').append(`<li onclick="handOver('${id}')"><div><img src="images/icon/owner.png"></div><div>방장변경</div></li>`);
                $('#profileMenu').append(`<li onclick="kickOut('${id}')"><div><img src="images/icon/ban.png"></div><div>강퇴하기</div></li>`);
            }
        }
    }
}
scrollDown = () => {
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
    scrollEnd = $("#messages").scrollTop();
    $('#newMessage').css('display', 'none');
}

friendRequestProgram = (friend, name) => {
    $.ajax({
        url: "friendRequestProgram",
        type: "GET",
        data: {
            friend: friend,
            name: name
        },
        success: function (res) {
            alert("신청 완료");
            $('#profileBtn').prop("checked", false);
        },
        error: function () {
            alert("error")
        }
    })
}
$(() => {
    const socket = io();
    userid = $('#myId').text();
    username = $('#myName').text();
    owner = $('#owner').text();
    const msg = $('#m');
    const date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h > 12 ? h - 12 : h;
    m = m < 10 ? '0'+m : m;
    const strTime = `${ampm} ${h}:${m}`;
    socket.emit('joinRoom', num, userid, username);
    if($('#messageList').children().length == 0 && owner.length > 0){
        socket.emit('chat message', num, 'sys', 'sys', 'sys', `${userid}님이 방에 입장하였습니다.`);
    }

    handOver = (handId) => {
        socket.emit('chat message', num, 'sys', 'sys', 'sys', `${handId}님이 방의 방장이 되었습니다.`);
        $(location).attr('href',`handOverProgram?num=${num}&id=${handId}`);
    }

    kickOut = (kickid) => {
        socket.emit('chat message', num, 'sys', 'sys', 'sys', `방장이 ${kickid}님을 강퇴하였습니다.`);
        $(location).attr('href',`kickOutProgram?num=${num}&id=${kickid}`);
    }

    detach = (userName) => {
        if (owner == userid) {
            alert("방장은 방을 나갈 수 없습니다.")
        }else {
            socket.emit('chat message', num, 'sys', 'sys', 'sys', `${userName}님이 퇴장하였습니다.`);
            $(location).attr('href',`roomDetachProgram?num=${num}`);
        }
    }

    $('form').submit(() => {
        socket.emit('chat message', num, userid, username, 'text',msg.val());
        msg.val('');
        socket.emit("stopTyping",num,userid,username);
        return false;
    });
    emoticon = (emoticon) => {
        $('#emoticonBtn').prop("checked", false);
        socket.emit("chat message", num, userid, username, 'emoticon', emoticon);
    }

    msg.on('keyup', () => {
        if (msg.val().length == 0) {
            socket.emit("stopTyping",num,userid,username);
        } else {
            socket.emit("typing",num,userid,username);
        }
    });

    socket.on('chat message', (num, id, name, type, msg) => {
        scrollNow = $("#messages").scrollTop();
        if (id == userid) {
            let content;
            if (type == 'text'){
                content = `<li><div class="message me right">${msg}</div></li>`;
            }else {
                content = `<li><div class="message me right"><img class="emoticon" src="images/emoticon/${msg}.gif"></div></li>`;
            }
            $('#messageList').append($('<li class="mymes">').html(`
                <ul class="right mychat">
                    ${content}
                    <li class="time me">${strTime}</li>
                </ul>`));
        } else if (id == 'sys'){
            $('#messageList').append($('<li class="system">').html(`<div>${msg}</div>`));
        } else {
            let content;
            if (type == 'text'){
                content = `<li><div class="message other">${msg}</div></li>`;
            }else {
                content = `<li><div class="message other"><img class="emoticon" src="images/emoticon/${msg}.gif"></div></li>`;
            }
            $('#messageList').append($('<li class="otmes">').html(`
                <label for="profileBtn">
                    <div class="left profileImg" onclick="profile('${id}','${name}')">
                        <img class="userimage" src="images/user/${id}.png" onerror="this.src='images/user.png'">
                    </div>
                </label>
                <ul class="user">
                    <li><div class="user">${name}</div></li>
                    ${content}
                    <li><div class="time">${strTime}</div></li>
                </ul>`));
            if (scrollNow < scrollEnd-100){
                if (type != 'text') msg = '(이모티콘)';
                $('#newMessage').css('display', 'block');
                $("#newContent").html($(`<ul>`).append(`<li><img class="userimage" src="images/user/${id}.png" onerror="this.src='images/user.png'"></li>`)
                    .append(`<li> ${name} : ${msg}</li>`));
            }
        }
        if (scrollNow > scrollEnd-100) {
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
            scrollEnd = $("#messages").scrollTop();
        }
    });
    socket.on('typing', (id,name) => {
        scrollNow = $("#messages").scrollTop();
        if (userid != id){
            if (scrollNow > scrollEnd-100){
                $("#messages").scrollTop($("#messages")[0].scrollHeight);
                scrollEnd = $("#messages").scrollTop();
            }
            $('#typing').html(`<img src="images/icon/typing.gif">`)
        }
    });
    socket.on('stopTyping', (id,name) => {
        if (userid != id) {
        }
        $('#typing').html("")
    });
    let numList = [];
    let roomList = [];
    $.ajax({
        url: "roomList",
        type: "GET",
        success: function (res) {
            for (i = 0; i < res.length; i++){
                numList[i] = `${res[i].num}`;
                roomList[i] = `${res[i].room_name}`;
            }
        },
        error: function () {
            alert("error")
        }
    })
    socket.on('new', (chatNum,id,name,type,msg) => {
        let number = numList.indexOf(chatNum);
        if (number > -1 && chatNum != num){
            $('#alertBox').html(`
            <div id="alert">
                <ul>
                    <li>
                        <img src="images/user/${id}.png" onerror="this.src='images/user.png'">
                    </li>
                    <li>
                        <ul>
                            <li>${name}</li>
                            <li>${msg}</li>
                        </ul>
                    </li>
                </ul>
            </div>`);
        }
    });
});