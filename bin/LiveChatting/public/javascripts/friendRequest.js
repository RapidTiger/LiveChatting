window.onload = () => {
    accept = (friend, name) => {
        console.log(friend);
        console.log(name);
        $.ajax({
            url: "friendInsertProgram",
            type: "GET",
            data: {
                friend: friend,
                name: name
            },
            success: function (res) {
                location.reload();
            },
            error: function () {
                alert("error")
            }
        })
    }
}