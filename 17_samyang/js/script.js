$(function () {

    const $header = $("#header");
    const $gnb = $(".gnb");
    const $depth2 = $(".depth2-wrap");

    /*
        주메뉴에 마우스를 올리면
        전체 2단 메뉴가 위에서 아래로 내려옴
    */
    $gnb.on("mouseenter", function () {

        $depth2.stop(true, true).slideDown(300);

    });


    /*
        2단 메뉴 위에 마우스가 있어도
        메뉴가 닫히지 않도록 유지
    */
    $depth2.on("mouseenter", function () {

        $(this).stop(true, true).show();

    });


    /*
        header 전체 영역에서 마우스가 빠져나가면
        전체 2단 메뉴를 위로 접음
    */
    $header.on("mouseleave", function () {

        $depth2.stop(true, true).slideUp(300);

    });

});
/* =========================================
   Swiper 메인 슬라이드
========================================= */

const swiper = new Swiper(".mainSwiper", {

    /* -------------------------------------
       슬라이드 방향
       좌우 방향으로 움직임
    ------------------------------------- */
    direction: "horizontal",


    /* -------------------------------------
       마지막 슬라이드 이후
       다시 첫 번째 슬라이드로 이동
    ------------------------------------- */
    loop: true,


    /* -------------------------------------
       슬라이드 전환 속도
       800 = 0.8초
    ------------------------------------- */
    speed: 800,


    /* -------------------------------------
       자동 슬라이드
       페이지 로딩 후 자동 시작

       3000 = 3초마다 이동
    ------------------------------------- */
    autoplay: {
        delay: 3000,

        /* 사용자가 버튼을 눌러도
           자동 슬라이드를 계속 실행 */
        disableOnInteraction: false,

        /* 마우스를 올려도 자동 슬라이드 유지 */
        pauseOnMouseEnter: false
    },


    /* -------------------------------------
       좌우 navigation 버튼
    ------------------------------------- */
    navigation: {
        nextEl: ".slide-next",
        prevEl: ".slide-prev"
    },


    /* -------------------------------------
       슬라이드 변경될 때
       1 / 3 페이지 번호 변경
    ------------------------------------- */
    on: {

        /* Swiper가 처음 만들어졌을 때 */
        init: function () {
            updateSlideNumber(this);
        },


        /* 슬라이드가 변경되었을 때 */
        slideChange: function () {
            updateSlideNumber(this);
        }

    }

});


/* =========================================
   페이지 번호 변경 함수

   1 / 3
   2 / 3
   3 / 3
========================================= */
function updateSlideNumber(swiper) {

    const currentPage =
        document.querySelector(".current-page");

    const totalPage =
        document.querySelector(".total-page");


    /* loop 사용 시 realIndex를 사용해야
       정확한 실제 슬라이드 번호를 구할 수 있음 */
    const currentNumber =
        swiper.realIndex + 1;


    /* 실제 슬라이드 개수 */
    const totalNumber = 3;


    /* 현재 번호 변경 */
    currentPage.textContent =
        currentNumber;


    /* 전체 번호 설정 */
    totalPage.textContent =
        totalNumber;
}