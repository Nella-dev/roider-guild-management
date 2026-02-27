// firebase_config.js - 공통 인증 및 다국어 로직 (안정화 풀 코드)

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

// 🔥 통합 Auth 리스너 (리다이렉트 루프 해결 버전)
auth.onAuthStateChanged(async (user) => {
  const isLoginPg = window.isLoginPage || location.pathname.includes("login.html");

  // 1. 로그아웃 상태일 때
  if (!user) {
    if (!isLoginPg) {
      // 💡 세션 로딩 대기: 즉시 튕기지 않고 1초 뒤에 currentUser가 여전히 없는지 확인
      setTimeout(() => {
        if (!auth.currentUser) {
          location.replace("./login.html");
        }
      }, 1000);
    }
    return;
  }

  // 2. 로그인 상태일 때 데이터 가져오기
  const userRef = db.collection("users").doc(user.uid);
  let docSnap;
  try {
    docSnap = await userRef.get();
  } catch (e) {
    console.error("Failed to fetch user doc:", e);
    return;
  }

  // 3. 신규 유저 등록 (기존 로직 통합)
  if (!docSnap.exists) {
    await userRef.set({
      uid: user.uid,
      email: user.email,
      nickname: "",
      role: "pending",
      country: navigator.language.startsWith("ko") ? "KR" : "EN",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    location.replace("./nickname.html");
    return;
  }

  const data = docSnap.data();

  // 4. 로그인 페이지에서의 리다이렉트 분기
  if (isLoginPg) {
    if (!data.nickname) {
      location.replace("./nickname.html");
    } else if (data.role === "pending") {
      location.replace("./pending.html");
    } else {
      location.replace("./main.html");
    }
    return;
  }

  // 5. 헤더 UI 업데이트 (기존 로직 유지)
  const userNameEl = document.getElementById("userName");
  const userPhotoEl = document.getElementById("userPhoto");
  const badgeEl = document.getElementById("myRoleBadge");
  const navAdminMenu = document.getElementById("navAdminMenu");

  if (userNameEl) {
    userNameEl.textContent = data.nickname || "User";
  }

  if (userPhotoEl) {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nickname || 'U')}&background=2a3242&color=f4c430&bold=true`;
    userPhotoEl.src = user.photoURL || avatarUrl;
    userPhotoEl.onerror = () => {
      userPhotoEl.src = avatarUrl;
    };
  }

  if (badgeEl) {
    badgeEl.style.display = "inline-block";
    badgeEl.textContent = data.role || "";
    badgeEl.className = `role-badge role-${data.role || 'member'}`;
  }

  if (navAdminMenu) {
    const allowedRoles = ["admin", "manager"];
    navAdminMenu.style.display = allowedRoles.includes(data.role) ? "inline-block" : "none";
  }

  // 6. 온라인 상태 업데이트
  userRef.set({
    online: true,
    lastActive: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  window.addEventListener("beforeunload", () => {
    userRef.set({
      online: false,
      lastActive: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

});