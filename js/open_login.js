window.onload = function() {
    var icon_mypage = document.querySelector('.mypage a');
    var login_bg = document.querySelector('.login_wrap');
    var login_iframe = document.querySelector('.login_wrap iframe');
    var login_exit_wrap = document.querySelector('.exit_login_wrap');
    var login_exit_btn = document.querySelector('.exit_login_btn');

    var logined = false;


    icon_mypage.addEventListener('click',open_login); // 열기
    function open_login(mypage) {
        if(!logined){
            mypage.preventDefault();

            login_bg.style.opacity = '1';
            login_bg.classList.add('login_bg');

            login_iframe.style.height = '613px';
            login_iframe.style.opacity = '1';
            login_exit_wrap.classList.add('login_exit_wrap');
            login_exit_btn.classList.add('login_exit_btn');
            login_exit_wrap.addEventListener('click',close_login); // 닫기버튼 준비
        }
    }

    function close_login() { // 닫기
        login_bg.style.opacity = '0';
        login_exit_wrap.classList.remove('login_exit_wrap');
        login_exit_btn.classList.remove('login_exit_btn');
        var disappear_timer;
        disappear_timer = setTimeout(function() {
            login_bg.classList.remove('login_bg');
        }, 500);
        login_exit_wrap.removeEventListener('click',close_login);
    }
}