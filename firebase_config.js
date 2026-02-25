// firebase_config.js

// 1. 파이어베이스 초기화 (firebase_key.js가 반드시 HTML 상단에서 먼저 로드되어야 합니다)
if (typeof firebaseConfig !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} else {
  console.error("Firebase 설정값을 찾을 수 없습니다. firebase_key.js 파일을 확인해주세요.");
}

const auth = firebase.auth();
const db = firebase.firestore();

// 2. 공통 로그아웃 함수
function logout() {
  auth.signOut().then(() => {
    alert("로그아웃 되었습니다.");
    location.replace("login.html");
  }).catch((error) => {
    alert("로그아웃 실패: " + error.message);
  });
}

// 3. 현재 메뉴 활성화 표시
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});

// 4. 헤더 정보 및 권한 제어 로직 (프로필 깨짐 및 로딩 멈춤 해결)
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const docSnap = await db.collection("users").doc(user.uid).get();
    if (docSnap.exists) {
      const data = docSnap.data();
      
      const userNameEl = document.getElementById("userName");
      const userPhotoEl = document.getElementById("userPhoto");
      
      if (userNameEl) userNameEl.textContent = data.nickname || "User";
      
      // 💡 프로필 엑스박스 방지: 이미지가 없으면 이니셜 아바타 표시
      if (userPhotoEl) {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nickname || 'U')}&background=2a3242&color=f4c430&bold=true`;
        userPhotoEl.src = user.photoURL || avatarUrl;
        userPhotoEl.onerror = () => { userPhotoEl.src = avatarUrl; };
      }

      // 직책 뱃지 처리
      const badgeEl = document.getElementById("myRoleBadge");
      if (badgeEl) {
        badgeEl.style.display = "inline-block";
        const roleKey = `role_${data.role}`;
        badgeEl.textContent = i18n[currentLang][roleKey] || data.role;
        badgeEl.className = `role-badge role-${data.role}`;
      }

      // 관리자 메뉴 노출
      const navAdminMenu = document.getElementById("navAdminMenu");
      if (navAdminMenu) {
        if (data.role === "admin" || data.role === "manager") {
          navAdminMenu.style.display = "inline-block";
        } else {
          navAdminMenu.style.display = "none";
        }
      }
    }
  }
});

// 5. 🌍 글로벌 다국어 (i18n) 시스템 (작전 지도 포함)
const i18n = {
  ko: {
    "menu_home": "홈", "menu_notice": "공지사항", "menu_calendar": "활동 캘린더", 
    "menu_weekly": "주간 결산", "menu_members": "길드원 목록", "menu_admin": "권한 관리", "btn_logout": "로그아웃",
    "role_admin": "최고 관리자", "role_manager": "운영진", "role_member": "일반 멤버", "role_pending": "승인 대기",
    "main_welcome": "환영합니다, ", "main_desc": "원하시는 작업을 선택해주세요.",
    "main_card_notice": "📢 길드 공지사항", "main_card_notice_desc": "주요 소식과 안내 사항을 확인할 수 있습니다.",
    "main_card_calendar": "📅 활동 캘린더", "main_card_calendar_desc": "이계/명결 점수를 기록하고 관리하세요.",
    "main_card_weekly": "💰 주간 분배 현황", "main_card_weekly_desc": "활동 합산 점수와 보상 결산 내역을 확인합니다.",
    "main_card_strategy": "🗺️ 대항전 작전 지도", "main_card_strategy_desc": "그리드 맵을 확인하고 길드장의 오더에 맞게 행동하세요.",
    "main_card_members": "👥 길드원 목록", "main_card_members_desc": "길드에 소속된 멤버들의 상태를 확인하세요.",
    "weekly_title": "🏆 주간 길드 활동 랭킹 (실시간)", "weekly_desc": "일주일 평균 점수 합산을 기준으로 순위가 매겨집니다.",
    "col_rank": "순위", "col_nickname": "닉네임", "col_laby": "이계 (평균)", "col_duel": "명결 (평균)", "col_activity": "활약도 (평균)", "col_total": "합산 평균점수", "col_share": "기여 지분율", "col_reward": "예상 분배량",
    "admin_title": "🛡️ 운영진 결산 및 분배 관리", "admin_desc": "상자 개수를 입력하여 분배량을 확인하고 확정하세요.", "admin_label": "📦 분배할 총 상자 개수", "btn_preview": "분배 계산 미리보기", "btn_confirm": "이대로 결산 확정 및 이력 저장",
    "noti_title": "📢 길드 공지사항", "noti_desc": "안내 사항을 확인하세요.", "noti_empty": "공지사항이 없습니다.", "noti_btn_delete": "삭제",
    "mem_count": "총 인원: ", "mem_empty": "길드원이 없습니다.",
    "adm_empty": "조건에 맞는 유저가 없습니다.",
    "menu_strategy": "작전 지도", "str_title": "🗺️ 대항전 작전 지도", "str_desc": "길드장의 작전 명령을 확인하세요.", "str_vanguard": "⚔️ 선봉 지정", "str_upload_map": "지도 이미지 업로드", "str_btn_save": "💾 작전 저장 및 공유", "str_empty_map": "등록된 지도가 없습니다."
  },
  en: {
    "menu_home": "Home", "menu_notice": "Notices", "menu_calendar": "Calendar", 
    "menu_weekly": "Weekly Results", "menu_members": "Members", "menu_admin": "Admin", "btn_logout": "Logout",
    "role_admin": "Guild Master", "role_manager": "Manager", "role_member": "Member", "role_pending": "Pending",
    "main_welcome": "Welcome, ", "main_desc": "Please select a task.",
    "main_card_notice": "📢 Guild Notices", "main_card_notice_desc": "Check important guild news.",
    "main_card_calendar": "📅 Activity Calendar", "main_card_calendar_desc": "Record your scores daily.",
    "main_card_weekly": "💰 Weekly Distribution", "main_card_weekly_desc": "Check scores and reward distribution.",
    "main_card_strategy": "🗺️ Battle Drill Strategy", "main_card_strategy_desc": "Check the grid map and follow orders.",
    "main_card_members": "👥 Member List", "main_card_members_desc": "Check the status of guild members.",
    "weekly_title": "🏆 Weekly Guild Ranking", "weekly_desc": "Rankings are based on the 7-day average score.",
    "col_rank": "Rank", "col_nickname": "Nickname", "col_laby": "Arcane Labyrinth (Avg)", "col_duel": "Honor Duel (Avg)", "col_activity": "Activity (Avg)", "col_total": "Total Score", "col_share": "Share (%)", "col_reward": "Est. Reward",
    "admin_title": "🛡️ Manager Settlement", "admin_desc": "Enter total chests to settle rewards.", "admin_label": "📦 Total Chests", "btn_preview": "Preview", "btn_confirm": "Confirm & Save",
    "noti_title": "📢 Guild Notices", "noti_desc": "Check important announcements.", "noti_empty": "No notices found.", "noti_btn_delete": "Delete",
    "mem_count": "Total Members: ", "mem_empty": "No members found.",
    "adm_empty": "No users found.",
    "menu_strategy": "Strategy Map", "str_title": "🗺️ Strategy Map", "str_desc": "Follow the Master's orders.", "str_vanguard": "⚔️ Vanguard", "str_upload_map": "Upload Map", "str_btn_save": "💾 Save & Share", "str_empty_map": "No map uploaded."
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