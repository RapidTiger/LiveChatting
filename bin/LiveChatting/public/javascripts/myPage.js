setThumbnail = (event) => {
    var reader = new FileReader();
    reader.onload = (event) => {
        $('#profilImg').submit();
    };
    reader.readAsDataURL(event.target.files[0]);
}