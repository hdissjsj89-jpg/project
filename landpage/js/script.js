/* =========================
   ELEMENTS
========================= */

const modal = document.getElementById("requestModal");

const modalClose =
  document.getElementById("modalClose");

const openModalButtons =
  document.querySelectorAll(".open-modal");

const form =
  document.getElementById("requestForm");

const formContent =
  document.getElementById("formContent");

const successContent =
  document.getElementById("successContent");

const successClose =
  document.getElementById("successClose");

const modalDescription =
  document.getElementById("modalDescription");


/* input */

const userName =
  document.getElementById("userName");

const userEmail =
  document.getElementById("userEmail");

const userPhone =
  document.getElementById("userPhone");

const privacyAgree =
  document.getElementById("privacyAgree");

const submitBtn =
  document.getElementById("submitBtn");


/* error */

const nameError =
  document.getElementById("nameError");

const emailError =
  document.getElementById("emailError");

const phoneError =
  document.getElementById("phoneError");


/* privacy */

const privacyDetail =
  document.querySelector(".privacy-detail");

const privacyBox =
  document.getElementById("privacyBox");



/* =========================
   OPEN MODAL
========================= */

openModalButtons.forEach(function(button) {

  button.addEventListener("click", function() {

    const requestType =
      this.dataset.type;


    if (requestType === "무료 상담") {

      modalDescription.innerHTML =
        "간단한 정보를 남겨주시면<br>" +
        "AI 협업 프로그램 상담을 안내해드립니다.";

    } else {

      modalDescription.innerHTML =
        "간단한 정보를 남겨주시면<br>" +
        "AI 실무 활용 콘텐츠를 안내해드립니다.";

    }


    resetModal();

    modal.classList.add("active");

    document.body.classList.add("modal-open");

  });

});



/* =========================
   CLOSE MODAL
========================= */

function closeModal() {

  modal.classList.remove("active");

  document.body.classList.remove("modal-open");

}


modalClose.addEventListener(
  "click",
  closeModal
);


successClose.addEventListener(
  "click",
  closeModal
);



/* overlay click */

modal.addEventListener("click", function(event) {

  if (event.target === modal) {

    closeModal();

  }

});



/* ESC */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Escape" &&
      modal.classList.contains("active")
    ) {

      closeModal();

    }

  }
);



/* =========================
   PRIVACY DETAIL
========================= */

privacyDetail.addEventListener(
  "click",
  function() {

    privacyBox.classList.toggle("active");

  }
);



/* =========================
   PHONE AUTO FORMAT
========================= */

userPhone.addEventListener(
  "input",
  function() {

    let value =
      this.value.replace(/[^0-9]/g, "");

    if (value.length <= 3) {

      this.value = value;

    }

    else if (value.length <= 7) {

      this.value =
        value.slice(0, 3) +
        "-" +
        value.slice(3);

    }

    else {

      this.value =
        value.slice(0, 3) +
        "-" +
        value.slice(3, 7) +
        "-" +
        value.slice(7, 11);

    }

    checkForm();

  }
);



/* =========================
   VALIDATION
========================= */

function validateEmail(email) {

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);

}


function validatePhone(phone) {

  const phoneRegex =
    /^01[0-9]-\d{3,4}-\d{4}$/;

  return phoneRegex.test(phone);

}



/* =========================
   BUTTON ACTIVE CHECK
========================= */

function checkForm() {

  const isName =
    userName.value.trim().length >= 2;

  const isEmail =
    validateEmail(
      userEmail.value.trim()
    );

  const isPhone =
    validatePhone(
      userPhone.value.trim()
    );

  const isAgree =
    privacyAgree.checked;


  submitBtn.disabled =
    !(
      isName &&
      isEmail &&
      isPhone &&
      isAgree
    );

}



/* =========================
   INPUT EVENTS
========================= */

userName.addEventListener(
  "input",
  checkForm
);


userEmail.addEventListener(
  "input",
  checkForm
);


privacyAgree.addEventListener(
  "change",
  checkForm
);



/* =========================
   FORM SUBMIT
========================= */

form.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    let isValid = true;


    /* name */

    if (
      userName.value.trim().length < 2
    ) {

      userName.classList.add("error");

      nameError.classList.add("show");

      isValid = false;

    }

    else {

      userName.classList.remove("error");

      nameError.classList.remove("show");

    }


    /* email */

    if (
      !validateEmail(
        userEmail.value.trim()
      )
    ) {

      userEmail.classList.add("error");

      emailError.classList.add("show");

      isValid = false;

    }

    else {

      userEmail.classList.remove("error");

      emailError.classList.remove("show");

    }


    /* phone */

    if (
      !validatePhone(
        userPhone.value.trim()
      )
    ) {

      userPhone.classList.add("error");

      phoneError.classList.add("show");

      isValid = false;

    }

    else {

      userPhone.classList.remove("error");

      phoneError.classList.remove("show");

    }


    if (!privacyAgree.checked) {

      isValid = false;

    }


    if (!isValid) {
      return;
    }


    /* =========================
       서버 전송 영역
       실제 서비스에서는
       fetch(), axios 등을 사용해서
       고객 데이터를 서버에 전송합니다.
    ========================== */

    const customerData = {

      name:
        userName.value.trim(),

      email:
        userEmail.value.trim(),

      phone:
        userPhone.value.trim(),

      privacyAgree:
        privacyAgree.checked

    };


    console.log(
      "신청 고객정보:",
      customerData
    );


    /* 완료 화면 */

    formContent.classList.add("hide");

    successContent.classList.add("active");

  }
);



/* =========================
   RESET MODAL
========================= */

function resetModal() {

  form.reset();

  submitBtn.disabled = true;

  userName.classList.remove("error");

  userEmail.classList.remove("error");

  userPhone.classList.remove("error");

  nameError.classList.remove("show");

  emailError.classList.remove("show");

  phoneError.classList.remove("show");

  privacyBox.classList.remove("active");

  formContent.classList.remove("hide");

  successContent.classList.remove("active");

}



/* =========================
   NAV ACTIVE EFFECT
========================= */

const navLinks =
  document.querySelectorAll(".gnb a");


navLinks.forEach(function(link) {

  link.addEventListener(
    "click",
    function() {

      navLinks.forEach(function(item) {

        item.classList.remove("active");

      });

      this.classList.add("active");

    }
  );

});