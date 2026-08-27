# 부산맛지도 - 리스트/상세 화면 프로젝트

첨부 시안을 기준으로 검색 결과는 **세로 리스트**, 상세 화면은 **대표 이미지 + 음식점 정보 + 카카오맵** 형태로 구현한 버전입니다.

## 폴더 구조

```text
busan-food-list-detail-app/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   └── no-image.png
└── README.md
```

JavaScript 파일은 `script.js` 한 개만 사용합니다.

## 1. 인증키 입력

`js/script.js` 파일 가장 위에서 아래 두 값을 수정하세요.

```javascript
const PUBLIC_DATA_SERVICE_KEY = "공공데이터포털_인증키";
const KAKAO_MAP_APP_KEY = "카카오맵_JavaScript키";
```

## 2. 검색 기능

다음 데이터를 검색합니다.

- 맛집명 `MAIN_TITLE`
- 구군 `GUGUN_NM`
- 대표메뉴 `RPRSNTV_MENU`
- 주소 `ADDR1`, `ADDR2`
- 소개 `ITEMCNTNTS`

예시:

```text
밀면
초밥
강서구
부산진구
```

## 3. 검색 결과 UI

검색 결과는 다음 정보만 간결하게 표시합니다.

```text
맛집명
주소
메뉴
상세보기 아이콘
즐겨찾기 아이콘
```

상세보기 아이콘을 누르면 상세 모달이 열립니다.

## 4. 상세 화면

상세 화면에서 다음 정보를 표시합니다.

- 대표 이미지
- 상호명
- 주소
- 소개
- 대표메뉴
- 문의
- 운영시간
- 공식 홈페이지
- Kakao Map

## 5. 이미지

실제 API의 아래 값을 사용합니다.

```text
MAIN_IMG_NORMAL
MAIN_IMG_THUMB
```

이미지 주소가 전체 URL 또는 `/uploadImgs/...` 상대경로로 와도 여러 후보 주소를 순서대로 시도합니다.

모든 이미지 로딩이 실패하면:

```text
./images/no-image.png
```

를 표시합니다.

## 6. Kakao Maps

Kakao Developers에서 발급받은 **JavaScript 키**를 사용해야 합니다.

실제 실행 도메인을 JavaScript SDK 도메인으로 등록하세요.

예:

```text
http://127.0.0.1:5500
http://localhost:5500
https://사용자아이디.github.io
```

VS Code Live Server 실행을 권장합니다.

## 7. API 상태 확인

PC 화면 오른쪽 상단의 `API 상태 확인` 버튼을 누르면 다음을 볼 수 있습니다.

- 실제 API 연결 성공 여부
- 데이터 개수
- 현재 API
- 인증키를 숨긴 요청 URL
- 마지막 오류
- 실제 JSON 응답 일부

## 8. 실제 API가 실패하면

화면이 깨지지 않도록 샘플 데이터로 전환됩니다.

따라서 검색 UI, 리스트, 즐겨찾기, 상세 UI는 인증키가 없어도 테스트할 수 있습니다.


## 상세보기 클릭 수정

- 맛집 리스트 전체 클릭 → 상세보기
- 돋보기 클릭 → 상세보기
- Enter / Space → 상세보기
- 하트 클릭 → 즐겨찾기만 실행
