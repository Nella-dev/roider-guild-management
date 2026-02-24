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