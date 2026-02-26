// i18n.js - Global i18n + persistence (SAFE PATCH)
(function () {
  const saved = localStorage.getItem("lang");
  window.currentLang = saved || window.currentLang || "ko";

  window.i18n = window.i18n || {
    ko: {
      menu_home: "홈",
      menu_notice: "공지사항",
      menu_calendar: "활동 캘린더",
      menu_weekly: "주간 결산",
      menu_strategy: "작전 지도",
      menu_members: "길드원 목록",
      menu_admin: "권한 관리",
      weekly_title: "🏆 주간 길드 활동 랭킹 (실시간)",
      admin_title: "🛡️ 인원 승인 및 권한 관리",
      calendar_title: "활동 캘린더 (리셋: UTC 00시)",
      calendar_help: "출석하기 버튼을 눌러 점수를 입력하세요. (과거 출석 시 50% 패널티)",
      no_map: "지도가 없습니다.",
      btn_save_share: "작전 저장 및 공유",
      msg_loading: "로딩중...",
    },
    en: {
      menu_home: "Home",
      menu_notice: "Notices",
      menu_calendar: "Activity Calendar",
      menu_weekly: "Weekly Summary",
      menu_strategy: "Strategy Map",
      menu_members: "Members",
      menu_admin: "Admin",
      weekly_title: "🏆 Weekly Guild Activity Ranking (Live)",
      admin_title: "🛡️ Approval & Role Management",
      calendar_title: "Activity Calendar (Reset: UTC 00:00)",
      calendar_help: "Press the check-in button to submit your score. (Past check-ins incur a 50% penalty)",
      no_map: "No map available.",
      btn_save_share: "Save & Share Strategy",
      msg_loading: "Loading...",
    }
  };

  window.applyLanguage = window.applyLanguage || function () {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const dict = window.i18n?.[window.currentLang];
      if (dict && dict[key]) el.textContent = dict[key];
    });
  };

  window.toggleLanguage = window.toggleLanguage || function () {
    window.currentLang = window.currentLang === "ko" ? "en" : "ko";
    localStorage.setItem("lang", window.currentLang);
    try { window.applyLanguage(); } catch(e){}
    // optional hook for pages that need rerender (e.g., calendar)
    if (typeof window.onLanguageChanged === "function") {
      try { window.onLanguageChanged(window.currentLang); } catch(e){}
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    try { window.applyLanguage(); } catch(e){}
  });
})();