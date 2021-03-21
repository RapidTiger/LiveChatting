$(() => {
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
    const socket = io();
    socket.on('new', (num,id,name,type,msg) => {
        let number = numList.indexOf(num);
        if (type == 'emoticon') msg = `<img src="images/emoticon/${msg}.gif">`;
        if (number > -1){
            $('#alertBox').html(`
            <div id="alert">
                <ul>
                    <li>
                        <img class="userImg" src="images/user/${id}.png" onerror="this.src='images/user.png'">
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