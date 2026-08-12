  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwYrhSNcHpl_ybxHcoM-C17wNz7N6HhO1s2CXllmpWET_ToSe7X8KUESap8DiLw0TU/exec";

  const form = document.forms["submit-to-google-sheet"];
  const msg = document.getElementById("msg");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    fetch(scriptURL, {
      method: "POST",
      body: new FormData(form),
    })
      .then(function (response) {
        msg.innerHTML = "신청이 정상적으로 완료되었습니다.";

        setTimeout(function () {
          msg.innerHTML = "";
        }, 5000);

        form.reset();
      })
      .catch(function (error) {
        console.error("Error!", error.message);
        msg.innerHTML = "전송 중 오류가 발생했습니다.";
      });
  });
