// firebase_config.js
// 파이어베이스 핵심 설정 및 공통 인증 로직을 담당합니다.
// 💡 firebaseConfig 설정값은 외부 파일(firebase_key.json 등)에서 안전하게 불러옵니다.

// 파이어베이스 초기화 (미리 선언된 firebaseConfig를 사용하여 초기화)
if (typeof firebaseConfig !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// 공통 로그아웃 함수
function logout() {
  auth.signOut().then(() => {
    alert("로그아웃 되었습니다.");
    location.replace("login.html");
  }).catch((error) => {
    alert("로그아웃 실패: " + error.message);
  });
}

// 1. 현재 접속 중인 페이지의 메뉴 버튼에 색상(active) 칠하기
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link");
  
  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});

// 2. 헤더 정보 및 권한에 따른 메뉴 제어 공통 로직
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const docSnap = await db.collection("users").doc(user.uid).get();
    if (docSnap.exists) {
      const data = docSnap.data();
      
      // 공통: 헤더 이름, 프로필 사진 적용
      const userNameEl = document.getElementById("userName");
      const userPhotoEl = document.getElementById("userPhoto");
      if (userNameEl) userNameEl.textContent = data.nickname || "User";
      if (userPhotoEl && user.photoURL) userPhotoEl.src = user.photoURL;

      // 공통: 직책 뱃지 표시
      const badgeEl = document.getElementById("myRoleBadge");
      if (badgeEl) {
        badgeEl.style.display = "inline-block";
        if (data.role === 'admin') { badgeEl.textContent = '최고 관리자'; badgeEl.className = 'role-badge role-admin'; }
        else if (data.role === 'manager') { badgeEl.textContent = '운영진'; badgeEl.className = 'role-badge role-manager'; }
        else { badgeEl.textContent = '일반 멤버'; badgeEl.className = 'role-badge role-member'; }
      }

      // 공통: 관리자/운영진일 경우에만 네비게이션 바에 '권한 관리' 메뉴 표시
      const navAdminMenu = document.getElementById("navAdminMenu");
      if (navAdminMenu && (data.role === "admin" || data.role === "manager")) {
        navAdminMenu.style.display = "inline-block";
      }
    }
  }
});

// ==========================================
// 🌍 글로벌 다국어 (i18n) 시스템 로직 (최종 완성본)
// ==========================================

const i18n = {
  ko: {
    "menu_home": "홈", "menu_notice": "공지사항", "menu_calendar": "활동 캘린더", 
    "menu_weekly": "주간 결산", "menu_members": "길드원 목록", "menu_admin": "권한 관리", "btn_logout": "로그아웃",
    "role_admin": "최고 관리자", "role_manager": "운영진", "role_member": "일반 멤버", "role_pending": "승인 대기",

    "main_welcome": "환영합니다, ", "main_desc": "원하시는 작업을 선택해주세요.",
    "main_card_notice": "📢 길드 공지사항", "main_card_notice_desc": "길드의 주요 소식과 안내 사항을 확인할 수 있습니다.",
    "main_card_calendar": "📅 활동 캘린더", "main_card_calendar_desc": "매일 접속하여 이계/명결 점수를 기록하고 관리하세요.",
    "main_card_weekly": "💰 주간 분배 현황", "main_card_weekly_desc": "이번 주 길드 활동 합산 점수와 보상 결산 내역을 확인합니다.",
    "main_card_members": "👥 길드원 목록", "main_card_members_desc": "현재 길드에 소속된 자랑스러운 멤버들의 상태를 확인하세요.",
    "main_admin_title_master": "👑 최고 관리자 메뉴", "main_admin_title_manager": "🛡️ 운영진 전용 메뉴", "main_admin_desc": "관리자 및 운영진에게만 보이는 특수 메뉴입니다.",
    "main_card_admin": "인원 승인 및 권한 관리", "main_card_admin_desc": "새로 가입한 대기자를 승인하거나 길드원의 직책을 설정합니다.",
    "main_card_strategy": "🗺️ 대항전 작전 지도", 
    "main_card_strategy_desc": "그리드 맵을 확인하고 길드장의 오더에 맞춰 행동하세요.",

    "weekly_title": "🏆 주간 길드 활동 랭킹 (실시간)", "weekly_desc": "일주일 평균 점수 합산을 기준으로 순위가 매겨집니다. 상위권에 도전하세요!",
    "col_rank": "순위", "col_nickname": "닉네임", "col_laby": "이계 (평균)", "col_duel": "명결 (평균)", "col_activity": "활약도 (평균)", "col_total": "합산 평균점수", "col_share": "기여 지분율", "col_reward": "예상 분배량",
    "msg_loading": "실시간 데이터를 불러오는 중입니다...", "msg_calc": "분배량을 계산 중입니다...", "msg_nodata": "이번 주 기록된 데이터가 없습니다.", "msg_total": "길드 총 합산 점수",
    "admin_title": "🛡️ 운영진 결산 및 분배 관리", "admin_desc": "상자 개수를 입력하여 분배량을 미리보기 한 뒤, 이번 주 공식 기록으로 확정하세요.", "admin_label": "📦 분배할 총 상자 개수", "btn_preview": "분배 계산 미리보기", "btn_confirm": "이대로 결산 확정 및 이력 저장",

    "att_title": "📅 활동 캘린더 (리셋: UTC 00시)", "att_desc": "'출석하기' 버튼을 눌러 점수를 입력하세요. (과거 출석 시 50% 패널티)", "att_modal_title": "활동 기록",
    "att_warning": "⚠️ 과거 날짜입니다.<br>입력하신 점수의 50%만 반영됩니다.", "att_laby": "⚔️ 이계 점수", "att_duel": "🛡️ 명결 점수", "att_activity": "🔥 길드 활약도 점수", "att_btn_cancel": "취소", "att_btn_save": "기록 저장", "att_btn_past": "👆 과거 출석", "att_btn_today": "👆 출석하기", "att_btn_done": "✅ 출석완료",

    "mem_title": "👥 길드원 목록", "mem_desc": "현재 ROIDER 길드에 소속된 자랑스러운 멤버들입니다.", "mem_count": "총 인원: ", "mem_empty": "표시할 길드원이 없습니다.",
    "adm_page_title": "🛠️ 인원 승인 및 권한 관리", "adm_page_desc": "<b>내 권한에 따라 가능한 작업이 다릅니다.</b><br>- 👑 관리자: 모든 직책 임명 및 강등 가능<br>- 🛡️ 운영진: 승인 대기자 길드원 승인 및 길드원 강등만 가능",
    "adm_filter_all": "전체 보기", "adm_filter_pending": "⏳ 승인 대기", "adm_filter_member": "⚔️ 일반 멤버", "adm_filter_manager": "🛡️ 운영진", "adm_filter_admin": "👑 관리자",
    "adm_btn_approve": "멤버 승인", "adm_btn_demote_pending": "대기 강등", "adm_btn_manager": "운영진 임명", "adm_btn_admin": "관리자 임명", "adm_btn_demote_member": "멤버 강등", "adm_btn_demote_manager": "운영진 강등", "adm_empty": "조건에 맞는 유저가 없습니다.",

    "noti_title": "📢 길드 공지사항", "noti_desc": "길드의 주요 소식과 안내 사항을 확인하세요.",
    "noti_empty": "등록된 공지사항이 없습니다.", "noti_btn_write": "✍️ 공지 작성",
    "noti_modal_title": "새 공지사항 작성", "noti_label_title": "제목", "noti_label_content": "내용",
    "noti_btn_cancel": "취소", "noti_btn_save": "공지 등록", "noti_btn_delete": "삭제",

    "menu_strategy": "작전 지도",
    "str_title": "🗺️ 대항전 작전 지도",
    "str_desc": "그리드 맵을 확인하고 길드장의 오더(공격/방어/인원)에 맞춰 행동하세요.",
    "str_vanguard": "⚔️ 선봉 지정",
    "str_vanguard_ph": "예: 길드원A, 길드원B (상단 루트 진행)",
    "str_upload_map": "지도 이미지 업로드",
    "str_btn_save": "💾 작전 저장 및 길드원에게 공유",
    "str_modal_title": "해당 구역 오더 설정",
    "str_order_type": "작전 명령",
    "str_type_none": "무배치 (비워둠)",
    "str_type_attack": "공격 (Attack)",
    "str_type_defense": "방어 (Defense)",
    "str_personnel": "투입 인원 (명)",
    "str_btn_cancel": "취소",
    "str_btn_apply": "적용",
    "str_empty_map": "등록된 작전 지도가 없습니다."

  },
  en: {
    "menu_home": "Home", "menu_notice": "Notices", "menu_calendar": "Calendar", 
    "menu_weekly": "Weekly Results", "menu_members": "Members", "menu_admin": "Admin", "btn_logout": "Logout",
    "role_admin": "Guild Master", "role_manager": "Manager", "role_member": "Member", "role_pending": "Pending",

    "main_welcome": "Welcome, ", "main_desc": "Please select a task you want to do.",
    "main_card_notice": "📢 Guild Notices", "main_card_notice_desc": "Check important guild news and announcements.",
    "main_card_calendar": "📅 Activity Calendar", "main_card_calendar_desc": "Log in daily to record and manage your scores.",
    "main_card_weekly": "💰 Weekly Distribution", "main_card_weekly_desc": "Check this week's total scores and reward distribution.",
    "main_card_members": "👥 Member List", "main_card_members_desc": "Check the status of proud guild members.",
    "main_admin_title_master": "👑 Guild Master Menu", "main_admin_title_manager": "🛡️ Manager Menu", "main_admin_desc": "Special menu visible only to Master and Managers.",
    "main_card_admin": "Member Approval & Roles", "main_card_admin_desc": "Approve new members or manage guild roles.",
    "main_card_strategy": "🗺️ Battle Drill Strategy", 
    "main_card_strategy_desc": "Check the grid map and follow the Master's orders.",

    "weekly_title": "🏆 Weekly Guild Ranking (Live)", "weekly_desc": "Rankings are based on the 7-day average score. Aim for the top!",
    "col_rank": "Rank", "col_nickname": "Nickname", "col_laby": "Arcane Labyrinth (Avg)", "col_duel": "Honor Duel (Avg)", "col_activity": "Activity (Avg)", "col_total": "Total Avg Score", "col_share": "Share (%)", "col_reward": "Est. Reward",
    "msg_loading": "Loading live data...", "msg_calc": "Calculating rewards...", "msg_nodata": "No data recorded for this week.", "msg_total": "Guild Total Score",
    "admin_title": "🛡️ Manager Settlement & Distribution", "admin_desc": "Enter total chests to preview, then confirm the official record.", "admin_label": "📦 Total Chests to Distribute", "btn_preview": "Preview Distribution", "btn_confirm": "Confirm Settlement & Save",

    "att_title": "📅 Activity Calendar (Reset: UTC 00:00)", "att_desc": "Click 'Attend' to enter scores. (50% penalty for past dates)", "att_modal_title": " Activity Record",
    "att_warning": "⚠️ Past date.<br>Only 50% of the entered score will be applied.", 
    "att_laby": "⚔️ Arcane Labyrinth Score", "att_duel": "🛡️ Honor Duel Score", "att_activity": "🔥 Guild Activity Score", "att_btn_cancel": "Cancel", "att_btn_save": "Save Record", "att_btn_past": "👆 Past Attend", "att_btn_today": "👆 Attend", "att_btn_done": "✅ Completed",

    "mem_title": "👥 Member List", "mem_desc": "These are the proud members of the ROIDER guild.", "mem_count": "Total Members: ", "mem_empty": "No members to display.",
    "adm_page_title": "🛠️ Approval & Role Management", "adm_page_desc": "<b>Available actions depend on your role.</b><br>- 👑 Master: Can appoint and demote all roles.<br>- 🛡️ Manager: Can approve pending members and demote members.",
    "adm_filter_all": "View All", "adm_filter_pending": "⏳ Pending", "adm_filter_member": "⚔️ Member", "adm_filter_manager": "🛡️ Manager", "adm_filter_admin": "👑 Master",
    "adm_btn_approve": "Approve", "adm_btn_demote_pending": "To Pending", "adm_btn_manager": "To Manager", "adm_btn_admin": "To Master", "adm_btn_demote_member": "To Member", "adm_btn_demote_manager": "To Manager", "adm_empty": "No users match the criteria.",

    "noti_title": "📢 Guild Notices", "noti_desc": "Check important guild news and announcements.",
    "noti_empty": "No notices posted yet.", "noti_btn_write": "✍️ Write Notice",
    "noti_modal_title": "Write New Notice", "noti_label_title": "Title", "noti_label_content": "Content",
    "noti_btn_cancel": "Cancel", "noti_btn_save": "Post Notice", "noti_btn_delete": "Delete",

    "menu_strategy": "Strategy Map",
    "str_title": "🗺️ Battle Drill Strategy",
    "str_desc": "Check the grid map and follow the Master's orders (Attack/Defense).",
    "str_vanguard": "⚔️ Vanguard",
    "str_vanguard_ph": "e.g., Member A, Member B (Top Route)",
    "str_upload_map": "Upload Map Image",
    "str_btn_save": "💾 Save & Share Strategy",
    "str_modal_title": "Set Order for this Zone",
    "str_order_type": "Command Type",
    "str_type_none": "No Deployment",
    "str_type_attack": "Attack",
    "str_type_defense": "Defense",
    "str_personnel": "Personnel Required",
    "str_btn_cancel": "Cancel",
    "str_btn_apply": "Apply",
    "str_empty_map": "No strategy map uploaded yet."
  }
};

let currentLang = localStorage.getItem("guild_lang") || "ko";

function applyLanguage() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18n[currentLang] && i18n[currentLang][key]) {
      el.innerHTML = i18n[currentLang][key]; 
    }
  });
  const langBtn = document.getElementById("langToggleBtn");
  if (langBtn) { langBtn.textContent = currentLang === "ko" ? "🌐 EN" : "🌐 KR"; }
}

function toggleLanguage() {
  currentLang = currentLang === "ko" ? "en" : "ko";
  localStorage.setItem("guild_lang", currentLang);
  location.reload(); 
}

document.addEventListener("DOMContentLoaded", applyLanguage);