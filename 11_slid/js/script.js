/* ==================================================
   페이지 번호 요소
================================================== */

const currentPage = document.querySelector(".slide-page .current");
const totalPage = document.querySelector(".slide-page .total");


/* ==================================================
   전체 슬라이드 개수
================================================== */

const TOTAL_SLIDE = 6;

totalPage.textContent = TOTAL_SLIDE;


/* ==================================================
   Swiper 슬라이드 실행
================================================== */

const mainSwiper = new Swiper(".mainSwiper", {

  /* 한 화면에 슬라이드 1개 */
  slidesPerView: 1,


  /* 한 번 이동할 때 1개씩 이동 */
  slidesPerGroup: 1,


  /* 무한 반복 */
  loop: true,


  /* 슬라이드 이동 애니메이션 속도 */
  speed: 800,


  /* ==================================================
     자동 슬라이드

     웹페이지가 실행되면 바로 동작
     3초마다 다음 슬라이드로 이동
  ================================================== */

  autoplay: {

    delay: 3000,

    disableOnInteraction: false,

    /* 마우스가 올라가도 자동재생 유지 */
    pauseOnMouseEnter: false
  },


  /* ==================================================
     좌우 버튼
  ================================================== */

  navigation: {

    nextEl: ".slide-next",

    prevEl: ".slide-prev"
  },


  /* ==================================================
     슬라이드 이벤트
  ================================================== */

  on: {

    /* 처음 페이지가 실행되었을 때 */
    init: function () {

      updatePageNumber(this);
    },


    /* 슬라이드가 변경될 때 */
    slideChange: function () {

      updatePageNumber(this);
    }

  }

});


/* ==================================================
   현재 슬라이드 번호 표시 함수
================================================== */

function updatePageNumber(swiper) {

  /*
    loop:true 설정에서는
    activeIndex 대신 realIndex를 사용해야
    실제 슬라이드 번호를 가져올 수 있습니다.
  */

  const realNumber = swiper.realIndex + 1;

  currentPage.textContent = realNumber;
}