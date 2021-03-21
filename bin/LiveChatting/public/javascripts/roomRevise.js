window.onload = () => {
    changePw = (num) => {
        const newPw = prompt("비밀번호 입력");
        const form = $('<form></form>');
        form.attr('action', 'pwRevise');
        form.attr('method', 'post');
        form.appendTo('body');
        form.append($(`<input type="hidden" value="${num}" name=num>`));
        form.append($(`<input type="hidden" value="${newPw}" name=pw>`));
        form.submit();
    }
    removePw = (num) => {
        const form = $('<form></form>');
        form.attr('action', 'pwRevise');
        form.attr('method', 'post');
        form.appendTo('body');
        form.append($(`<input type="hidden" value="${num}" name=num>`));
        form.append($(`<input type="hidden" value="" name=pw>`));
        form.submit();
    }
    setThumbnail = (event) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            $('#gruopImg').submit();
        };
        reader.readAsDataURL(event.target.files[0]);
    }
}