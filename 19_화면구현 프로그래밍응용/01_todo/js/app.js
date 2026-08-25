/* =========================================================
   하루체크 STEP 4
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       저장 Key
    ===================================================== */

    const STORAGE_KEY =
        "haruCheckTodos";

    const THEME_KEY =
        "haruCheckTheme";


    /* =====================================================
       DOM
    ===================================================== */

    const screens =
        document.querySelectorAll(".screen");

    const bottomNav =
        document.getElementById("bottomNav");

    const todayDate =
        document.getElementById("todayDate");


    /* HOME */

    const todoList =
        document.getElementById("todoList");

    const todoCount =
        document.getElementById("todoCount");

    const homeEmpty =
        document.getElementById("homeEmpty");

    const searchEmpty =
        document.getElementById("searchEmpty");

    const homeAddBtn =
        document.getElementById("homeAddBtn");


    /* STEP 4 */

    const todoSearch =
        document.getElementById("todoSearch");

    const searchClearBtn =
        document.getElementById("searchClearBtn");

    const homeFilter =
        document.getElementById("homeFilter");

    const todoSort =
        document.getElementById("todoSort");


    /* Progress */

    const goalPercent =
        document.getElementById("goalPercent");

    const goalCount =
        document.getElementById("goalCount");

    const goalMessage =
        document.getElementById("goalMessage");

    const goalSubMessage =
        document.getElementById("goalSubMessage");

    const progressBar =
        document.getElementById("progressBar");


    /* ADD */

    const addTodoForm =
        document.getElementById("addTodoForm");

    const addTitle =
        document.getElementById("addTitle");

    const addDate =
        document.getElementById("addDate");

    const addTime =
        document.getElementById("addTime");

    const addMemo =
        document.getElementById("addMemo");

    const addTitleError =
        document.getElementById("addTitleError");


    /* EDIT */

    const editTodoForm =
        document.getElementById("editTodoForm");

    const editId =
        document.getElementById("editId");

    const editTitle =
        document.getElementById("editTitle");

    const editDate =
        document.getElementById("editDate");

    const editTime =
        document.getElementById("editTime");

    const editMemo =
        document.getElementById("editMemo");

    const editTitleError =
        document.getElementById("editTitleError");

    const editBackBtn =
        document.getElementById("editBackBtn");


    /* DELETE */

    const deleteTodoBtn =
        document.getElementById("deleteTodoBtn");

    const deleteModal =
        document.getElementById("deleteModal");

    const cancelDelete =
        document.getElementById("cancelDelete");

    const confirmDelete =
        document.getElementById("confirmDelete");


    /* CALENDAR */

    const calendarTitle =
        document.getElementById("calendarTitle");

    const calendarGrid =
        document.getElementById("calendarGrid");

    const prevMonthBtn =
        document.getElementById("prevMonthBtn");

    const nextMonthBtn =
        document.getElementById("nextMonthBtn");

    const selectedDateTitle =
        document.getElementById("selectedDateTitle");

    const selectedDateCount =
        document.getElementById("selectedDateCount");

    const calendarTodoList =
        document.getElementById("calendarTodoList");

    const calendarEmpty =
        document.getElementById("calendarEmpty");

    const calendarAddBtn =
        document.getElementById("calendarAddBtn");


    /* COMPLETED */

    const completedList =
        document.getElementById("completedList");

    const completedEmpty =
        document.getElementById("completedEmpty");

    const totalCompletedCount =
        document.getElementById("totalCompletedCount");

    const weekCompletedCount =
        document.getElementById("weekCompletedCount");

    const completedCountBadge =
        document.getElementById("completedCountBadge");

    const completedMessage =
        document.getElementById("completedMessage");


    /* MY */

    const myTotalTodos =
        document.getElementById("myTotalTodos");

    const myCompletedTodos =
        document.getElementById("myCompletedTodos");

    const myRemainingTodos =
        document.getElementById("myRemainingTodos");


    /* Theme */

    const darkModeToggle =
        document.getElementById("darkModeToggle");

    const themeSettingBtn =
        document.getElementById("themeSettingBtn");


    /* Reset */

    const resetDataBtn =
        document.getElementById("resetDataBtn");

    const resetModal =
        document.getElementById("resetModal");

    const cancelResetBtn =
        document.getElementById("cancelResetBtn");

    const confirmResetBtn =
        document.getElementById("confirmResetBtn");


    /* Info */

    const appInfoBtn =
        document.getElementById("appInfoBtn");

    const infoModal =
        document.getElementById("infoModal");

    const closeInfoBtn =
        document.getElementById("closeInfoBtn");


    const toast =
        document.getElementById("toast");


    /* =====================================================
       State
    ===================================================== */

    let addCategory = "공부";
    let addPriority = "보통";

    let editCategory = "공부";
    let editPriority = "보통";

    let deleteId = null;

    let editReturnScreen =
        "homeScreen";

    let toastTimer = null;


    /* STEP 4 Filter */

    let currentFilter =
        "전체";

    let currentSearch =
        "";

    let currentSort =
        "default";


    /* Calendar */

    const now =
        new Date();

    let calendarYear =
        now.getFullYear();

    let calendarMonth =
        now.getMonth();

    let selectedCalendarDate =
        getToday();


    /* =====================================================
       날짜
    ===================================================== */

    function makeDateString(
        year,
        month,
        day
    ) {

        return (
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        );

    }


    function getToday() {

        const date =
            new Date();

        return makeDateString(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

    }


    function renderTodayDate() {

        todayDate.textContent =
            new Intl.DateTimeFormat(
                "ko-KR",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long"
                }
            ).format(
                new Date()
            );

    }


    /* =====================================================
       Storage
    ===================================================== */

    function loadTodos() {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEY
                    )
                );

            return Array.isArray(data)
                ? data
                : [];

        } catch {

            return [];

        }

    }


    function saveTodos(todos) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(todos)
        );

    }


    function createId() {

        return (
            Date.now().toString() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2)
        );

    }


    /* =====================================================
       SCREEN
    ===================================================== */

    function showScreen(screenId) {

        screens.forEach(
            screen =>
                screen.classList.remove(
                    "active"
                )
        );


        const target =
            document.getElementById(
                screenId
            );


        if (!target) {
            return;
        }


        target.classList.add(
            "active"
        );


        bottomNav.style.display =
            [
                "splashScreen",
                "addScreen",
                "editScreen"
            ].includes(screenId)
                ? "none"
                : "flex";


        document
            .querySelectorAll(".nav-btn")
            .forEach(
                button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.screen ===
                        screenId
                    );

                }
            );


        if (
            screenId === "homeScreen"
        ) {

            renderHome();

        }


        if (
            screenId === "calendarScreen"
        ) {

            renderCalendar();

        }


        if (
            screenId === "completedScreen"
        ) {

            renderCompleted();

        }


        if (
            screenId === "myScreen"
        ) {

            renderMy();

        }


        window.scrollTo({
            top: 0
        });

    }


    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-screen]"
                );


            if (button) {

                showScreen(
                    button.dataset.screen
                );

            }

        }
    );


    /* =====================================================
       Selector
    ===================================================== */

    function setupSelector(
        id,
        callback
    ) {

        const element =
            document.getElementById(id);


        element.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-value]"
                    );


                if (!button) {
                    return;
                }


                element
                    .querySelectorAll(
                        "[data-value]"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "selected"
                            )
                    );


                button.classList.add(
                    "selected"
                );


                callback(
                    button.dataset.value
                );

            }
        );

    }


    setupSelector(
        "addCategorySelector",
        value =>
            addCategory = value
    );


    setupSelector(
        "addPrioritySelector",
        value =>
            addPriority = value
    );


    setupSelector(
        "editCategorySelector",
        value =>
            editCategory = value
    );


    setupSelector(
        "editPrioritySelector",
        value =>
            editPriority = value
    );


    function setSelectedButton(
        id,
        value
    ) {

        document
            .querySelectorAll(
                `#${id} [data-value]`
            )
            .forEach(
                button => {

                    button.classList.toggle(
                        "selected",
                        button.dataset.value ===
                        value
                    );

                }
            );

    }


    /* =====================================================
       ADD
    ===================================================== */

    homeAddBtn.addEventListener(
        "click",
        function () {

            resetAddForm();

            showScreen(
                "addScreen"
            );

        }
    );


    function resetAddForm() {

        addTodoForm.reset();

        addDate.value =
            getToday();

        addCategory =
            "공부";

        addPriority =
            "보통";


        setSelectedButton(
            "addCategorySelector",
            "공부"
        );


        setSelectedButton(
            "addPrioritySelector",
            "보통"
        );

    }


    addTodoForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const title =
                addTitle.value.trim();


            if (!title) {

                addTitleError
                    .classList
                    .add("show");

                return;

            }


            const todos =
                loadTodos();


            const todo = {

                id:
                    createId(),

                title,

                date:
                    addDate.value ||
                    getToday(),

                time:
                    addTime.value,

                category:
                    addCategory,

                priority:
                    addPriority,

                memo:
                    addMemo.value.trim(),

                completed:
                    false,

                createdAt:
                    new Date()
                        .toISOString(),

                completedAt:
                    null

            };


            todos.push(todo);

            saveTodos(todos);


            resetAddForm();

            showScreen(
                "homeScreen"
            );


            showToast(
                "할 일이 저장되었어요 🌱"
            );

        }
    );


    /* =====================================================
       COMPLETE
    ===================================================== */

    function toggleComplete(id) {

        const todos =
            loadTodos();


        const todo =
            todos.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!todo) {
            return;
        }


        todo.completed =
            !todo.completed;


        todo.completedAt =
            todo.completed
                ? new Date()
                    .toISOString()
                : null;


        saveTodos(todos);


        renderHome();
        renderCalendar();
        renderCompleted();
        renderMy();


        showToast(
            todo.completed
                ? "하나 완료했어요! ✨"
                : "다시 할 일로 변경했어요 🌱"
        );

    }


    /* =====================================================
       EDIT
    ===================================================== */

    function openEdit(
        id,
        returnScreen
    ) {

        const todo =
            loadTodos()
                .find(
                    item =>
                        String(item.id) ===
                        String(id)
                );


        if (!todo) {
            return;
        }


        editReturnScreen =
            returnScreen;


        editId.value =
            todo.id;

        editTitle.value =
            todo.title;

        editDate.value =
            todo.date;

        editTime.value =
            todo.time || "";

        editMemo.value =
            todo.memo || "";


        editCategory =
            todo.category;

        editPriority =
            todo.priority;


        setSelectedButton(
            "editCategorySelector",
            editCategory
        );


        setSelectedButton(
            "editPrioritySelector",
            editPriority
        );


        showScreen(
            "editScreen"
        );

    }


    editBackBtn.addEventListener(
        "click",
        () =>
            showScreen(
                editReturnScreen
            )
    );


    editTodoForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const todos =
                loadTodos();


            const index =
                todos.findIndex(
                    todo =>
                        String(todo.id) ===
                        String(editId.value)
                );


            if (index < 0) {
                return;
            }


            todos[index] = {

                ...todos[index],

                title:
                    editTitle.value.trim(),

                date:
                    editDate.value,

                time:
                    editTime.value,

                category:
                    editCategory,

                priority:
                    editPriority,

                memo:
                    editMemo.value.trim()

            };


            saveTodos(todos);


            showScreen(
                editReturnScreen
            );


            showToast(
                "할 일이 수정되었어요 ✏️"
            );

        }
    );


    /* =====================================================
       DELETE
    ===================================================== */

    deleteTodoBtn.addEventListener(
        "click",
        function () {

            deleteId =
                editId.value;

            deleteModal
                .classList
                .add("show");

        }
    );


    cancelDelete.addEventListener(
        "click",
        () =>
            deleteModal
                .classList
                .remove("show")
    );


    confirmDelete.addEventListener(
        "click",
        function () {

            const todos =
                loadTodos().filter(
                    todo =>
                        String(todo.id) !==
                        String(deleteId)
                );


            saveTodos(todos);


            deleteModal
                .classList
                .remove("show");


            showScreen(
                editReturnScreen
            );


            showToast(
                "할 일이 삭제되었어요 🗑️"
            );

        }
    );


    /* =====================================================
       Display Helper
    ===================================================== */

    function getCategoryInfo(category) {

        const map = {

            공부: {
                card: "cat-study",
                tag: "tag-study",
                icon: "📘"
            },

            업무: {
                card: "cat-work",
                tag: "tag-work",
                icon: "💻"
            },

            쇼핑: {
                card: "cat-shopping",
                tag: "tag-shopping",
                icon: "🛍️"
            },

            개인: {
                card: "cat-personal",
                tag: "tag-personal",
                icon: "🌷"
            }

        };


        return (
            map[category] ||
            map.공부
        );

    }


    function getPriorityClass(priority) {

        if (
            priority === "중요"
        ) {
            return "priority-high";
        }

        if (
            priority === "낮음"
        ) {
            return "priority-low";
        }

        return "priority-normal";

    }


    function formatTime(time) {

        if (!time) {
            return "";
        }


        const [h,m] =
            time.split(":");


        let hour =
            Number(h);


        const period =
            hour < 12
                ? "오전"
                : "오후";


        hour =
            hour % 12 || 12;


        return (
            `${period} ${hour}:${m}`
        );

    }


    function escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            value || "";

        return div.innerHTML;

    }


    function createTodoCard(todo) {

        const info =
            getCategoryInfo(
                todo.category
            );


        const card =
            document.createElement(
                "article"
            );


        card.className =
            `todo-card ${info.card}`;


        if (
            todo.completed
        ) {

            card.classList.add(
                "completed"
            );

        }


        card.dataset.id =
            todo.id;


        card.innerHTML = `

            <button
                type="button"
                class="check-btn ${
                    todo.completed
                        ? "checked"
                        : ""
                }"
                data-action="complete"
            >
                ${
                    todo.completed
                        ? "✓"
                        : ""
                }
            </button>


            <div
                class="todo-content"
                data-action="edit"
            >

                <h3>
                    ${escapeHTML(todo.title)}
                </h3>


                <div class="todo-meta">

                    <span
                        class="tag ${info.tag}"
                    >
                        ${info.icon}
                        ${todo.category}
                    </span>


                    ${
                        todo.time
                            ? `
                                <span>
                                    🕑
                                    ${formatTime(todo.time)}
                                </span>
                              `
                            : ""
                    }


                    <span
                        class="
                            priority-tag
                            ${getPriorityClass(
                                todo.priority
                            )}
                        "
                    >
                        ${todo.priority}
                    </span>

                </div>

            </div>


            <button
                type="button"
                class="edit-card-btn"
                data-action="edit"
            >
                ⋮
            </button>

        `;


        return card;

    }


    /* =====================================================
       STEP 4 SORT
    ===================================================== */

    function sortHomeTodos(todos) {

        const list =
            [...todos];


        if (
            currentSort === "time"
        ) {

            list.sort(
                (a,b) =>
                    (a.time || "99:99")
                        .localeCompare(
                            b.time ||
                            "99:99"
                        )
            );

        }


        else if (
            currentSort ===
            "priority"
        ) {

            const priority = {
                중요: 1,
                보통: 2,
                낮음: 3
            };


            list.sort(
                (a,b) =>
                    priority[a.priority] -
                    priority[b.priority]
            );

        }


        else if (
            currentSort ===
            "latest"
        ) {

            list.sort(
                (a,b) =>
                    new Date(
                        b.createdAt
                    ) -
                    new Date(
                        a.createdAt
                    )
            );

        }


        else {

            list.sort(
                (a,b) =>
                    Number(
                        a.completed
                    ) -
                    Number(
                        b.completed
                    )
            );

        }


        return list;

    }


    /* =====================================================
       HOME + 검색/필터
    ===================================================== */

    function renderHome() {

        const allTodayTodos =
            loadTodos().filter(
                todo =>
                    todo.date ===
                    getToday()
            );


        /*
            진행률은 필터 이전
            실제 오늘 전체 일정 기준
        */

        updateProgress(
            allTodayTodos
        );


        let visibleTodos =
            [...allTodayTodos];


        /* 카테고리 필터 */

        if (
            currentFilter !==
            "전체"
        ) {

            visibleTodos =
                visibleTodos.filter(
                    todo =>
                        todo.category ===
                        currentFilter
                );

        }


        /* 검색 */

        if (currentSearch) {

            const keyword =
                currentSearch
                    .toLowerCase();


            visibleTodos =
                visibleTodos.filter(
                    todo => {

                        return (
                            todo.title
                                .toLowerCase()
                                .includes(
                                    keyword
                                ) ||

                            (todo.memo || "")
                                .toLowerCase()
                                .includes(
                                    keyword
                                )
                        );

                    }
                );

        }


        visibleTodos =
            sortHomeTodos(
                visibleTodos
            );


        todoList.innerHTML =
            "";


        todoCount.textContent =
            visibleTodos.length;


        /*
            등록된 일정 자체 없음
        */

        homeEmpty
            .classList
            .toggle(
                "hidden",
                allTodayTodos.length >
                0
            );


        /*
            일정은 있는데 검색 결과 없음
        */

        searchEmpty
            .classList
            .toggle(
                "hidden",
                !(
                    allTodayTodos.length >
                        0 &&
                    visibleTodos.length ===
                        0
                )
            );


        visibleTodos.forEach(
            todo => {

                todoList.appendChild(
                    createTodoCard(
                        todo
                    )
                );

            }
        );

    }


    /* 검색 */

    todoSearch.addEventListener(
        "input",
        function () {

            currentSearch =
                todoSearch.value
                    .trim();

            renderHome();

        }
    );


    searchClearBtn.addEventListener(
        "click",
        function () {

            todoSearch.value =
                "";

            currentSearch =
                "";

            renderHome();

        }
    );


    /* 카테고리 필터 */

    homeFilter.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-filter]"
                );


            if (!button) {
                return;
            }


            currentFilter =
                button.dataset.filter;


            homeFilter
                .querySelectorAll(
                    ".filter-chip"
                )
                .forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


            button.classList.add(
                "active"
            );


            renderHome();

        }
    );


    /* 정렬 */

    todoSort.addEventListener(
        "change",
        function () {

            currentSort =
                todoSort.value;

            renderHome();

        }
    );


    /* =====================================================
       Progress
    ===================================================== */

    function updateProgress(todos) {

        const total =
            todos.length;


        const completed =
            todos.filter(
                todo =>
                    todo.completed
            ).length;


        const percent =
            total
                ? Math.round(
                    completed /
                    total *
                    100
                )
                : 0;


        goalPercent.textContent =
            `${percent}%`;

        goalCount.textContent =
            `${completed} / ${total} 완료`;

        progressBar.style.width =
            `${percent}%`;


        if (!total) {

            goalMessage.textContent =
                "오늘 할 일을 시작해 볼까요?";

            goalSubMessage.textContent =
                "새로운 할 일을 추가해 보세요 ✨";

        }

        else if (
            completed === total
        ) {

            goalMessage.textContent =
                "오늘 할 일을 모두 끝냈어요! 🎉";

            goalSubMessage.textContent =
                "정말 멋진 하루예요 💜";

        }

        else if (completed) {

            goalMessage.textContent =
                "좋아요! 조금만 더 해볼까요?";

            goalSubMessage.textContent =
                `벌써 ${completed}개 완료했어요 ✨`;

        }

        else {

            goalMessage.textContent =
                "오늘도 하나씩 시작해요!";

            goalSubMessage.textContent =
                `${total}개의 할 일이 기다리고 있어요 🌱`;

        }

    }


    /* =====================================================
       Todo Click
    ===================================================== */

    function handleTodoClick(
        event,
        screen
    ) {

        const action =
            event.target.closest(
                "[data-action]"
            );


        if (!action) {
            return;
        }


        const card =
            action.closest(
                ".todo-card"
            );


        if (!card) {
            return;
        }


        if (
            action.dataset.action ===
            "complete"
        ) {

            toggleComplete(
                card.dataset.id
            );

        }


        if (
            action.dataset.action ===
            "edit"
        ) {

            openEdit(
                card.dataset.id,
                screen
            );

        }

    }


    todoList.addEventListener(
        "click",
        event =>
            handleTodoClick(
                event,
                "homeScreen"
            )
    );


    completedList.addEventListener(
        "click",
        event =>
            handleTodoClick(
                event,
                "completedScreen"
            )
    );


    calendarTodoList.addEventListener(
        "click",
        event =>
            handleTodoClick(
                event,
                "calendarScreen"
            )
    );


    /* =====================================================
       COMPLETED
    ===================================================== */

    function renderCompleted() {

        const todos =
            loadTodos()
                .filter(
                    todo =>
                        todo.completed
                )
                .sort(
                    (a,b) =>
                        new Date(
                            b.completedAt
                        ) -
                        new Date(
                            a.completedAt
                        )
                );


        completedList.innerHTML =
            "";


        todos.forEach(
            todo =>
                completedList.appendChild(
                    createTodoCard(
                        todo
                    )
                )
        );


        completedEmpty
            .classList
            .toggle(
                "hidden",
                todos.length >
                0
            );


        totalCompletedCount.textContent =
            `${todos.length}개`;

        completedCountBadge.textContent =
            todos.length;


        weekCompletedCount.textContent =
            getWeekCompletedCount(
                todos
            );


        completedMessage.textContent =
            todos.length
                ? "차근차근 잘 해내고 있어요 🌱"
                : "하나씩 완료해 보세요.";

    }


    function getWeekCompletedCount(
        todos
    ) {

        const today =
            new Date();


        const day =
            today.getDay();


        const monday =
            new Date(today);


        monday.setDate(
            today.getDate() +
            (
                day === 0
                    ? -6
                    : 1 - day
            )
        );


        monday.setHours(
            0,0,0,0
        );


        const next =
            new Date(monday);

        next.setDate(
            monday.getDate() +
            7
        );


        return (
            todos.filter(
                todo => {

                    if (
                        !todo.completedAt
                    ) {
                        return false;
                    }


                    const date =
                        new Date(
                            todo.completedAt
                        );


                    return (
                        date >= monday &&
                        date < next
                    );

                }
            ).length
        );

    }


    /* =====================================================
       MY
    ===================================================== */

    function renderMy() {

        const todos =
            loadTodos();


        const completed =
            todos.filter(
                todo =>
                    todo.completed
            ).length;


        myTotalTodos.textContent =
            todos.length;

        myCompletedTodos.textContent =
            completed;

        myRemainingTodos.textContent =
            todos.length -
            completed;

    }


    /* =====================================================
       STEP 4 DARK MODE
    ===================================================== */

    function applySavedTheme() {

        const saved =
            localStorage.getItem(
                THEME_KEY
            );


        const dark =
            saved === "dark";


        document.body
            .classList
            .toggle(
                "dark-mode",
                dark
            );


        darkModeToggle.checked =
            dark;

    }


    darkModeToggle.addEventListener(
        "change",
        function () {

            const dark =
                darkModeToggle.checked;


            document.body
                .classList
                .toggle(
                    "dark-mode",
                    dark
                );


            localStorage.setItem(
                THEME_KEY,
                dark
                    ? "dark"
                    : "light"
            );


            showToast(
                dark
                    ? "다크 모드로 변경했어요 🌙"
                    : "밝은 모드로 변경했어요 🌷"
            );

        }
    );


    themeSettingBtn.addEventListener(
        "click",
        function () {

            darkModeToggle.focus();


            darkModeToggle
                .scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

        }
    );


    /* =====================================================
       CALENDAR
    ===================================================== */

    function renderCalendar() {

        calendarTitle.textContent =
            `${calendarYear}년 ${calendarMonth + 1}월`;


        calendarGrid.innerHTML =
            "";


        const firstDay =
            new Date(
                calendarYear,
                calendarMonth,
                1
            ).getDay();


        const lastDate =
            new Date(
                calendarYear,
                calendarMonth + 1,
                0
            ).getDate();


        for (
            let i = 0;
            i < 42;
            i++
        ) {

            const day =
                i -
                firstDay +
                1;


            const date =
                new Date(
                    calendarYear,
                    calendarMonth,
                    day
                );


            const dateString =
                makeDateString(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "calendar-day";

            button.dataset.date =
                dateString;

            button.innerHTML =
                `<span>${date.getDate()}</span>`;


            if (
                date.getMonth() !==
                calendarMonth
            ) {

                button.classList.add(
                    "other-month"
                );

            }


            if (
                dateString ===
                selectedCalendarDate
            ) {

                button.classList.add(
                    "selected"
                );

            }


            const hasTodo =
                loadTodos().some(
                    todo =>
                        todo.date ===
                        dateString
                );


            if (hasTodo) {

                const dot =
                    document.createElement(
                        "span"
                    );

                dot.className =
                    "todo-dot";

                button.appendChild(dot);

            }


            calendarGrid.appendChild(
                button
            );

        }


        renderCalendarTodos(
            selectedCalendarDate
        );

    }


    calendarGrid.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".calendar-day"
                );


            if (!button) {
                return;
            }


            selectedCalendarDate =
                button.dataset.date;


            const [
                y,
                m
            ] =
                selectedCalendarDate
                    .split("-")
                    .map(Number);


            calendarYear =
                y;

            calendarMonth =
                m - 1;


            renderCalendar();

        }
    );


    prevMonthBtn.addEventListener(
        "click",
        function () {

            calendarMonth--;


            if (
                calendarMonth < 0
            ) {

                calendarMonth = 11;
                calendarYear--;

            }


            selectedCalendarDate =
                makeDateString(
                    calendarYear,
                    calendarMonth,
                    1
                );


            renderCalendar();

        }
    );


    nextMonthBtn.addEventListener(
        "click",
        function () {

            calendarMonth++;


            if (
                calendarMonth > 11
            ) {

                calendarMonth = 0;
                calendarYear++;

            }


            selectedCalendarDate =
                makeDateString(
                    calendarYear,
                    calendarMonth,
                    1
                );


            renderCalendar();

        }
    );


    function renderCalendarTodos(
        dateString
    ) {

        const todos =
            loadTodos()
                .filter(
                    todo =>
                        todo.date ===
                        dateString
                );


        calendarTodoList.innerHTML =
            "";


        selectedDateCount.textContent =
            todos.length;


        const [
            y,m,d
        ] =
            dateString
                .split("-")
                .map(Number);


        selectedDateTitle.textContent =
            `${m}월 ${d}일 일정`;


        calendarEmpty
            .classList
            .toggle(
                "hidden",
                todos.length >
                0
            );


        todos.forEach(
            todo =>
                calendarTodoList
                    .appendChild(
                        createTodoCard(
                            todo
                        )
                    )
        );

    }


    calendarAddBtn.addEventListener(
        "click",
        function () {

            resetAddForm();

            addDate.value =
                selectedCalendarDate;

            showScreen(
                "addScreen"
            );

        }
    );


    /* =====================================================
       RESET
    ===================================================== */

    resetDataBtn.addEventListener(
        "click",
        () =>
            resetModal
                .classList
                .add("show")
    );


    cancelResetBtn.addEventListener(
        "click",
        () =>
            resetModal
                .classList
                .remove("show")
    );


    confirmResetBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                STORAGE_KEY
            );


            resetModal
                .classList
                .remove("show");


            renderHome();
            renderCalendar();
            renderCompleted();
            renderMy();


            showToast(
                "모든 데이터가 초기화되었어요."
            );

        }
    );


    /* =====================================================
       INFO
    ===================================================== */

    appInfoBtn.addEventListener(
        "click",
        () =>
            infoModal
                .classList
                .add("show")
    );


    closeInfoBtn.addEventListener(
        "click",
        () =>
            infoModal
                .classList
                .remove("show")
    );


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message) {

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
                () =>
                    toast.classList.remove(
                        "show"
                    ),
                2000
            );

    }


    /* =====================================================
       START
    ===================================================== */

    renderTodayDate();

    applySavedTheme();

    resetAddForm();

    renderHome();

    renderCalendar();

    renderCompleted();

    renderMy();


    showScreen(
        "splashScreen"
    );

});