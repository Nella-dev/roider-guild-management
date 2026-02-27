// firebase_config.js - 공통 인증 및 다국어 로직

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

// 🔥 통합 Auth 리스너
auth.onAuthStateChanged(async (user) => {
  const isLoginPg = window.isLoginPage || location.pathname.includes("login.html");

  if (!user) {
    if (!isLoginPg) {
      location.replace("./login.html");
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

  // 신규 유저 데이터 생성 (기존 login.html 로직 통합)
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

  // 로그인 페이지에서 접속 시 분기 처리
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

  // UI 업데이트 로직 (기존 유지)
  const userNameEl = document.getElementById("userName");
  const userPhotoEl = document.getElementById("userPhoto");
  const badgeEl = document.getElementById("myRoleBadge");
  const navAdminMenu = document.getElementById("navAdminMenu");

  if (userNameEl) userNameEl.textContent = data.nickname || "User";
  if (userPhotoEl) {
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nickname || 'U')}&background=2a3242&color=f4c430&bold=true`;
    userPhotoEl.src = user.photoURL || avatarUrl;
    userPhotoEl.onerror = () => { userPhotoEl.src = avatarUrl; };
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

  // 온라인 상태 업데이트
  userRef.set({
    online: true,
    lastActive: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  window.addEventListener("beforeunload", () => {
    userRef.set({ online: false, lastActive: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
  });
});