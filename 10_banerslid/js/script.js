/* =====================================================
   Swiper 추천 상품 슬라이드

   - 총 6개
   - 한 화면 3개
   - 한번 이동할 때 1개
   - 3초마다 자동 이동
   - 무한 반복
===================================================== */

const swiper = new Swiper(".recommend-swiper", {

  /* 한 화면에 보이는 슬라이드 개수 */
  slidesPerView: 3,

  /* 한번 이동할 슬라이드 개수 */
  slidesPerGroup: 1,

  /* 카드 사이 간격 */
  spaceBetween: 24,

  /* 무한 반복 */
  loop: true,

  /* 슬라이드 이동 속도 */
  speed: 700,


  /* ===============================================
     자동 재생
     3초마다 1개씩 이동
  =============================================== */
  autoplay: {
    delay: 3000,

    /* 사용자가 버튼을 눌러도 autoplay 유지 */
    disableOnInteraction: false
  },


  /* ===============================================
     좌우 버튼
  =============================================== */
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },


  /* ===============================================
     슬라이드 변경 시작시 진행바 재실행
  =============================================== */
  on: {

    init: function () {
      startProgress();
    },

    slideChangeTransitionStart: function () {
      startProgress();
    }

  }

});


/* =====================================================
   진행 막대
===================================================== */
const progressBar = document.querySelector(".progress-bar");


/* 진행 막대 재시작 함수 */
function startProgress() {

  /* 기존 애니메이션 제거 */
  progressBar.classList.remove("active");

  /* 브라우저가 제거된 상태를 인식하도록 강제 리플로우 */
  void progressBar.offsetWidth;

  /* autoplay가 실행중인 경우만 진행 */
  if (swiper.autoplay.running) {
    progressBar.classList.add("active");
  }

}


/* =====================================================
   일시정지 / 재생
===================================================== */
const playControl = document.querySelector(".play-control");

let isPaused = false;


/* 버튼 클릭 이벤트 */
playControl.addEventListener("click", function () {

  /* 현재 자동재생 중인 경우 */
  if (!isPaused) {

    /* Swiper 자동재생 중지 */
    swiper.autoplay.stop();

    /* 버튼 이미지 재생 모양으로 변경 */
    playControl.classList.add("is-stop");

    /* 접근성 텍스트 변경 */
    playControl.setAttribute(
      "aria-label",
      "슬라이드 재생"
    );

    /* 진행 막대 멈춤 */
    progressBar.classList.remove("active");

    isPaused = true;

  }

  /* 현재 멈춰있는 경우 */
  else {

    /* 자동재생 다시 시작 */
    swiper.autoplay.start();

    /* 버튼 이미지 일시정지 모양으로 변경 */
    playControl.classList.remove("is-stop");

    /* 접근성 텍스트 변경 */
    playControl.setAttribute(
      "aria-label",
      "슬라이드 일시정지"
    );

    /* 진행 막대 다시 실행 */
    startProgress();

    isPaused = false;

  }

});