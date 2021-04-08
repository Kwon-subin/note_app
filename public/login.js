function login() {
    const email_input = document.getElementById('email');
    const password_input = document.getElementById('password');

    if (!email_input.value){
        alert("이메일을 입력해주세요.");
        return;
    }

    if (!password_input.value){
        alert("비밀번호를 입력해주세요.");
        return;
    }
    const form = document.getElementById('login');
    form.submit();
}

function register() {
    const form = document.getElementById('register');
    form.submit();
}