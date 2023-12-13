window.onload = function(){


// 스크롤바
/*
    0) 기본 설정
    1) scrollbar 길이 - Page Length
    2) scrollbar 위치
        2-1) scrollbar 위치 - 스크롤 이벤트
        2-2) scrollbar 위치 - 드래그
            2-2) 1. mousedown - 드래그 준비
            2-2) 2. mousemove - 드래그
                2-2) 2. (1)스크롤바 이미지만 이동
                2-2) 2. (2)실제 페이지 스크롤
            2-2) 3. mouseup - 드래그 끝
        2-3) scrollbar 위치 - 트랙 클릭
    3) scrollbar 보임 & 숨김
        3-1) scrollbar 보임 & 숨김 - 페이지 Overflow
        3-2) scrollbar 보임 & 숨김 - 트랙 MouseOver
*/




// 0) 기본 설정

    // elements
    var html = document.documentElement;
    var scroll_track = document.getElementsByClassName('scroll_track')[0]; // 스크롤 트랙
    var scroll_thumb = document.getElementsByClassName('scroll_thumb')[0]; // 스크롤바
    var scroll_style = scroll_thumb.style; // 스크롤바 스타일

    // get value
    function page_Y(){return html.scrollHeight;} // 실제 길이
    function show_Y(){return html.clientHeight;} // 보이는 부분

    // function
    function move_style(){ // hover 아니지만 움직일 때, 스타일 적용
        scroll_style.backgroundColor = '#bf0000';
        scroll_style.borderRadius = '7px';
        scroll_style.width = '14px';
        scroll_style.minHeight = '14px';
        scroll_style.cursor = 'grab';
    }
    scroll_thumb.addEventListener('mousedown',move_style);
    function hover_style(){ // 이동 완료시, 스타일 복귀
        scroll_style.backgroundColor = 'rgba(190,30,30,0.8)';
        scroll_style.borderRadius = '7px';
        scroll_style.width = '14px';
        scroll_style.minHeight = '14px';
        scroll_style.cursor = 'cursor';
    }
    scroll_thumb.addEventListener('mouseover',hover_style);
    function idle_style(){ // 이동 완료시, 스타일 복귀
        if(!dragging){
            scroll_style.backgroundColor = 'rgba(0,0,0,0.3)';
            scroll_style.borderRadius = '5px';
            scroll_style.width = '10px';
            scroll_style.minHeight = '10px';
        }
    }
    scroll_thumb.addEventListener('mouseleave',idle_style);




// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ




// 1) scrollbar 길이 - Page Length

    // value
    var hide_resize_Done;

    // get value
    // function scroll_maxHeight(){return show_Y() -12;} // margin만큼 줄임 (상6 하6)
    function page_show_ratio(){return page_Y() / show_Y();} // 숨은 페이지 비율
    function scroll_height(){return show_Y() / page_show_ratio() -12} // 페이지 길수록, 스크롤 작게


    // function
    function set_scroll_height(){
        show(); // 사이즈 변경시 스크롤바 보여줌
        clearTimeout(hide_resize_Done); // hide timeout 반복 방지
        scroll_style.height = scroll_height() + 'px'; // 크기 세팅
        hide_resize_Done = setTimeout(function(){ // show보다 hide가 뒤에 실행되도록 유도
            hide();
        },100);
    }


    // ** 함수 실행 **
    set_scroll_height(); // 첫 설정
    window.addEventListener('resize',set_scroll_height);  // window size 따라 변경




// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ




// 2-1) scrollbar 위치 - 스크롤 이벤트

    // value
    var hide_soon;
    var move_style_soon;

    // get value
    function looking_page_Y(){return html.scrollTop;} // 현재 페이지 위치 px
    function scroll_Y(){return looking_page_Y() / page_Y() * 100;} // 스크롤이 있어야 할 위치


    // functions
    function set_scroll_Y(){
        move_style(); // 스타일 변경
        show(); // 스크롤시 스크롤바 보여줌
        clearTimeout(hide_resize_Done); // 페이지 로드시 hide timeout 방지
        clearTimeout(hide_soon); // hide timeout 반복 방지
        clearTimeout(move_style_soon); // 스타일 취소 반복 방지
        scroll_style.top = scroll_Y() + '%'; // top(Y축) 지정
        hide_soon = setTimeout(function(){ // show보다 hide가 뒤에 실행되도록 유도
            hide();
        },100);
        move_style_soon = setTimeout(function(){
            idle_style();
        },500);
    }
    

    // ** 함수 실행 **
    set_scroll_Y(); // 첫 설정
    window.addEventListener('scroll',set_scroll_Y); // scroll할 때마다 위치 옮김




// 2-2) scrollbar 위치 - 드래그

    // value
    var drag_click_Y; // 클릭시 커서Y
    var drag_move_Y; // 이동시 커서Y
    var not_N = /[^0-9\.]/g; // 숫자 제외 삭제용
    var dragging = false; // leave로인한 hide 방지
    var click_origin_scroll_Y; // click할 때 기존Y 대입할 변수


    // function

    // 2-2) 1. mousedown - 드래그 준비
    function drag_down_ready(){
        html.classList.add('drag_disturb'); // 드래그방지
        click_origin_scroll_Y = Number(getComputedStyle(scroll_thumb).top.replace(not_N,'')); // 기존 Y축 반환
        window.addEventListener('mousedown',get_drag_click_Y); // window.커서Y를 변수에 반환
        window.addEventListener('mousemove',drag_move); // move 준비
        dragging = true; // leave로인한 hide 방지
    }
        // mousedown - window의 over위치 커서Y를 변수에 반환
        function get_drag_click_Y(mousedown_window){
            drag_click_Y = mousedown_window.clientY;
        }

    // 2-2) 2. mousemove - 드래그
    function drag_move (mousemove){
        drag_move_Y = mousemove.clientY;
        drag_move_img();
        drag_move_page();
    }

        // get value
        function check_origin_scroll_Y(){return Number(getComputedStyle(scroll_thumb).top.replace(not_N,''))} // 현 Y축 반환
        function drag_distance(){return drag_move_Y - drag_click_Y;} // 드래그거리 (내리면 +, 올리면 -)
        function drag_scroll_Y(){return click_origin_scroll_Y + drag_distance();} // 이미지 이동할 Y축
        function drag_page_move_Y(){return drag_scroll_Y() * page_show_ratio();} // 실제 이동할 Y축 (이미지위치*페이지 비율)

        // value
        var scroll_height_bottom = scroll_height() + 12; // 길이 + margin-top = 6 포함
        var drag_scroll_Y_bottom = show_Y()-scroll_height_bottom; // 스크롤 top 최하점
        var under_0 = check_origin_scroll_Y() >= 0; // 최상단 아래에 있는지 check
        var above_bottom = check_origin_scroll_Y() <= drag_scroll_Y_bottom; // 최하단 위에 있는지 check

        // function
        // 2-2) 2. mousemove - 드래그 - (1)스크롤바 이미지만 이동
        function drag_move_img(){
            if(under_0 || above_bottom){ // 페이지 이내로만 이동 제한
                if(drag_scroll_Y() < 0 || drag_scroll_Y() > drag_scroll_Y_bottom){return false;} // 페이지 넘어가면 X;
                scroll_style.top = drag_scroll_Y() + 'px'; // 스크롤바 이미지만 이동 (실제 스크롤X)
            }
        }
        // 2-2) 2. mousemove - 드래그 - (2)실제 페이지 스크롤
        function drag_move_page(){
            window.scrollTo(0,drag_page_move_Y()); // 페이지 스크롤
        }
        
    // 2-2) 3. mouseup - 드래그 끝
    function drag_up_finish (){
        html.classList.remove('drag_disturb'); // 드래그방지 삭제
        window.removeEventListener('mousemove',drag_move); // 드래그 addEvent 삭제
        dragging = false;
    }
    

    // ** 함수 실행 **
    scroll_thumb.addEventListener('mousedown',drag_down_ready); // 드래그 시작 준비(move 포함)
    window.addEventListener('mouseup',drag_up_finish); // 드래그 끝 준비 -> move 삭제




// 2-3) scrollbar 위치 - 트랙 클릭

    // values
    var track_Y; // 클릭 Y축 대입 (클릭시 1번)
    function track_Y_bottom(){return track_Y - scroll_height_bottom;} // 스크롤바 하단기준 scroll 위치

    // get value
    function track_page_move_Y(){return track_Y * page_show_ratio();} // 페이지이동 (위쪽 클릭)
    function track_page_move_Y_bottom(){return track_Y_bottom() * page_show_ratio();} // 페이지이동 (아래쪽 클릭)


    // functions
    function track_move(mousedown){
        track_Y = mousedown.clientY; // 클릭 Y축 대입 (클릭시 1번)

        if(track_Y < check_origin_scroll_Y()){ // 위쪽 클릭시
            scroll_style.top = track_Y + 'px'; // 클릭 Y 이동
            window.scrollTo(0,track_page_move_Y()); // 페이지 이동
        }
        else if(track_Y > check_origin_scroll_Y() + scroll_height_bottom){ // 아래쪽 클릭시
            scroll_style.top = track_Y_bottom() + 'px'; // 클릭 Y 이동(바 길이 빼고)
            window.scrollTo(0,track_page_move_Y_bottom()); // 페이지 이동
        }
    }


    // ** 함수 실행 **
    scroll_track.addEventListener('mousedown',track_move);
    



// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ




// 3-1) scrollbar 보임 & 숨김 - 페이지 Overflow
    
    // values
    var hide_3s;
    function need_scroll(){return page_Y()>show_Y();} // page가 더 길면, true

    // functions
    function set_scroll_overflow(){
        if(need_scroll()){ // 넘치면 show
            show();
        }else{ // 짧으면 hide
            hide();
        }
    }

    function show(){
        clearTimeout(hide_3s); // hide 타이머 삭제
        scroll_style.opacity = '1'; // 즉각 보임
        scroll_style.cursor = 'cursor';
    }
    function hide(){
        if(!dragging){ // 드래그 중 숨김 방지
            hide_3s = setTimeout(function(){ // hide 타이머 시작
                scroll_style.opacity = '0';  // 숨김
                scroll_style.cursor = 'default';
            }, 3000);
        }
    }


    // ** 함수 실행 **
    set_scroll_overflow(); // 첫 설정
    window.addEventListener('resize',set_scroll_overflow); // window size 따라 변경




// 3-2) scrollbar 보임 & 숨김 - 트랙 MouseOver

// ** 함수 실행 **
    scroll_track.addEventListener('mouseover',show); // mouseover시 show
    scroll_track.addEventListener('mouseleave',hide); // mouseleave시 hide
    



// 스크롤바 ================================================================
}