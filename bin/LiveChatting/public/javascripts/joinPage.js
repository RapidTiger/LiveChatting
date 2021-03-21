let idCheck = false;
let pwCheck = false;
window.onload = () => {
    const userid = $('input[name=id]');
    userid.on('keyup', () => {
        const id = userid.val();
        if (id.length > 3) {
            $.ajax({
                url: "joinidCheck",
                type: "get",
                data: {
                    id: id
                },
                success: function (res) {
                    if (res.length == 0) {
                        $('#id').html("사용이 가능한 아이디입니다").css('color', '#4a799e');
                        idCheck = true;
                    } else {
                        $('#id').html("존재하는 아이디입니다").css('color', '#fd5a5a');
                        idCheck = false;
                    }
                },
                error: function () {
                    alert("error")
                }
            });
        } else {
            $('#id').html("");
            idCheck = false;
        }
    });
    const pw = $('input[name=pwCheck]');
    pw.on('keyup', () => {
        if (pw.val() == $('input[name=pw]').val()) {
            $('#pw').html("입력한 비밀번호와 같습니다").css('color', '#4a799e');
            pwCheck = true;
        } else {
            $('#pw').html("입력한 비밀번호와 다릅니다").css('color', '#fd5a5a');
            pwCheck = false;
        }
    })

    join = () => {
        if (idCheck && pwCheck) {
            $('form').submit();
        } else {
            alert("회원정보를 수정해주세요");
        }
    }
}