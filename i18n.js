// i18n.js (공통 다국어 최소 가드 - 기존 로직 보호용)
window.currentLang = window.currentLang || "ko";

window.i18n = window.i18n || {
  ko: {
    btn_logout: "로그아웃",
    menu_home: "홈",
    menu_notice: "공지사항",
    menu_calendar: "활동 캘린더",
    menu_weekly: "주간 결산",
    menu_strategy: "작전 지도",
    menu_members: "길드원 목록",
    menu_admin: "권한 관리",
  },
  en: {
    btn_logout: "Logout",
    menu_home: "Home",
    menu_notice: "Notice",
    menu_calendar: "Activity Calendar",
    menu_weekly: "Weekly",
    menu_strategy: "Strategy",
    menu_members: "Members",
    menu_admin: "Admin",
  }
};

window.applyLanguage = window.applyLanguage || function () {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (window.i18n?.[window.currentLang]?.[key]) {
      el.textContent = window.i18n[window.currentLang][key];
    }
  });
};

window.toggleLanguage = window.toggleLanguage || function () {
  window.currentLang = window.currentLang === "ko" ? "en" : "ko";
  applyLanguage();
};
