// firebase_config.js - 공통 인증 및 다국어 로직 (SAFE PATCHED)
// 원본 로직 유지 + DOM null 가드 및 중복 초기화 방지

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
  auth.signOut().then(() => { location.replace("login.html"); });
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    const currentPath = window.location.pathname.split("/").pop() || "main.html";
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("href") === currentPath) { link.classList.add("active"); }
    });
  } catch (e) {
    console.warn("Nav highlight skipped:", e.message);
  }
});

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    if (!location.pathname.endsWith("login.html")) {
      location.replace("login.html");
    }
    return;
  }

  let docSnap;
  try {
    docSnap = await db.collection("users").doc(user.uid).get();
  } catch (e) {
    console.error("Failed to fetch user doc:", e);
    return;
  }

  if (!docSnap || !docSnap.exists) return;

  const data = docSnap.data();

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
    if (data.role === "admin" || data.role === "manager") {
      navAdminMenu.style.display = "inline-block";
    } else {
      navAdminMenu.style.display = "none";
    }
  }
});
