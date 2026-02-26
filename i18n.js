// i18n.js - Global i18n + persistence (SAFE PATCH)
(function () {
  const saved = localStorage.getItem("lang");
  window.currentLang = saved || window.currentLang || "ko";

  window.i18n = window.i18n || {
    ko: {
      // 공통 메뉴
      menu_home: "홈",
      menu_notice: "공지사항",
      menu_calendar: "활동 캘린더",
      menu_weekly: "주간 결산",
      menu_strategy: "작전 지도",
      menu_members: "길드원 목록",
      menu_admin: "권한 관리",
      btn_logout: "로그아웃",
      msg_loading: "로딩중...",

      // 직책(뱃지)
      role_member: "멤버",
      role_manager: "운영진",
      role_admin: "관리자",
      role_pending: "대기중",

      // 메인(main.html)
      main_welcome: "환영합니다, ",
      main_admin_title: "🛠️ 관리자 메뉴",
      main_card_notice: "📢 길드 공지사항",
      main_card_notice_desc: "길드의 소식을 확인하세요.",
      main_card_calendar: "📅 활동 캘린더",
      main_card_calendar_desc: "점수를 기록하고 관리하세요.",
      main_card_weekly: "💰 주간 분배 현황",
      main_card_weekly_desc: "이번 주 보상을 확인하세요.",
      main_card_strategy: "🗺️ 대항전 작전 지도",
      main_card_strategy_desc: "그리드 맵의 명령에 따르세요.",
      main_card_members: "👥 길드원 목록",
      main_card_members_desc: "길드원 정보를 확인하세요.",
      main_card_admin: "인원 승인 및 권한 관리",

      // 캘린더/출석(attendance.html)
      att_title: "📅 활동 캘린더 (리셋: UTC 00시)",
      att_desc: "'출석하기' 버튼을 눌러 점수를 입력하세요. (과거 출석 시 50% 패널티)",
      att_modal_title: "활동 기록",
      att_warning: "⚠️ 과거 날짜입니다.\n입력하신 점수의 50%만 반영됩니다.",
      att_laby: "⚔️ 이계 미궁 (Arcane Labyrinth)",
      att_duel: "🛡️ 명예 결투 (Honor Duel)",
      att_activity: "🔥 길드 활약도 점수",
      att_btn_cancel: "취소",
      att_btn_save: "기록 저장",
      att_btn_done: "✅ 완료",
      att_btn_past: "📝 과거 출석",
      att_btn_today: "✏️ 출석하기",

      // 주간 결산(weekly.html)
      weekly_title: "🏆 주간 길드 활동 랭킹 (실시간)",
      col_rank: "순위",
      col_nickname: "닉네임",
      col_laby: "이계 (평균)",
      col_duel: "명결 (평균)",
      col_activity: "활약도 (평균)",
      col_total: "합산 평균점수",
      col_share: "기여 지분율",
      col_reward: "예상 분배량",
      admin_title: "🛡️ 운영진 결산 및 분배 관리",
      admin_label: "총 분배 상자 입력",
      btn_preview: "미리보기",
      btn_confirm: "✅ 결산 확정 (DB 저장)",

      // 공지사항(notice.html)
      noti_title: "📢 길드 공지사항",
      noti_btn_write: "✍️ 공지 작성",
      noti_modal_title: "새 공지사항 작성",
      noti_btn_cancel: "취소",
      noti_btn_save: "등록",
      noti_empty: "공지사항이 없습니다.",

      // 관리자(admin.html)
      adm_page_title: "🛠️ 인원 승인 및 권한 관리",
      adm_page_desc: "길드원의 권한을 설정하고 신규 인원을 승인하세요.",
      adm_filter_all: "전체 보기",
      adm_filter_pending: "⏳ 승인 대기",
      adm_filter_member: "⚔️ 일반 멤버",
      adm_filter_manager: "🛡️ 운영진",
      adm_filter_admin: "👑 관리자",
      adm_empty: "유저가 없습니다.",
      adm_btn_approve: "승인",
      adm_btn_demote_pending: "대기 강등",
      adm_btn_manager: "운영진 임명",
      adm_btn_admin: "관리자 임명",

      // 작전 지도(strategy.html)
      str_title: "🗺️ 대항전 작전 지도",
      str_vanguard: "⚔️ 선봉 지정",
      str_upload_map: "지도 업로드",
      str_empty_map: "지도가 없습니다.",
      str_btn_save: "💾 작전 저장 및 공유",
      str_modal_title: "구역 오더 설정",
      str_type_none: "무배치",
      str_type_attack: "공격",
      str_type_defense: "방어",

      // 길드원 목록(members.html)
      mem_title: "👥 길드원 상태판",
      mem_col_nickname: "닉네임",
      mem_col_country: "접속 국가",
      mem_col_status: "접속 상태",
      mem_online: "● 온라인",
      mem_offline: "○ 오프라인",

      // 로그인(index.html)
      login_title: "ROIDER 길드",
      login_google: "Google 로그인",
      login_with_google: "구글 계정으로 로그인",
      login_nick_prompt: "닉네임을 등록하세요",
      login_nick_placeholder: "게임 닉네임 입력",
      login_nick_btn: "등록",
      login_pending: "⏳ 관리자 승인 대기중입니다",
      login_pending_desc: "승인 후 자동으로 접속 가능합니다.",
      login_approved: "✅ 승인 완료!",
      login_enter: "길드 시스템 입장",
    },
    en: {
      // 공통 메뉴
      menu_home: "Home",
      menu_notice: "Notices",
      menu_calendar: "Activity Calendar",
      menu_weekly: "Weekly Summary",
      menu_strategy: "Strategy Map",
      menu_members: "Members",
      menu_admin: "Admin",
      btn_logout: "Logout",
      msg_loading: "Loading...",

      // 직책(뱃지)
      role_member: "Member",
      role_manager: "Manager",
      role_admin: "Admin",
      role_pending: "Pending",

      // 메인(main.html)
      main_welcome: "Welcome, ",
      main_admin_title: "🛠️ Admin Menu",
      main_card_notice: "📢 Guild Notices",
      main_card_notice_desc: "Check out guild announcements.",
      main_card_calendar: "📅 Activity Calendar",
      main_card_calendar_desc: "Record and manage your scores.",
      main_card_weekly: "💰 Weekly Distribution",
      main_card_weekly_desc: "Check this week's rewards.",
      main_card_strategy: "🗺️ Battle Strategy Map",
      main_card_strategy_desc: "Follow orders on the grid map.",
      main_card_members: "👥 Member List",
      main_card_members_desc: "View guild member information.",
      main_card_admin: "Approval & Role Management",

      // 캘린더/출석(attendance.html)
      att_title: "📅 Activity Calendar (Reset: UTC 00:00)",
      att_desc: "Press the check-in button to submit your score. (Past check-ins incur a 50% penalty)",
      att_modal_title: "Activity Record",
      att_warning: "⚠️ This is a past date.\nOnly 50% of your score will be applied.",
      att_laby: "⚔️ Arcane Labyrinth",
      att_duel: "🛡️ Honor Duel",
      att_activity: "🔥 Guild Activity Score",
      att_btn_cancel: "Cancel",
      att_btn_save: "Save Record",
      att_btn_done: "✅ Done",
      att_btn_past: "📝 Past Check-in",
      att_btn_today: "✏️ Check In",

      // 주간 결산(weekly.html)
      weekly_title: "🏆 Weekly Guild Activity Ranking (Live)",
      col_rank: "Rank",
      col_nickname: "Nickname",
      col_laby: "Labyrinth (Avg)",
      col_duel: "Duel (Avg)",
      col_activity: "Activity (Avg)",
      col_total: "Total Avg Score",
      col_share: "Contribution %",
      col_reward: "Est. Reward",
      admin_title: "🛡️ Admin Settlement & Distribution",
      admin_label: "Enter Total Boxes to Distribute",
      btn_preview: "Preview",
      btn_confirm: "✅ Confirm & Save to DB",

      // 공지사항(notice.html)
      noti_title: "📢 Guild Notices",
      noti_btn_write: "✍️ Write Notice",
      noti_modal_title: "Write New Notice",
      noti_btn_cancel: "Cancel",
      noti_btn_save: "Post",
      noti_empty: "No notices available.",

      // 관리자(admin.html)
      adm_page_title: "🛠️ Approval & Role Management",
      adm_page_desc: "Manage guild member roles and approve new members.",
      adm_filter_all: "All",
      adm_filter_pending: "⏳ Pending",
      adm_filter_member: "⚔️ Members",
      adm_filter_manager: "🛡️ Managers",
      adm_filter_admin: "👑 Admins",
      adm_empty: "No users found.",
      adm_btn_approve: "Approve",
      adm_btn_demote_pending: "Demote to Pending",
      adm_btn_manager: "Assign Manager",
      adm_btn_admin: "Assign Admin",

      // 작전 지도(strategy.html)
      str_title: "🗺️ Battle Strategy Map",
      str_vanguard: "⚔️ Assign Vanguard",
      str_upload_map: "Upload Map",
      str_empty_map: "No map available.",
      str_btn_save: "💾 Save & Share Strategy",
      str_modal_title: "Set Zone Order",
      str_type_none: "None",
      str_type_attack: "Attack",
      str_type_defense: "Defense",

      // 길드원 목록(members.html)
      mem_title: "👥 Member Status Board",
      mem_col_nickname: "Nickname",
      mem_col_country: "Country",
      mem_col_status: "Status",
      mem_online: "● Online",
      mem_offline: "○ Offline",

      // 로그인(index.html)
      login_title: "ROIDER Guild",
      login_google: "Sign in with Google",
      login_with_google: "Sign in with your Google account",
      login_nick_prompt: "Register your nickname",
      login_nick_placeholder: "Enter your in-game nickname",
      login_nick_btn: "Register",
      login_pending: "⏳ Awaiting admin approval",
      login_pending_desc: "You will be able to log in after approval.",
      login_approved: "✅ Approved!",
      login_enter: "Enter Guild System",
    }
  };

  window.applyLanguage = window.applyLanguage || function () {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const dict = window.i18n?.[window.currentLang];
      if (dict && dict[key]) el.textContent = dict[key];
    });
    // 언어 버튼 텍스트 동기화
    const btn = document.getElementById("langToggleBtn");
    if (btn) btn.textContent = window.currentLang === "ko" ? "🌐 EN" : "🌐 KO";
  };

  window.toggleLanguage = window.toggleLanguage || function () {
    window.currentLang = window.currentLang === "ko" ? "en" : "ko";
    localStorage.setItem("lang", window.currentLang);
    try { window.applyLanguage(); } catch(e){}
    if (typeof window.onLanguageChanged === "function") {
      try { window.onLanguageChanged(window.currentLang); } catch(e){}
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    try { window.applyLanguage(); } catch(e){}
  });
})();
