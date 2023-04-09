import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, limit} from "firebase/firestore";

// eslint-disable-next-line
import { ref, onUnmounted, computed } from "vue";

const firebaseConfig = {
  apiKey: "AIzaSyBkRSdcssdxr48bcyx6n6XmD7p-7VOuXtQ",
  authDomain: "techdemo-vuejs-firebase-01.firebaseapp.com",
  databaseURL: "https://techdemo-vuejs-firebase-01-default-rtdb.firebaseio.com",
  projectId: "techdemo-vuejs-firebase-01",
  storageBucket: "techdemo-vuejs-firebase-01.appspot.com",
  messagingSenderId: "248694189739",
  appId: "1:248694189739:web:0d6edf640e74963669d1ee",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export function useAuth() {
  const user = ref(null);
  const unsubscribe = auth.onAuthStateChanged((_user) => (user.value = _user));
  onUnmounted(unsubscribe);
  const isLogin = computed(() => user.value !== null);

  const signIn = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(googleProvider);
      user.value = result.user;
    } catch (error) {
      console.error(error);
    }
  };
  const signOut = () => auth.signOut();

  return { user, isLogin, signIn, signOut };
}

const messagesCollection = collection(db, "messages");
const messagesQuery = query(messagesCollection, orderBy("createdAt", "desc"), limit(100));

export function useChat() {
  const messages = ref([]);
  const unsubscribe = messagesQuery.onSnapshot((snapshot) => {
    messages.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .reverse();
  });
  onUnmounted(unsubscribe);

  const { user, isLogin } = useAuth();
  const sendMessage = async (text) => {
    if (!isLogin.value) return;
    const { photoURL, uid, displayName } = user.value;
    //Add a new message to the collection
    await addDoc(messagesCollection, {
      userName: displayName,
      userId: uid,
      userPhotoURL: photoURL,
      text: text,
      createdAt: new Date().toISOString(),
    });
  };

  return { messages, sendMessage };
}
