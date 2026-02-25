// firebase_config.js
// 파이어베이스 핵심 설정 및 공통 인증 로직을 담당합니다.

const firebaseConfig = {
  // 올려주신 기존 키값들을 사용합니다. 
  // (실제 운영 시 Github 같은 공개된 곳에 올리지 않도록 주의하세요!)
  apiKey: "AIzaSyCbqEcGsdSDBZs8PjiI05YRNEGupLf3nSc",
  authDomain: "roider-guild-management.firebaseapp.com",
  projectId: "roider-guild-management",
  storageBucket: "roider-guild-management.firebasestorage.app",
  messagingSenderId: "1012249034459",
  appId: "1:1012249034459:web:ec0f821f29170446af96fe",
  measurementId: "G-J7W4LFLHPP"
};

// 파이어베이스 초기화
if (!firebase.apps.length) {
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

// [firebase_config.js 파일 맨 아래에 추가할 내용]

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
// 🌍 글로벌 다국어 (i18n) 시스템 로직
// ==========================================

// 1. 단어장 (번역 사전) 세팅
const i18n = {
  ko: {
    // 공통 메뉴
    "menu_home": "홈",
    "menu_notice": "공지사항",
    "menu_calendar": "활동 캘린더",
    "menu_weekly": "주간 결산",
    "menu_members": "길드원 목록",
    "menu_admin": "권한 관리",
    "btn_logout": "로그아웃",
    
    // 직책
    "role_admin": "최고 관리자",
    "role_manager": "운영진",
    "role_member": "일반 멤버",

    // 주간 결산 (예시)
    "weekly_title": "🏆 주간 길드 활동 랭킹 (실시간)",
    "weekly_desc": "일주일 평균 점수 합산을 기준으로 순위가 매겨집니다. 상위권에 도전하세요!",
    "col_rank": "순위",
    "col_nickname": "닉네임",
    "col_laby": "이계 (평균)",
    "col_duel": "명결 (평균)",
    "col_activity": "활약도 (평균)",
    "col_total": "합산 평균점수",
    "col_share": "기여 지분율",
    "col_reward": "예상 분배량"
  },
  en: {
    // Common Menu
    "menu_home": "Home",
    "menu_notice": "Notices",
    "menu_calendar": "Calendar",
    "menu_weekly": "Weekly Results",
    "menu_members": "Members",
    "menu_admin": "Admin",
    "btn_logout": "Logout",
    
    // Roles
    "role_admin": "Guild Master",
    "role_manager": "Manager",
    "role_member": "Member",

    // Weekly (Example)
    "weekly_title": "🏆 Weekly Guild Activity Ranking (Live)",
    "weekly_desc": "Rankings are based on the 7-day average score. Aim for the top!",
    "col_rank": "Rank",
    "col_nickname": "Nickname",
    "col_laby": "Dream Realm (Avg)",
    "col_duel": "Arena (Avg)",
    "col_activity": "Activity (Avg)",
    "col_total": "Total Avg Score",
    "col_share": "Contribution (%)",
    "col_reward": "Est. Reward"
  }
};

// 2. 현재 언어 가져오기 (기본값: 한국어)
let currentLang = localStorage.getItem("guild_lang") || "ko";

// 3. 페이지 텍스트 번역 실행 함수
function applyLanguage() {
  // 화면에 data-i18n 이름표가 붙은 모든 글씨를 찾아서 바꿈
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18n[currentLang][key]) {
      el.textContent = i18n[currentLang][key];
    }
  });

  // 언어 변경 버튼 글씨 업데이트
  const langBtn = document.getElementById("langToggleBtn");
  if (langBtn) {
    langBtn.textContent = currentLang === "ko" ? "🌐 EN" : "🌐 KR";
  }
}

// 4. 언어 변경 토글 버튼용 함수
function toggleLanguage() {
  currentLang = currentLang === "ko" ? "en" : "ko";
  localStorage.setItem("guild_lang", currentLang); // 브라우저에 저장
  applyLanguage(); // 화면 즉시 번역
  location.reload(); // (선택) JS로 그려진 표 등을 완벽하게 리셋하기 위해 새로고침
}

// 페이지 로딩이 끝나면 무조건 번역 한 번 실행!
document.addEventListener("DOMContentLoaded", applyLanguage);