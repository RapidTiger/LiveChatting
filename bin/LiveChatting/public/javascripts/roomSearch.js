let num = [];
let name = [];
let pw = [];
pwck = (i) => {
    const input = prompt('비밀번호를 입력하세요');
    if (pw[i] == input) {
        location.href=`roomJoinProgram?num=${num[i]}&name=${name[i]}`
    }else {
        alert("잘못된 비밀번호입니다");
    }
}
window.onload = () => {
    const btn = document.querySelector("#sreach");
    btn.addEventListener('keyup', () => {
        if($('#sreach').val().length >0) {
            $.ajax({
                url: "roomSearchProgram",
                type: "GET",
                data: {
                    name: $('#sreach').val()
                },
                success: function (res) {
                    $('#roomList').empty();
                    [num, name, pw] = [[],[],[]];
                    for (let i = 0; i < res.length; i++) {
                        [num[i],name[i],pw[i]] = [res[i].num,res[i].name,res[i].pw];
                        let clickevent = `<a href="roomJoinProgram?num=${res[i].num}&name=${res[i].name}">`;
                        let lock = '';
                        if (res[i].pw != "") {
                            lock = `<div class="right lockImg"><img src="images/icon/lock.png"></div>`;
                            clickevent = `<a onclick='pwck(${i})'>`;
                        }
                        $('#roomList').append($('<li class="otmes">').html(`
                            ${clickevent}
                                <div class="left profileImg pdtop10">
                                    <img class="pdl10" src="images/room/${res[i].num}.png" onerror="this.src='images/icon/group.png'">
                                </div>
                                <ul class="rooms">
                                    <li class="seRoom">
                                        <div class="roomName">${res[i].name}</div>
                                        ${lock}
                                    </li>
                                </ul>
                            </a>
                        `));
                    }
                },
                error: function () {
                    alert("error")
                }
            })
        }
    });
}