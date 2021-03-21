import friendImg from '../images/icon/friends.png';
import chatImg from '../images/icon/chats.png';
import mypageImg from '../images/icon/mypage.png';

// console.log(friends);
// console.log(chat);
// console.log(mypage);

$(document).ready(() => {
    const friend = document.createElement("img");
    friend.setAttribute("src", friendImg);
    $('.friend').append(friend);

    const chat = document.createElement("img");
    chat.setAttribute("src", chatImg);
    $('.chats').append(chat);

    const mypage = document.createElement("img");
    mypage.setAttribute("src", mypageImg);
    $('.mypage').append(mypage);
});