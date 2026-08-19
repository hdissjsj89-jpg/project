$(function () {

  // Family Site 버튼 클릭
  $(".family-btn").click(function () {

    // 한 번 클릭하면 보여지고
    // 다시 클릭하면 숨겨짐
    $(".family-list").stop().slideToggle(300);

    // 화살표 방향 변경용 클래스
    $(".family-wrap").toggleClass("active");

  });

});