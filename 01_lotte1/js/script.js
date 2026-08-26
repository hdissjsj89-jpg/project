$(document).ready(function () {

    /* ======================================================
       LOTTE EATZ 전체 2단 메뉴

       기능
       1. 주메뉴에 마우스가 올라가면 전체 2단메뉴 표시
       2. slideDown()으로 위 → 아래 펼쳐짐
       3. Header 영역을 벗어나면 slideUp()
       4. 메뉴 이동 중 깜빡이지 않도록 stop() 처리
    ====================================================== */

    const $header = $("#header");
    const $gnb = $(".gnb");
    const $megaMenu = $(".mega-menu");

    let closeTimer;


    /* ======================================================
       메뉴 열기 함수
    ====================================================== */
    function openMegaMenu() {

        // 이전 예약된 닫기 함수 제거
        clearTimeout(closeTimer);

        /*
            실행 중인 jQuery 애니메이션 제거 후
            위에서 아래로 부드럽게 표시
        */
        $megaMenu
            .stop(true, true)
            .slideDown(280);

        // header에 메뉴 활성화 클래스 추가
        $header.addClass("menu-open");
    }


    /* ======================================================
       메뉴 닫기 함수
    ====================================================== */
    function closeMegaMenu() {

        /*
            주메뉴에서 2단메뉴로 마우스를 이동할 때
            순간적으로 닫히는 현상을 방지하기 위해
            100ms 정도 여유를 줍니다.
        */
        closeTimer = setTimeout(function () {

            $megaMenu
                .stop(true, true)
                .slideUp(250);

            $header.removeClass("menu-open");

        }, 100);
    }


    /* ======================================================
       주메뉴에 마우스를 올렸을 때
       전체 2단 메뉴 OPEN
    ====================================================== */
    $gnb.on("mouseenter", function () {

        openMegaMenu();

    });


    /* ======================================================
       주메뉴에서 마우스가 빠졌을 때

       바로 닫지 않고 closeMegaMenu 함수 실행
    ====================================================== */
    $gnb.on("mouseleave", function () {

        closeMegaMenu();

    });


    /* ======================================================
       2단메뉴에 마우스가 들어왔을 때

       닫히려던 timeout을 취소하여
       메뉴가 계속 열린 상태를 유지
    ====================================================== */
    $megaMenu.on("mouseenter", function () {

        clearTimeout(closeTimer);

        $megaMenu.stop(true, true);

    });


    /* ======================================================
       2단메뉴에서 완전히 마우스가 빠졌을 때
       slideUp으로 닫기
    ====================================================== */
    $megaMenu.on("mouseleave", function () {

        closeMegaMenu();

    });


    /* ======================================================
       ESC 키를 누르면 메뉴 닫기
    ====================================================== */
    $(document).on("keydown", function (event) {

        if (event.key === "Escape") {

            clearTimeout(closeTimer);

            $megaMenu
                .stop(true, true)
                .slideUp(250);

            $header.removeClass("menu-open");

        }

    });

});

/* ==================================================
   메인배너 Swiper
================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* 현재 페이지 숫자 */
  const currentPage =
    document.querySelector(".current-page");

  /* 전체 페이지 숫자 */
  const totalPage =
    document.querySelector(".total-page");


  /* ==================================================
     Swiper 생성
  ================================================== */
  const mainBannerSwiper = new Swiper(
    ".mainBannerSwiper",
    {

      /*
        가로 슬라이드
      */
      direction: "horizontal",


      /*
        한 화면에 한 장
      */
      slidesPerView: 1,


      /*
        클릭시 한 장씩 이동
      */
      slidesPerGroup: 1,


      /*
        무한 반복
      */
      loop: true,


      /*
        슬라이드 이동속도
      */
      speed: 700,


      /*
        웹페이지 로딩 즉시
        자동재생 시작
      */
      autoplay: {

        /*
          3초마다 자동 이동
        */
        delay: 3000,

        /*
          사용자가 버튼을 눌러도
          자동재생 계속 유지
        */
        disableOnInteraction: false,

        /*
          마우스를 올리면
          자동재생을 멈추지 않음
        */
        pauseOnMouseEnter: false

      },


      /* ==================================================
         좌우버튼
      ================================================== */
      navigation: {

        nextEl: ".banner-next",

        prevEl: ".banner-prev"

      },


      /* ==================================================
         Swiper 시작 후
      ================================================== */
      on: {

        init: function () {

          /*
            총 슬라이드는 3장
          */
          totalPage.textContent = "3";


          /*
            첫 페이지
          */
          currentPage.textContent =
            this.realIndex + 1;

        },


        /* ==================================================
           슬라이드가 바뀔 때
           1 / 3
           2 / 3
           3 / 3
           자동 변경
        ================================================== */
        slideChange: function () {

          currentPage.textContent =
            this.realIndex + 1;

        }

      }

    }
  );

});


/* =========================================
   쿠폰 Swiper
========================================= */
const couponSwiper = new Swiper(".couponSwiper", {

    /* -----------------------------------------
       한 화면에 정확히 4개
    ----------------------------------------- */
    slidesPerView: 4,


    /* -----------------------------------------
       버튼 클릭 시 한 장씩 이동
    ----------------------------------------- */
    slidesPerGroup: 1,


    /* -----------------------------------------
       카드 사이 간격

       카드 273 × 4 = 1092
       gap 16 × 3 = 48

       총 1140px
    ----------------------------------------- */
    spaceBetween: 16,


    /* -----------------------------------------
       무한 반복 사용하지 않음

       오른쪽에 복제 카드가 나타나는 현상 방지
    ----------------------------------------- */
    loop: false,


    /* -----------------------------------------
       슬라이드 속도
    ----------------------------------------- */
    speed: 500,


    /* -----------------------------------------
       좌우 버튼
    ----------------------------------------- */
    navigation: {
        nextEl: ".coupon-next",
        prevEl: ".coupon-prev"
    },


    /* -----------------------------------------
       초기화 및 슬라이드 변경
    ----------------------------------------- */
    on: {

        init: function () {
            updateCouponPage(this);
        },

        slideChange: function () {
            updateCouponPage(this);
        }

    }

});


/* =========================================
   1 / 8 페이지 숫자 표시
========================================= */
function updateCouponPage(swiper) {

    /* 현재 기준 슬라이드 */
    const current = swiper.activeIndex + 1;

    /* 전체 쿠폰 개수 */
    const total = swiper.slides.length;


    document.querySelector(".coupon-current").textContent =
        current;

    document.querySelector(".coupon-total").textContent =
        total;

}

/* =========================================
   Swiper 생성
========================================= */
const brandSwiper = new Swiper(".brandSwiper", {

    /* -----------------------------------------
       한 화면에 5개 카드 표시
    ----------------------------------------- */
    slidesPerView: 5,


    /* -----------------------------------------
       한 번 이동할 때 1개
    ----------------------------------------- */
    slidesPerGroup: 1,


    /* -----------------------------------------
       카드 간격
    ----------------------------------------- */
    spaceBetween: 25,


    /* -----------------------------------------
       계속 반복
    ----------------------------------------- */
    loop: true,


    /* -----------------------------------------
       2초마다 자동 이동
    ----------------------------------------- */
    autoplay: {

        delay: 2000,

        /* 버튼 클릭 후에도 자동재생 계속 */
        disableOnInteraction: false,

        pauseOnMouseEnter: false
    },


    /* -----------------------------------------
       부드러운 이동 속도
    ----------------------------------------- */
    speed: 700,


    /* -----------------------------------------
       좌우 버튼
    ----------------------------------------- */
    navigation: {

        nextEl: ".brand-next",

        prevEl: ".brand-prev"

    },


    /* -----------------------------------------
       이벤트
    ----------------------------------------- */
    on: {

        /* 처음 실행 */
        init: function () {

            updateCenterBrand(this);

            updateBrandProgress(this);

        },


        /* 슬라이드 이동 후 */
        slideChangeTransitionEnd: function () {

            updateCenterBrand(this);

            updateBrandProgress(this);

        }

    }

});


/* =========================================
   가운데 카드 활성화 함수
========================================= */
function updateCenterBrand(swiper) {

    /* 모든 슬라이드 가져오기 */
    const slides = swiper.slides;


    /* -----------------------------------------
       모든 카드 기본상태 복원
    ----------------------------------------- */
    slides.forEach(function (slide) {

        /* 중앙 활성 클래스 제거 */
        slide.classList.remove("is-center");


        /* 이미지 찾기 */
        const img = slide.querySelector(".brand-bg");


        if (!img) {
            return;
        }


        /* 기본 브랜드 이미지 */
        const normalImage =
            img.getAttribute("data-normal");


        /*
            중앙에서 벗어난 카드의 이미지는
            다시 영문/한글 브랜드 로고 이미지로 변경
        */
        if (
            normalImage &&
            img.src.indexOf(normalImage) === -1
        ) {

            smoothImageChange(
                img,
                normalImage
            );

        }

    });


    /* =========================================
       한 화면에 5개이므로
       가운데 카드는 activeIndex + 2
    ========================================= */
    const centerIndex =
        swiper.activeIndex + 2;


    const centerSlide =
        slides[centerIndex];


    if (!centerSlide) {
        return;
    }


    /* 중앙 활성 클래스 */
    centerSlide.classList.add("is-center");


    const centerImg =
        centerSlide.querySelector(".brand-bg");


    if (!centerImg) {
        return;
    }


    /*
        중앙 카드가 활성화될 때 사용하는
        음식 + 배경 이미지
    */
    const activeImage =
        centerImg.getAttribute("data-active");


    /*
        기본 로고 이미지에서
        음식 이미지로 자연스럽게 변경
    */
    if (activeImage) {

        smoothImageChange(
            centerImg,
            activeImage
        );

    }

}


/* =========================================
   이미지 부드럽게 교체하는 함수

   바로 src를 변경하면 이미지가
   순간적으로 바뀌어 보일 수 있으므로

   1. opacity 감소
   2. 이미지 변경
   3. opacity 복원

   순서로 실행
========================================= */
function smoothImageChange(img, newSrc) {

    /* 이미 같은 이미지면 실행하지 않음 */
    if (img.getAttribute("src") === newSrc) {

        return;

    }


    /* 먼저 투명하게 */
    img.style.opacity = "0";


    setTimeout(function () {

        /* 이미지 교체 */
        img.setAttribute(
            "src",
            newSrc
        );


        /*
            이미지가 준비된 다음
            다시 부드럽게 나타남
        */
        requestAnimationFrame(function () {

            img.style.opacity = "1";

        });

    }, 250);

}


/* =========================================
   진행상태바 + 1 / 10
========================================= */
function updateBrandProgress(swiper) {

    /*
       실제 브랜드 순서
       loop 사용 시 realIndex 사용
    */
    const current =
        swiper.realIndex + 1;


    const total = 10;


    /* =====================================
       숫자 변경
    ====================================== */
    document
        .querySelector(".brand-current")
        .textContent = current;


    document
        .querySelector(".brand-total")
        .textContent = total;


    /* =====================================
       진행상태바 변경
    ====================================== */
    const progressItems =
        document.querySelectorAll(
            ".progress-item"
        );


    progressItems.forEach(
        function (item, index) {

            /*
               현재 번호와 일치하는 점만
               길게 활성화
            */
            if (index === current - 1) {

                item.classList.add(
                    "active"
                );

            } else {

                item.classList.remove(
                    "active"
                );

            }

        }
    );

}

/* =========================================
   EATZ 쇼핑 SWIPER
========================================= */
const shoppingSwiper = new Swiper(".shoppingSwiper", {

    /* =====================================
       한 화면에 상품 5개
    ====================================== */
    slidesPerView: 5,


    /* =====================================
       한 번 클릭할 때 1개씩 이동
    ====================================== */
    slidesPerGroup: 1,


    /* =====================================
       카드 사이 간격 : 20px
    ====================================== */
    spaceBetween: 20,


    /* =====================================
       무한 반복

       전체 8개의 상품을 계속 순환
    ====================================== */
    loop: true,


    /* =====================================
       슬라이드 이동 속도
    ====================================== */
    speed: 500,


    /* =====================================
       좌우 버튼
    ====================================== */
    navigation: {

        nextEl: ".shopping-next",

        prevEl: ".shopping-prev"

    },


    /* =====================================
       슬라이드 이벤트
    ====================================== */
    on: {

        /* 처음 실행 */
        init: function () {

            updateShoppingPage(this);

        },


        /* 슬라이드가 변경될 때 */
        slideChange: function () {

            updateShoppingPage(this);

        }

    }

});


/* =========================================
   현재 페이지 표시

   1 / 8
   2 / 8
   ...
   8 / 8
========================================= */
function updateShoppingPage(swiper) {

    /* loop 사용 시 실제 상품 번호 */
    const current =
        swiper.realIndex + 1;


    const total = 8;


    document
        .querySelector(".shopping-current")
        .textContent = current;


    document
        .querySelector(".shopping-total")
        .textContent = total;

}


/* =========================================
   상품 카드 클릭 이벤트

   각 카드의 data-link 주소로 화면 변경
========================================= */
const shoppingCards =
    document.querySelectorAll(".shopping-card");


shoppingCards.forEach(function (card) {

    /* =====================================
       마우스 클릭
    ====================================== */
    card.addEventListener(
        "click",
        function () {

            const link =
                this.dataset.link;


            if (link) {

                /*
                   해당 상품 상세 페이지로
                   화면을 변경합니다.
                */
                window.location.href = link;

            }

        }
    );


    /* =====================================
       키보드 접근성

       Enter 키로도 상세페이지 이동
    ====================================== */
    card.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();


                const link =
                    this.dataset.link;


                if (link) {

                    window.location.href =
                        link;

                }

            }

        }
    );

});


/* =========================================
   MD / 원두 탭 클릭
========================================= */
const shoppingTabs =
    document.querySelectorAll(".shopping-tab");


shoppingTabs.forEach(function (tab) {

    tab.addEventListener(
        "click",
        function () {

            /* 모든 active 제거 */
            shoppingTabs.forEach(
                function (item) {

                    item.classList.remove(
                        "active"
                    );

                    item.setAttribute(
                        "aria-selected",
                        "false"
                    );

                }
            );


            /* 클릭한 탭만 활성 */
            this.classList.add(
                "active"
            );

            this.setAttribute(
                "aria-selected",
                "true"
            );

        }
    );

});

$(function () {

    /* =========================================
       FAMILY SITE 요소
    ========================================== */
    const $familySite =
        $(".family-site");

    const $familyButton =
        $(".family-btn");

    const $familyClose =
        $(".family-close");


    /* =========================================
       FAMILY SITE 버튼 클릭

       한 번 클릭하면 위로 열리고
       다시 클릭하면 닫힘
    ========================================== */
    $familyButton.on(
        "click",
        function () {

            /* open 클래스 토글 */
            $familySite.toggleClass(
                "open"
            );


            /* 현재 열림 상태 */
            const isOpen =
                $familySite.hasClass(
                    "open"
                );


            /* 웹접근성 */
            $familyButton.attr(
                "aria-expanded",
                isOpen
            );

        }
    );


    /* =========================================
       X 버튼 클릭
    ========================================== */
    $familyClose.on(
        "click",
        function () {

            $familySite.removeClass(
                "open"
            );


            $familyButton.attr(
                "aria-expanded",
                "false"
            );

        }
    );


    /* =========================================
       ESC 키를 누르면 닫기
       웹접근성 처리
    ========================================== */
    $(document).on(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                $familySite.hasClass("open")
            ) {

                $familySite.removeClass(
                    "open"
                );


                $familyButton.attr(
                    "aria-expanded",
                    "false"
                );


                /* 버튼으로 포커스 복귀 */
                $familyButton.focus();

            }

        }
    );

});