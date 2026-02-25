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