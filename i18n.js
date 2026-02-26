// i18n.js (공통 다국어 - 본문 번역 지원 패치)
// 기존 구조 유지 + data-i18n 기반 본문 번역 정상 동작

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
    weekly_title: "🏆 주간 길드 활동 랭킹 (실시간)",
    admin_title: "🛡️ 운영진 결산 및 분배 관리",
    col_rank: "순위",
    col_nickname: "닉네임",
    col_laby: "이계 (평균)",
    col_duel: "명결 (평균)",
    col_activity: "활약도 (평균)",
    col_total: "합산 평균점수",
    col_share: "기여 지분율",
    col_reward: "예상 분배량",
    msg_loading: "로딩중...",
  },
  en: {
    btn_logout: "Logout",
    menu_home: "Home",
    menu_notice: "Notices",
    menu_calendar: "Activity Calendar",
    menu_weekly: "Weekly Summary",
    menu_strategy: "Strategy Map",
    menu_members: "Members",
    menu_admin: "Admin",
    weekly_title: "🏆 Weekly Guild Activity Ranking (Live)",
    admin_title: "🛡️ Admin Settlement & Distribution",
    col_rank: "Rank",
    col_nickname: "Nickname",
    col_laby: "Labyrinth (Avg)",
    col_duel: "Duel (Avg)",
    col_activity: "Activity (Avg)",
    col_total: "Total Avg Score",
    col_share: "Share Ratio",
    col_reward: "Estimated Reward",
    msg_loading: "Loading...",
  }
};

window.applyLanguage = window.applyLanguage || function () {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const dict = window.i18n?.[window.currentLang];
    if (dict && dict[key]) {
      el.textContent = dict[key];
    }
  });
};

window.toggleLanguage = window.toggleLanguage || function () {
  window.currentLang = window.currentLang === "ko" ? "en" : "ko";
  applyLanguage();
};

document.addEventListener("DOMContentLoaded", () => {
  try { applyLanguage(); } catch (e) { console.warn("applyLanguage failed:", e); }
});
