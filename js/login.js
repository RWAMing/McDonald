// 로그인
window.onload = function(){
    
    // elements
    var title = document.querySelectorAll('legend')[0];
    var title_change_timer;
    var all_contents = document.querySelectorAll('fieldset>input,fieldset>div');
    var contents_wrap = all_contents[0].parentNode;
    var contents_remove_timer;
    // console.log(all_contents);
    var sign_up = document.querySelectorAll('#lost_signup p')[0];
    var find_idpw = document.querySelectorAll('#lost_signup p')[1];
    var quit = document.getElementById('quit');


    // function

    // 회원가입
    sign_up.addEventListener('click',go_sign_up);
    function go_sign_up(href){
        go_sign_up_remove(href);
        go_sign_up_change();
    }
        // 로그인(기존화면 삭제) -> 회원가입
        function go_sign_up_remove(href){
            href.preventDefault; // 하이퍼링크 막기
            all_contents.forEach(function(content, i){
                content.style.transition = 'all 0.5s';
                content.style.opacity = '0';
                contents_remove_timer = setTimeout(function(){
                    contents_wrap.removeChild(content);
                }, 500);
            });
        }
        // 로그인 -> 회원가입(컨텐츠 삽입)
        function go_sign_up_change(){
            title.style.transition = 'all 0.5s';
            title.style.opacity = '0';
            title_change_timer = setTimeout(function(){
                title.innerText = '회원가입';
                title.style.opacity = '1';
            },500);
        }


    // 닫으면 초기화

}