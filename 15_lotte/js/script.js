/* ================================
   전체 2단메뉴 hover 기능
================================ */

const header = document.querySelector("#header");

const gnbItems = document.querySelectorAll(".gnb-item");

const depth2Wrap = document.querySelector(".depth2-wrap");


/* 주메뉴 hover → 전체 2단 메뉴 출력 */

gnbItems.forEach(function(item) {

    item.addEventListener("mouseenter", function() {

        header.classList.add("menu-open");

    });

});


/* 2단메뉴 위에서는 유지 */

depth2Wrap.addEventListener("mouseenter", function() {

    header.classList.add("menu-open");

});


/* header 전체 영역을 벗어나면 숨김 */

header.addEventListener("mouseleave", function() {

    header.classList.remove("menu-open");

});

/* =============================================
   EATZ MAIN SWIPER

   - 슬라이드 총 6개
   - 한 화면 1개
   - 버튼 클릭 시 1개씩 이동
   - 3초 자동재생
   - 무한 반복
============================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* 현재 페이지 숫자 */
        const currentPage =
            document.querySelector(".current-page");


        /* =====================================
           Swiper 생성
        ====================================== */
        const eatzSwiper =
            new Swiper(".eatzMainSwiper", {


                /* =============================
                   한 화면에 1개
                ============================== */
                slidesPerView: 1,


                /* =============================
                   한 번에 1개씩 이동
                ============================== */
                slidesPerGroup: 1,


                /* =============================
                   무한 반복
                ============================== */
                loop: true,


                /* =============================
                   움직이는 속도
                ============================== */
                speed: 700,


                /* =============================
                   3초 자동재생

                   페이지가 열리자마자
                   자동으로 시작
                ============================== */
                autoplay: {

                    delay: 3000,

                    /*
                       사용자가 좌우 버튼을
                       눌러도 자동재생 유지
                    */
                    disableOnInteraction: false,

                    /*
                       마우스를 올려도
                       자동재생 유지
                    */
                    pauseOnMouseEnter: false
                },


                /* =============================
                   좌우 버튼
                ============================== */
                navigation: {

                    nextEl: ".slide-next",

                    prevEl: ".slide-prev"

                },


                /* =============================
                   슬라이드 이벤트
                ============================== */
                on: {


                    /* 처음 로딩될 때 */
                    init: function () {

                        updatePage(this);

                    },


                    /* 슬라이드가 변경될 때 */
                    slideChange: function () {

                        updatePage(this);

                    }

                }

            });



        /* =====================================
           1 / 6 페이지 번호 변경 함수
        ====================================== */
        function updatePage(swiper) {

            /*
               loop를 사용하므로
               activeIndex가 아닌
               realIndex를 사용합니다.
            */

            const number =
                swiper.realIndex + 1;


            if (currentPage) {

                currentPage.textContent =
                    number;

            }

        }

    }
);

