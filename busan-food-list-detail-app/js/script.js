/* =========================================================
   부산맛지도
   HTML + CSS + JavaScript
   JavaScript 파일은 이 파일 하나만 사용합니다.
========================================================= */


/* =========================================================
   1. API 인증키 입력
========================================================= */

/*
  공공데이터포털 부산맛집정보 서비스 인증키

  - Decoding 인증키 또는 Encoding 인증키 모두 사용 가능
  - Encoding 인증키에는 %2F, %3D 같은 문자가 들어있을 수 있습니다.
*/
const PUBLIC_DATA_SERVICE_KEY =
  "BVmM7VKpLpUGZ3kRPiZFmWK%2F%2BXBJoYafxo3vubSfZ8xmcpkelBKDbeKDY5SC1lqW1gHdau%2Bv8IXS8TzaZXQx7Q%3D%3D";


/*
  Kakao Developers의 JavaScript 키

  - REST API 키가 아닙니다.
  - Kakao Developers에서 실제 실행 도메인도 등록해야 합니다.
*/
const KAKAO_MAP_APP_KEY =
  "f3f495721e788fb9f94d3f3ac0af044c";


/* =========================================================
   2. 부산맛집 API 설정
========================================================= */

const API_BASE_URL =
  "https://apis.data.go.kr/6260000/FoodService";

const LANGUAGE_API = {
  kr: "getFoodKr",
  en: "getFoodEn",
  ja: "getFoodJa",
  zhs: "getFoodZhs",
  zht: "getFoodZht"
};


/* =========================================================
   3. 앱 상태
========================================================= */

let restaurants = [];
let filteredRestaurants = [];

let currentLanguage = "kr";
let selectedArea = "전체";
let visibleCount = 10;

let apiConnected = false;
let apiLastError = "";
let apiRawData = null;
let apiDebugUrl = "";

let kakaoSdkReady = false;


/* =========================================================
   4. 샘플 데이터
   실제 API가 실패해도 검색 UI는 확인할 수 있습니다.
========================================================= */

const sampleRestaurants = [
  {
    UC_SEQ: "70",
    MAIN_TITLE: "만드리곤드레밥",
    GUGUN_NM: "강서구",
    LAT: "35.177387",
    LNG: "128.9524",
    ADDR1: "강서구 공항앞길 85번길 13",
    ADDR2: "",
    CNTCT_TEL: "051-941-3669",
    HOMEPAGE_URL: "",
    USAGE_DAY_WEEK_AND_TIME:
      "11:00-21:00 (20:00 라스트오더)",
    RPRSNTV_MENU:
      "돌솥곤드레정식, 단호박오리훈제",
    MAIN_IMG_NORMAL: "",
    MAIN_IMG_THUMB: "",
    ITEMCNTNTS:
      "곤드레밥에는 일반적으로 건조 곤드레나물이 사용되는데, 이곳은 생 곤드레나물을 사용하여 돌솥밥을 만든다. 된장찌개와 함께 열 가지가 넘는 반찬이 제공되는 돌솥곤드레정식이 인기있다."
  },
  {
    UC_SEQ: "77",
    MAIN_TITLE: "민물가든",
    GUGUN_NM: "강서구",
    LAT: "35.160496",
    LNG: "128.89459",
    ADDR1: "강서구 둔치중앙길5(봉림동)",
    ADDR2: "",
    CNTCT_TEL: "051-971-8428",
    HOMEPAGE_URL: "",
    USAGE_DAY_WEEK_AND_TIME: "11:00-22:00",
    RPRSNTV_MENU: "묵은지붕어조림, 붕어찜",
    MAIN_IMG_NORMAL: "",
    MAIN_IMG_THUMB: "",
    ITEMCNTNTS:
      "오랜 전통을 가진 찜 전문점으로 다양한 민물고기 요리를 맛볼 수 있다."
  },
  {
    UC_SEQ: "201",
    MAIN_TITLE: "가야할매밀면",
    GUGUN_NM: "연제구",
    LAT: "35.1900",
    LNG: "129.0800",
    ADDR1: "부산 연제구 월드컵대로 145번길 32",
    ADDR2: "",
    CNTCT_TEL: "",
    HOMEPAGE_URL: "",
    USAGE_DAY_WEEK_AND_TIME: "",
    RPRSNTV_MENU: "물밀면, 비빔밀면",
    MAIN_IMG_NORMAL: "",
    MAIN_IMG_THUMB: "",
    ITEMCNTNTS: "부산의 대표 음식인 밀면을 맛볼 수 있는 곳이다."
  },
  {
    UC_SEQ: "202",
    MAIN_TITLE: "국제밀면본점",
    GUGUN_NM: "연제구",
    LAT: "35.1800",
    LNG: "129.0750",
    ADDR1: "연제구 중앙대로1235번길 23-6",
    ADDR2: "",
    CNTCT_TEL: "",
    HOMEPAGE_URL: "",
    USAGE_DAY_WEEK_AND_TIME: "",
    RPRSNTV_MENU: "밀면, 비빔밀면",
    MAIN_IMG_NORMAL: "",
    MAIN_IMG_THUMB: "",
    ITEMCNTNTS: "밀면과 비빔밀면을 즐길 수 있는 부산 맛집이다."
  },
  {
    UC_SEQ: "203",
    MAIN_TITLE: "가야밀면",
    GUGUN_NM: "중구",
    LAT: "35.1050",
    LNG: "129.0320",
    ADDR1: "중구 광복로 56-14",
    ADDR2: "",
    CNTCT_TEL: "",
    HOMEPAGE_URL: "",
    USAGE_DAY_WEEK_AND_TIME: "",
    RPRSNTV_MENU: "밀면, 비빔밀면",
    MAIN_IMG_NORMAL: "",
    MAIN_IMG_THUMB: "",
    ITEMCNTNTS: "시원한 밀면을 판매하는 음식점이다."
  },
  {
    UC_SEQ: "204",
    MAIN_TITLE: "거인통닭",
    GUGUN_NM: "중구",
    LAT: "35.1020",
    LNG: "129.0290",
    ADDR1: "중구 중구로47번길34",
    ADDR2: "",
    CNTCT_TEL: "",
    HOMEPAGE_URL: "",
    USAGE_DAY_WEEK_AND_TIME: "",
    RPRSNTV_MENU: "후라이드치킨",
    MAIN_IMG_NORMAL: "",
    MAIN_IMG_THUMB: "",
    ITEMCNTNTS: "부산에서 유명한 통닭 전문점이다."
  },
  {
    UC_SEQ: "205",
    MAIN_TITLE: "부산곰장어맛집 성일집",
    GUGUN_NM: "중구",
    LAT: "35.1000",
    LNG: "129.0300",
    ADDR1: "중구 대교로 103",
    ADDR2: "",
    CNTCT_TEL: "",
    HOMEPAGE_URL: "",
    USAGE_DAY_WEEK_AND_TIME: "",
    RPRSNTV_MENU: "소금구이, 양념구이",
    MAIN_IMG_NORMAL: "",
    MAIN_IMG_THUMB: "",
    ITEMCNTNTS: "곰장어 소금구이와 양념구이를 맛볼 수 있다."
  },
  {
    UC_SEQ: "74",
    MAIN_TITLE: "길스시",
    GUGUN_NM: "부산진구",
    LAT: "35.156452",
    LNG: "129.05461",
    ADDR1: "부산진구 부전로 71",
    ADDR2: "",
    CNTCT_TEL: "051-804-3690",
    HOMEPAGE_URL: "https://gilsushi.modoo.at/",
    USAGE_DAY_WEEK_AND_TIME: "12:00-22:00",
    RPRSNTV_MENU: "초밥, 생선회코스",
    MAIN_IMG_NORMAL: "",
    MAIN_IMG_THUMB: "",
    ITEMCNTNTS: "부산 서면에 위치한 스시 전문점이다."
  }
];


/* =========================================================
   5. 앱 시작
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    bindEvents();
    renderLoading();

    await Promise.allSettled([
      loadRestaurantData(),
      loadKakaoSdk()
    ]);
  }
);


/* =========================================================
   6. 공공데이터 인증키 인코딩 처리
========================================================= */

function getServiceKeyForUrl() {
  const key =
    String(
      PUBLIC_DATA_SERVICE_KEY || ""
    ).trim();

  /*
    이미 Encoding 된 인증키인 경우
    다시 encodeURIComponent를 적용하지 않습니다.
  */
  if (/%[0-9A-Fa-f]{2}/.test(key)) {
    return key;
  }

  return encodeURIComponent(key);
}


/* =========================================================
   7. 부산맛집 API 호출
========================================================= */

async function loadRestaurantData() {
  apiConnected = false;
  apiLastError = "";
  apiRawData = null;

  if (
    !PUBLIC_DATA_SERVICE_KEY ||
    PUBLIC_DATA_SERVICE_KEY.includes(
      "여기에_"
    )
  ) {
    useSampleData(
      "공공데이터 인증키가 입력되지 않았습니다."
    );

    return;
  }

  try {
    const endpoint =
      LANGUAGE_API[currentLanguage];

    const url =
      `${API_BASE_URL}/${endpoint}` +
      `?serviceKey=${getServiceKeyForUrl()}` +
      `&pageNo=1` +
      `&numOfRows=300` +
      `&resultType=json`;

    apiDebugUrl =
      `${API_BASE_URL}/${endpoint}` +
      `?serviceKey=***숨김***` +
      `&pageNo=1&numOfRows=300&resultType=json`;

    const response =
      await fetch(url, {
        method: "GET",
        headers: {
          Accept:
            "application/json, text/plain, */*"
        }
      });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    const responseText =
      await response.text();

    if (!responseText.trim()) {
      throw new Error(
        "API 응답이 비어 있습니다."
      );
    }

    let data;

    try {
      data =
        JSON.parse(
          responseText
        );
    } catch {
      throw new Error(
        "API가 JSON을 반환하지 않았습니다."
      );
    }

    apiRawData = data;

    const apiError =
      readApiError(data);

    if (apiError) {
      throw new Error(apiError);
    }

    const items =
      extractItems(data);

    if (!items.length) {
      throw new Error(
        "API 응답에서 맛집 item 목록을 찾을 수 없습니다."
      );
    }

    restaurants =
      items.map(
        normalizeRestaurant
      );

    filteredRestaurants =
      [...restaurants];

    apiConnected = true;

    renderAll();

    showToast(
      `실제 부산맛집 ${restaurants.length}건을 불러왔습니다.`
    );

  } catch (error) {
    console.error(
      "부산맛집 API 오류:",
      error
    );

    apiLastError =
      error.message ||
      "알 수 없는 API 오류";

    useSampleData(
      apiLastError
    );
  }
}


/* =========================================================
   8. API 오류 확인
========================================================= */

function readApiError(data) {
  const code =
    data?.response?.header?.resultCode ??
    data?.header?.resultCode ??
    data?.cmmMsgHeader?.returnReasonCode;

  const message =
    data?.response?.header?.resultMsg ??
    data?.header?.resultMsg ??
    data?.cmmMsgHeader?.errMsg;

  if (
    code !== undefined &&
    String(code) !== "00" &&
    String(code) !== "0"
  ) {
    return `${code} ${message || "API 오류"}`;
  }

  return "";
}


/* =========================================================
   9. 실제 JSON item 추출
========================================================= */

function extractItems(data) {
  const languageKey =
    LANGUAGE_API[currentLanguage];

  /*
    부산맛집 API에서 흔히 사용하는 구조
    data.getFoodKr.item
  */
  if (
    data?.[languageKey]?.item
  ) {
    return toArray(
      data[languageKey].item
    );
  }

  /*
    공공데이터 표준형
  */
  if (
    data?.response?.body?.items?.item
  ) {
    return toArray(
      data.response.body.items.item
    );
  }

  if (
    data?.[languageKey]?.body?.items?.item
  ) {
    return toArray(
      data[languageKey].body.items.item
    );
  }

  if (
    data?.items?.item
  ) {
    return toArray(
      data.items.item
    );
  }

  if (data?.item) {
    return toArray(data.item);
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
}


function toArray(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value)
    ? value
    : [value];
}


/* =========================================================
   10. 데이터 정규화
========================================================= */

function normalizeRestaurant(item) {
  return {
    UC_SEQ:
      item?.UC_SEQ ??
      item?.ucSeq ??
      item?.SEQ ??
      item?.MAIN_TITLE ??
      "",

    MAIN_TITLE:
      item?.MAIN_TITLE ??
      item?.mainTitle ??
      item?.PLACE ??
      "이름 없음",

    GUGUN_NM:
      item?.GUGUN_NM ??
      item?.gugunNm ??
      "",

    LAT:
      item?.LAT ??
      item?.lat ??
      "",

    LNG:
      item?.LNG ??
      item?.lng ??
      "",

    ADDR1:
      item?.ADDR1 ??
      item?.addr1 ??
      "",

    ADDR2:
      item?.ADDR2 ??
      item?.addr2 ??
      "",

    CNTCT_TEL:
      item?.CNTCT_TEL ??
      item?.cntctTel ??
      "",

    HOMEPAGE_URL:
      item?.HOMEPAGE_URL ??
      item?.homepageUrl ??
      "",

    USAGE_DAY_WEEK_AND_TIME:
      item?.USAGE_DAY_WEEK_AND_TIME ??
      item?.usageDayWeekAndTime ??
      "",

    RPRSNTV_MENU:
      item?.RPRSNTV_MENU ??
      item?.rprsntvMenu ??
      "대표 메뉴 정보 없음",

    MAIN_IMG_NORMAL:
      item?.MAIN_IMG_NORMAL ??
      item?.mainImgNormal ??
      "",

    MAIN_IMG_THUMB:
      item?.MAIN_IMG_THUMB ??
      item?.mainImgThumb ??
      "",

    ITEMCNTNTS:
      item?.ITEMCNTNTS ??
      item?.itemcntnts ??
      item?.TITLE ??
      "상세 정보가 없습니다."
  };
}


/* =========================================================
   11. 이미지 URL 후보 생성
========================================================= */

function getImageCandidates(
  restaurant,
  preferNormal = false
) {
  const sourceList =
    preferNormal
      ? [
          restaurant.MAIN_IMG_NORMAL,
          restaurant.MAIN_IMG_THUMB
        ]
      : [
          restaurant.MAIN_IMG_THUMB,
          restaurant.MAIN_IMG_NORMAL
        ];

  const result = [];

  sourceList
    .filter(Boolean)
    .forEach(raw => {
      const url =
        String(raw).trim();

      if (!url) {
        return;
      }

      /*
        전체 URL
      */
      if (
        /^https?:\/\//i.test(url)
      ) {
        result.push(url);

        if (
          url.startsWith(
            "http://"
          )
        ) {
          result.push(
            "https://" +
              url.slice(7)
          );
        }

        return;
      }

      /*
        상대경로
      */
      const path =
        url.startsWith("/")
          ? url
          : "/" + url;

      result.push(
        "https://www.visitbusan.net" +
          path
      );

      result.push(
        "http://www.visitbusan.net" +
          path
      );

      result.push(path);
    });

  result.push(
    "./images/no-image.png"
  );

  return [
    ...new Set(result)
  ];
}


/* =========================================================
   12. 이미지 자동 대체
========================================================= */

function setSmartImage(
  imageElement,
  candidates
) {
  if (!imageElement) {
    return;
  }

  let index = 0;

  const next = () => {
    if (
      index >= candidates.length
    ) {
      imageElement.onerror =
        null;

      imageElement.src =
        "./images/no-image.png";

      return;
    }

    const target =
      candidates[index];

    index++;

    imageElement.src =
      target;
  };

  imageElement.onerror =
    next;

  next();
}


/* =========================================================
   13. 샘플 데이터 사용
========================================================= */

function useSampleData(reason) {
  apiConnected = false;
  apiLastError = reason;

  restaurants =
    [...sampleRestaurants];

  filteredRestaurants =
    [...restaurants];

  renderAll();

  showToast(
    "실제 API 대신 샘플 데이터로 실행합니다."
  );
}


/* =========================================================
   14. 화면 전체 렌더링
========================================================= */

function renderAll() {
  renderAreaFilter();
  renderRestaurantList();
  renderFavoriteList();
}


/* =========================================================
   15. 로딩
========================================================= */

function renderLoading() {
  document.getElementById(
    "restaurantList"
  ).innerHTML = `
    <div class="empty-state">
      <strong>맛집 정보를 불러오는 중입니다.</strong>
      잠시만 기다려주세요.
    </div>
  `;
}


/* =========================================================
   16. 지역 필터
========================================================= */

function renderAreaFilter() {
  const container =
    document.getElementById(
      "areaFilter"
    );

  const areas = [
    "전체",
    ...new Set(
      restaurants
        .map(
          restaurant =>
            restaurant.GUGUN_NM
        )
        .filter(Boolean)
    )
  ];

  container.innerHTML = "";

  areas.forEach(area => {
    const button =
      document.createElement(
        "button"
      );

    button.type = "button";

    button.className =
      "area-btn" +
      (
        selectedArea === area
          ? " active"
          : ""
      );

    button.textContent =
      area;

    button.addEventListener(
      "click",
      () => {
        selectedArea = area;
        visibleCount = 10;
        applySearch();
      }
    );

    container.appendChild(
      button
    );
  });
}


/* =========================================================
   17. 검색
========================================================= */

function applySearch() {
  const keyword =
    normalizeText(
      document
        .getElementById(
          "searchInput"
        )
        .value
    );

  filteredRestaurants =
    restaurants.filter(
      restaurant => {
        const areaMatch =
          selectedArea ===
            "전체" ||
          normalizeText(
            restaurant.GUGUN_NM
          ) ===
            normalizeText(
              selectedArea
            );

        const text =
          normalizeText(
            [
              restaurant.MAIN_TITLE,
              restaurant.GUGUN_NM,
              restaurant.RPRSNTV_MENU,
              restaurant.ADDR1,
              restaurant.ADDR2,
              restaurant.ITEMCNTNTS
            ]
              .filter(
                value =>
                  value !== null &&
                  value !== undefined
              )
              .join(" ")
          );

        const keywordMatch =
          !keyword ||
          text.includes(keyword);

        return (
          areaMatch &&
          keywordMatch
        );
      }
    );

  visibleCount = 10;

  renderAreaFilter();
  renderRestaurantList();
  renderSearchSummary(keyword);
}


/* =========================================================
   18. 검색 텍스트 정규화
========================================================= */

function normalizeText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}


/* =========================================================
   19. 검색 결과 안내
========================================================= */

function renderSearchSummary(keyword) {
  const summary =
    document.getElementById(
      "searchSummary"
    );

  if (
    !keyword &&
    selectedArea === "전체"
  ) {
    summary.hidden = true;
    summary.textContent = "";
    return;
  }

  const pieces = [];

  if (keyword) {
    pieces.push(
      `검색어 "${keyword}"`
    );
  }

  if (
    selectedArea !== "전체"
  ) {
    pieces.push(
      `지역 "${selectedArea}"`
    );
  }

  summary.hidden = false;

  summary.textContent =
    `${pieces.join(" + ")} / ${filteredRestaurants.length}개 결과`;
}


/* =========================================================
   20. 검색 결과 리스트
========================================================= */

function renderRestaurantList() {
  const container =
    document.getElementById(
      "restaurantList"
    );

  const visible =
    filteredRestaurants.slice(
      0,
      visibleCount
    );

  document.getElementById(
    "resultCount"
  ).textContent =
    `${filteredRestaurants.length}개`;

  container.innerHTML = "";

  if (!visible.length) {
    container.innerHTML = `
      <div class="empty-state">
        <strong>검색 결과가 없습니다.</strong>
        다른 맛집명, 메뉴 또는 지역을 검색해주세요.
      </div>
    `;

    document.getElementById(
      "loadMoreBtn"
    ).style.display =
      "none";

    return;
  }

  visible.forEach(
    restaurant => {
      container.appendChild(
        createListRow(
          restaurant
        )
      );
    }
  );

  document.getElementById(
    "loadMoreBtn"
  ).style.display =
    visible.length <
    filteredRestaurants.length
      ? "inline-block"
      : "none";
}


/* =========================================================
   21. 검색 결과 한 줄 생성
========================================================= */

function createListRow(
  restaurant
) {
  const row =
    document.createElement(
      "article"
    );

  row.className =
    "restaurant-row";

  /* 리스트 전체 클릭으로 상세보기 */
  row.setAttribute("role", "button");
  row.setAttribute("tabindex", "0");
  row.setAttribute(
    "aria-label",
    `${restaurant.MAIN_TITLE} 상세보기`
  );

  const id =
    getRestaurantId(
      restaurant
    );

  const favorite =
    isFavorite(id);

  row.innerHTML = `
    <div class="restaurant-info">
      <h3 class="restaurant-name">
        ${escapeHTML(
          restaurant.MAIN_TITLE
        )}
      </h3>

      <p class="restaurant-meta">
        <strong>주소:</strong>
        ${escapeHTML(
          restaurant.ADDR1 ||
          "주소 정보 없음"
        )}
      </p>

      <p class="restaurant-meta">
        <strong>메뉴:</strong>
        ${escapeHTML(
          restaurant.RPRSNTV_MENU ||
          "대표 메뉴 정보 없음"
        )}
      </p>
    </div>

    <div class="restaurant-actions">
      <button
        type="button"
        class="icon-btn detail-btn"
        aria-label="${escapeAttribute(
          restaurant.MAIN_TITLE
        )} 상세보기"
        title="상세보기"
      >
        ⌕
      </button>

      <button
        type="button"
        class="icon-btn favorite ${
          favorite
            ? "active"
            : ""
        }"
        aria-label="${escapeAttribute(
          restaurant.MAIN_TITLE
        )} 즐겨찾기"
        title="즐겨찾기"
      >
        ${
          favorite
            ? "♥"
            : "♡"
        }
      </button>
    </div>
  `;

  /* 리스트 전체 클릭 */
  row.addEventListener(
    "click",
    event => {
      if (
        event.target.closest(
          ".favorite"
        )
      ) {
        return;
      }

      openDetail(
        restaurant
      );
    }
  );

  /* 키보드 접근 */
  row.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openDetail(
          restaurant
        );
      }
    }
  );

  /* 돋보기 상세보기 */
  row
    .querySelector(
      ".detail-btn"
    )
    .addEventListener(
      "click",
      event => {
        event.stopPropagation();
        openDetail(
          restaurant
        );
      }
    );

  /* 하트는 상세 열기 방지 */
  row
    .querySelector(
      ".favorite"
    )
    .addEventListener(
      "click",
      event => {
        event.stopPropagation();
        toggleFavorite(
          restaurant
        );
      }
    );

  return row;
}


/* =========================================================
   22. 상세 화면
========================================================= */

function openDetail(
  restaurant
) {
  if (
    !restaurant ||
    typeof restaurant !== "object"
  ) {
    showToast(
      "맛집 상세정보를 불러올 수 없습니다."
    );
    return;
  }

  const container =
    document.getElementById(
      "detailContent"
    );

  const id =
    getRestaurantId(
      restaurant
    );

  const favorite =
    isFavorite(id);

  container.innerHTML = `
    <div class="detail-top">

      <!-- 대표 이미지 -->
      <div class="detail-photo">
        <img
          id="detailImage"
          src="./images/no-image.png"
          alt="${escapeAttribute(
            restaurant.MAIN_TITLE
          )} 대표 이미지"
        >

        <button
          id="detailFavoriteBtn"
          type="button"
          class="detail-fav-btn ${
            favorite
              ? "active"
              : ""
          }"
          aria-label="즐겨찾기"
        >
          ${
            favorite
              ? "♥"
              : "♡"
          }
        </button>
      </div>

      <!-- 상세 텍스트 -->
      <div class="detail-data">

        <section class="detail-block">
          <span class="detail-label">
            상호명
          </span>

          <p
            id="detailTitle"
            class="detail-value"
          >
            ${escapeHTML(
              restaurant.MAIN_TITLE
            )}
          </p>
        </section>

        <section class="detail-block">
          <span class="detail-label">
            주소
          </span>

          <p class="detail-value">
            ${escapeHTML(
              restaurant.ADDR1 ||
              "주소 정보 없음"
            )}
          </p>
        </section>

        <section class="detail-block">
          <span class="detail-label">
            소개
          </span>

          <p class="detail-value detail-description">
            ${escapeHTML(
              restaurant.ITEMCNTNTS ||
              "소개 정보가 없습니다."
            )}
          </p>
        </section>

        <section class="detail-block">
          <span class="detail-label">
            대표메뉴
          </span>

          <p class="detail-value">
            ${escapeHTML(
              restaurant.RPRSNTV_MENU ||
              "대표 메뉴 정보 없음"
            )}
          </p>
        </section>

        <section class="detail-block">
          <span class="detail-label">
            문의
          </span>

          <p class="detail-value">
            ${escapeHTML(
              restaurant.CNTCT_TEL ||
              "전화번호 정보 없음"
            )}
          </p>
        </section>

        <section class="detail-block">
          <span class="detail-label">
            운영시간
          </span>

          <p class="detail-value">
            ${escapeHTML(
              restaurant.USAGE_DAY_WEEK_AND_TIME ||
              "운영시간 정보 없음"
            )}
          </p>
        </section>

        ${
          restaurant.HOMEPAGE_URL
            ? `
              <a
                class="detail-home-btn"
                href="${escapeAttribute(
                  restaurant.HOMEPAGE_URL
                )}"
                target="_blank"
                rel="noopener noreferrer"
              >
                공식 홈페이지
              </a>
            `
            : `
              <span
                class="detail-home-btn disabled"
              >
                공식 홈페이지 없음
              </span>
            `
        }
      </div>
    </div>

    <!-- 상세 카카오맵 -->
    <div class="detail-map-wrap">
      <div
        id="detailMap"
        class="detail-map"
        aria-label="${escapeAttribute(
          restaurant.MAIN_TITLE
        )} 지도"
      >
        <div class="detail-map-message">
          카카오맵을 준비 중입니다.
        </div>
      </div>
    </div>
  `;

  /*
    실제 API 이미지 불러오기
  */
  setSmartImage(
    document.getElementById(
      "detailImage"
    ),
    getImageCandidates(
      restaurant,
      true
    )
  );

  document
    .getElementById(
      "detailFavoriteBtn"
    )
    .addEventListener(
      "click",
      () => {
        toggleFavorite(
          restaurant
        );

        openDetail(
          restaurant
        );
      }
    );

  const modal =
    document.getElementById(
      "detailModal"
    );

  modal.classList.add(
    "active"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

  const detailPanel =
    modal.querySelector(
      ".detail-panel"
    );

  if (detailPanel) {
    detailPanel.scrollTop = 0;
  }

  /* 모달이 보인 뒤 지도 생성 */
  window.setTimeout(
    () => {
      renderDetailMap(
        restaurant
      );
    },
    180
  );
}


/* =========================================================
   23. 상세 닫기
========================================================= */

function closeDetail() {
  const modal =
    document.getElementById(
      "detailModal"
    );

  modal.classList.remove(
    "active"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";
}


/* =========================================================
   24. Kakao Maps SDK 로드
========================================================= */

function loadKakaoSdk() {
  return new Promise(
    (resolve, reject) => {
      if (
        !KAKAO_MAP_APP_KEY ||
        KAKAO_MAP_APP_KEY.includes(
          "여기에_"
        )
      ) {
        reject(
          new Error(
            "카카오맵 JavaScript 키가 입력되지 않았습니다."
          )
        );

        return;
      }

      if (
        window.kakao &&
        window.kakao.maps
      ) {
        window.kakao.maps.load(
          () => {
            kakaoSdkReady = true;
            resolve();
          }
        );

        return;
      }

      const script =
        document.createElement(
          "script"
        );

      script.id =
        "kakao-map-sdk";

      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js" +
        `?appkey=${encodeURIComponent(
          KAKAO_MAP_APP_KEY.trim()
        )}` +
        "&autoload=false";

      script.onload = () => {
        if (
          !window.kakao ||
          !window.kakao.maps
        ) {
          reject(
            new Error(
              "Kakao Maps 객체를 찾을 수 없습니다."
            )
          );

          return;
        }

        window.kakao.maps.load(
          () => {
            kakaoSdkReady = true;
            resolve();
          }
        );
      };

      script.onerror = () => {
        reject(
          new Error(
            "Kakao Maps SDK 로드 실패"
          )
        );
      };

      document.head.appendChild(
        script
      );
    }
  ).catch(error => {
    kakaoSdkReady = false;

    console.error(
      "카카오맵 오류:",
      error
    );
  });
}


/* =========================================================
   25. 상세 카카오맵
========================================================= */

function renderDetailMap(
  restaurant
) {
  const mapElement =
    document.getElementById(
      "detailMap"
    );

  if (!mapElement) {
    return;
  }

  if (!kakaoSdkReady) {
    mapElement.innerHTML = `
      <div class="detail-map-message">
        카카오맵 JavaScript 키 또는
        Kakao Developers의 JavaScript SDK 도메인을 확인해주세요.
      </div>
    `;

    return;
  }

  const lat =
    Number(
      restaurant.LAT
    );

  const lng =
    Number(
      restaurant.LNG
    );

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    mapElement.innerHTML = `
      <div class="detail-map-message">
        이 맛집은 위도·경도 정보가 없습니다.
      </div>
    `;

    return;
  }

  mapElement.innerHTML = "";

  const position =
    new kakao.maps.LatLng(
      lat,
      lng
    );

  const map =
    new kakao.maps.Map(
      mapElement,
      {
        center: position,
        level: 4
      }
    );

  const marker =
    new kakao.maps.Marker({
      position,
      map
    });

  const infoWindow =
    new kakao.maps.InfoWindow({
      content: `
        <div class="map-info-window">
          <strong>
            ${escapeHTML(
              restaurant.MAIN_TITLE
            )}
          </strong>

          <span>
            ${escapeHTML(
              restaurant.ADDR1
            )}
          </span>
        </div>
      `
    });

  infoWindow.open(
    map,
    marker
  );

  map.addControl(
    new kakao.maps.ZoomControl(),
    kakao.maps.ControlPosition.RIGHT
  );
}


/* =========================================================
   26. 즐겨찾기
========================================================= */

function getRestaurantId(
  restaurant
) {
  return String(
    restaurant.UC_SEQ ||
    restaurant.MAIN_TITLE
  );
}


function getFavorites() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(
          "busanFoodFavorites"
        )
      ) || []
    );
  } catch {
    return [];
  }
}


function isFavorite(id) {
  return getFavorites().some(
    restaurant =>
      getRestaurantId(
        restaurant
      ) === id
  );
}


function toggleFavorite(
  restaurant
) {
  const id =
    getRestaurantId(
      restaurant
    );

  let favorites =
    getFavorites();

  const index =
    favorites.findIndex(
      saved =>
        getRestaurantId(
          saved
        ) === id
    );

  if (index >= 0) {
    favorites.splice(
      index,
      1
    );

    showToast(
      "즐겨찾기에서 삭제했습니다."
    );
  } else {
    favorites.unshift(
      restaurant
    );

    showToast(
      "즐겨찾기에 추가했습니다."
    );
  }

  localStorage.setItem(
    "busanFoodFavorites",
    JSON.stringify(favorites)
  );

  renderRestaurantList();
  renderFavoriteList();
}


/* =========================================================
   27. 즐겨찾기 목록
========================================================= */

function renderFavoriteList() {
  const container =
    document.getElementById(
      "favoriteList"
    );

  const favorites =
    getFavorites();

  container.innerHTML = "";

  if (!favorites.length) {
    container.innerHTML = `
      <div class="empty-state">
        <strong>찜한 맛집이 없습니다.</strong>
        검색 결과 오른쪽의 하트를 눌러 저장해보세요.
      </div>
    `;

    return;
  }

  favorites.forEach(
    restaurant => {
      container.appendChild(
        createListRow(
          restaurant
        )
      );
    }
  );
}


/* =========================================================
   28. API 상태 모달
========================================================= */

function openDebugModal() {
  const modal =
    document.getElementById(
      "debugModal"
    );

  const content =
    document.getElementById(
      "debugContent"
    );

  const rawPreview =
    apiRawData
      ? JSON.stringify(
          apiRawData,
          null,
          2
        ).slice(0, 4500)
      : "실제 API 응답 없음";

  content.innerHTML = `
    <div class="debug-row">
      <strong>실제 API</strong>
      ${apiConnected ? "연결 성공" : "샘플 데이터 사용"}
    </div>

    <div class="debug-row">
      <strong>데이터 개수</strong>
      ${restaurants.length}개
    </div>

    <div class="debug-row">
      <strong>현재 API</strong>
      ${escapeHTML(
        LANGUAGE_API[
          currentLanguage
        ]
      )}
    </div>

    <div class="debug-row">
      <strong>요청 주소</strong>
      ${escapeHTML(
        apiDebugUrl ||
        "요청 전"
      )}
    </div>

    <div class="debug-row">
      <strong>마지막 오류</strong>
      ${escapeHTML(
        apiLastError ||
        "없음"
      )}
    </div>

    <pre class="debug-json">${escapeHTML(
      rawPreview
    )}</pre>
  `;

  modal.classList.add(
    "active"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );
}


function closeDebugModal() {
  const modal =
    document.getElementById(
      "debugModal"
    );

  modal.classList.remove(
    "active"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );
}


/* =========================================================
   29. 이벤트 연결
========================================================= */

function bindEvents() {
  /*
    검색 버튼
  */
  document
    .getElementById(
      "searchBtn"
    )
    .addEventListener(
      "click",
      applySearch
    );

  /*
    Enter 검색
  */
  document
    .getElementById(
      "searchInput"
    )
    .addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Enter"
        ) {
          applySearch();
        }
      }
    );

  /*
    빠른 키워드
  */
  document
    .querySelectorAll(
      "[data-keyword]"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          document
            .getElementById(
              "searchInput"
            )
            .value =
              button.dataset.keyword;

          applySearch();
        }
      );
    });

  /*
    초기화
  */
  document
    .getElementById(
      "resetBtn"
    )
    .addEventListener(
      "click",
      () => {
        selectedArea =
          "전체";

        visibleCount = 10;

        document
          .getElementById(
            "searchInput"
          )
          .value = "";

        filteredRestaurants =
          [...restaurants];

        renderSearchSummary(
          ""
        );

        renderAll();
      }
    );

  /*
    더보기
  */
  document
    .getElementById(
      "loadMoreBtn"
    )
    .addEventListener(
      "click",
      () => {
        visibleCount += 10;
        renderRestaurantList();
      }
    );

  /*
    상세 닫기
  */
  document
    .getElementById(
      "detailCloseBtn"
    )
    .addEventListener(
      "click",
      closeDetail
    );

  document
    .getElementById(
      "modalDim"
    )
    .addEventListener(
      "click",
      closeDetail
    );

  /*
    API 상태
  */
  document
    .getElementById(
      "apiStatusBtn"
    )
    .addEventListener(
      "click",
      openDebugModal
    );

  document
    .getElementById(
      "debugCloseBtn"
    )
    .addEventListener(
      "click",
      closeDebugModal
    );

  document
    .getElementById(
      "debugModal"
    )
    .addEventListener(
      "click",
      event => {
        if (
          event.target.id ===
          "debugModal"
        ) {
          closeDebugModal();
        }
      }
    );

  /*
    언어 변경
  */
  document
    .getElementById(
      "languageSelect"
    )
    .addEventListener(
      "change",
      async event => {
        currentLanguage =
          event.target.value;

        selectedArea =
          "전체";

        visibleCount = 10;

        document
          .getElementById(
            "searchInput"
          )
          .value = "";

        await loadRestaurantData();
      }
    );

  /*
    로고
  */
  document
    .getElementById(
      "logoBtn"
    )
    .addEventListener(
      "click",
      () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );

  /*
    ESC
  */
  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape"
      ) {
        closeDetail();
        closeDebugModal();
      }
    }
  );
}


/* =========================================================
   30. Toast
========================================================= */

let toastTimer = null;


function showToast(message) {
  const toast =
    document.getElementById(
      "toast"
    );

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(
      () => {
        toast.classList.remove(
          "show"
        );
      },
      2300
    );
}


/* =========================================================
   31. HTML 안전 처리
========================================================= */

function escapeHTML(value = "") {
  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}


function escapeAttribute(
  value = ""
) {
  return escapeHTML(value);
}
