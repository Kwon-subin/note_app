function register() {
    const email_input = document.getElementById('email');
    const password_input = document.getElementById('password');
    const password_check_input = document.getElementById('password-check');

    if (!email_input.value){
        alert('이메일을 입력해주세요.');
        return;
    }

    if (!password_input.value){
        alert('비밀번호를 입력해주세요.');
        return;
    }

    if (!password_check_input.value){
        alert('비밀번호를 재입력해주세요.');
        return;
    }

    if (password_input.value !== password_check_input.value){
        alert('비밀번호를 확인해주세요.');
        return;
    }

    const form = document.getElementById('register');
    form.submit();

}