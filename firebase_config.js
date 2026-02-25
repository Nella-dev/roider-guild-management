// firebase_config.js

/**
 * 💡 보안 알림:
 * HTML 상단에서 <script src="firebase_key.js"></script>를 먼저 호출해야 합니다.
 * firebase_key.js 안에는 const firebaseConfig = { ... }; 내용이 들어있어야 합니다.
 */

// 1. 파이어베이스 초기화
if (typeof firebaseConfig !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} else {
  console.error("Firebase 설정(firebaseConfig)을 찾을 수 없습니다. firebase_key.js 파일을 확인해주세요.");
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

// 3. 네비게이션 활성화 표시
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link");
  
  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});

// 4. 헤더 정보 및 권한 제어 (끊겼던 부분 수정 완료)
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const docSnap = await db.collection("users").doc(user.uid).get();
    if (docSnap.exists) {
      const data = docSnap.data();
      
      const userNameEl = document.getElementById("userName");
      const userPhotoEl = document.getElementById("userPhoto");
      
      if (userNameEl) userNameEl.textContent = data.nickname || "User";
      
      if (userPhotoEl) {
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nickname || 'U')}&background=2a3242&color=f4c430&bold=true`;
        userPhotoEl.src = user.photoURL || defaultAvatar;
        userPhotoEl.onerror = () => { userPhotoEl.src = defaultAvatar; };
      }

      // 직책 뱃지 표시
      const badgeEl = document.getElementById("myRoleBadge");
      if (badgeEl) {
        badgeEl.style.display = "inline-block";
        if (data.role === 'admin') { 
          badgeEl.textContent = '최고 관리자'; badgeEl.className = 'role-badge role-admin'; 
        } else if (data.role === 'manager') { 
          badgeEl.textContent = '운영진'; badgeEl.className = 'role-badge role-manager'; 
        } else { 
          badgeEl.textContent = '일반 멤버'; badgeEl.className = 'role-badge role-member'; 
        }
      }

      // 💡 수정된 부분: 관리자 메뉴 노출 제어 (끊겼던 문장 완성)
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

// 5. 다국어 시스템 로직 (i18n 사전 데이터 생략, 함수만 포함)
// (기존에 가지고 계신 i18n = { ... } 데이터 뒤에 아래 함수들을 두시면 됩니다.)
// 5. 다국어 시스템 로직 (i18n 사전 데이터 생략, 함수만 포함)
// (기존에 가지고 계신 i18n = { ... } 데이터 뒤에 아래 함수들을 두시면 됩니다.)
function applyLanguage() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (i18n[currentLang] && i18n[currentLang][key]) {
            el.innerHTML = i18n[currentLang][key];
        }
    });
}