window.onload = () => {
    const sreach = $("#sreach");
    sreach.on('keyup', () => {
        $("#sreach").keydown((key) => {
            if (key.keyCode == 13) {
                if($('#sreach').val().length > 0) {
                    $.ajax({
                        url: "friendSearchProgram",
                        type: "GET",
                        data: {
                            id: $('#sreach').val()
                        },
                        success: function (res) {
                            $('#infoBox').empty();
                            for (let i = 0; i < res.length; i++) {
                                console.log(res[i]);
                                $('#infoBox').html($(`
                                <div id="image_container">
                                    <img class="userimage" src="images/user/${res[i].id}.png"
                                         onError="this.src='images/user.png'">
                                </div>
                                <div>${res[i].name}</div>
                                <div>
                                    <a href="/friendRequestProgram?friend=${res[i].id}&name=${res[i].name}" class="submitBtn">친구신청</a>
                                </div>`));
                            }
                        },
                        error: function () {
                            alert("error")
                        }
                    })
                }
            }
        });
    });
}