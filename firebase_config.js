// firebase_config.js - 공통 인증 및 다국어 로직 (FINAL STABLE VERSION)

if (typeof firebaseConfig !== 'undefined') {
  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  } catch (e) {
    console.warn("Firebase already initialized or init skipped:", e.message);
  }
} else {
  console.error("firebase_key.js를 찾을 수 없습니다.");
}

const auth = firebase.auth();
const db = firebase.firestore();

function logout() {
  auth.signOut().then(() => {
    location.replace("login.html");
  });
}

// 🔹 네비게이션 active 처리
document.addEventListener("DOMContentLoaded", () => {
  try {
    const currentPath = window.location.pathname.split("/").pop() || "main.html";
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      }
    });
  } catch (e) {
    console.warn("Nav highlight skipped:", e.message);
  }
});

// 🔥🔥🔥 단 하나의 Auth 리스너 (중복 제거 완료)
auth.onAuthStateChanged(async (user) => {

  if (!user) {
    if (!location.pathname.endsWith("login.html")) {
      location.replace("login.html");
    }
    return;
  }

  const userRef = db.collection("users").doc(user.uid);

  let docSnap;
  try {
    docSnap = await userRef.get();
  } catch (e) {
    console.error("Failed to fetch user doc:", e);
    return;
  }

  if (!docSnap.exists) {
    console.warn("User document not found.");
    return;
  }

  const data = docSnap.data();

  // 🔹 헤더 요소들
  const userNameEl = document.getElementById("userName");
  const userPhotoEl = document.getElementById("userPhoto");
  const badgeEl = document.getElementById("myRoleBadge");
  const navAdminMenu = document.getElementById("navAdminMenu");

  // 🔹 닉네임 표시
  if (userNameEl) {
    userNameEl.textContent = data.nickname || "User";
  }

  // 🔹 프로필 이미지
  if (userPhotoEl) {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nickname || 'U')}&background=2a3242&color=f4c430&bold=true`;
    userPhotoEl.src = user.photoURL || avatarUrl;
    userPhotoEl.onerror = () => {
      userPhotoEl.src = avatarUrl;
    };
  }

  // 🔹 역할 뱃지 표시
  if (badgeEl) {
    badgeEl.style.display = "inline-block";
    badgeEl.textContent = data.role || "";
    badgeEl.className = `role-badge role-${data.role || 'member'}`;
  }

  // 🔹 관리자 메뉴 표시 여부
  if (navAdminMenu) {
    if (data.role === "admin" || data.role === "manager") {
      navAdminMenu.style.display = "inline-block";
    } else {
      navAdminMenu.style.display = "none";
    }
  }

  // 🔥 온라인 상태 업데이트 (merge 필수)
  userRef.set({
    online: true,
    lastActive: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  // 🔥 브라우저 종료 시 오프라인 처리
  window.addEventListener("beforeunload", () => {
    userRef.set({
      online: false,
      lastActive: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

});