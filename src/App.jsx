import { useState, useEffect } from "react";

const C = {
  primary: "#5B4FCF", primaryDark: "#4338CA", primaryLight: "#EEF0FF",
  accent: "#10B981", accentLight: "#E8FAF0",
  bg: "#F7F6FF", card: "#FFFFFF", text: "#1A1A2E", muted: "#6B7280",
  danger: "#E53935", warn: "#F59E0B", blue: "#3B82F6", blueLight: "#DBEAFE",
};

const EXERCISES = {
  push: [
    { name: "Push-ups", sets: "3×15", muscle: "Chest, Triceps", cal: 60 },
    { name: "Incline Push-ups", sets: "3×12", muscle: "Upper Chest", cal: 50 },
    { name: "Dumbbell Bench Press", sets: "4×10", muscle: "Chest, Triceps", cal: 80 },
    { name: "Overhead Press", sets: "3×10", muscle: "Shoulders, Triceps", cal: 70 },
    { name: "Tricep Dips", sets: "3×12", muscle: "Triceps", cal: 55 },
    { name: "Diamond Push-ups", sets: "3×10", muscle: "Triceps, Inner Chest", cal: 60 },
    { name: "Pike Push-ups", sets: "3×10", muscle: "Shoulders", cal: 50 },
    { name: "Chest Flyes", sets: "3×12", muscle: "Chest", cal: 55 },
  ],
  pull: [
    { name: "Pull-ups", sets: "3×8", muscle: "Back, Biceps", cal: 80 },
    { name: "Dumbbell Rows", sets: "3×12", muscle: "Upper Back", cal: 70 },
    { name: "Bicep Curls", sets: "3×15", muscle: "Biceps", cal: 50 },
    { name: "Lat Pulldown", sets: "3×12", muscle: "Lats", cal: 75 },
    { name: "Hammer Curls", sets: "3×12", muscle: "Biceps, Forearms", cal: 50 },
    { name: "Seated Cable Row", sets: "3×12", muscle: "Mid Back", cal: 70 },
    { name: "Face Pulls", sets: "3×15", muscle: "Rear Delts", cal: 45 },
    { name: "Chin-ups", sets: "3×8", muscle: "Biceps, Back", cal: 80 },
  ],
  legs: [
    { name: "Squats", sets: "4×15", muscle: "Quads, Glutes", cal: 120 },
    { name: "Lunges", sets: "3×12 each", muscle: "Quads, Hamstrings", cal: 100 },
    { name: "Romanian Deadlift", sets: "3×12", muscle: "Hamstrings, Glutes", cal: 110 },
    { name: "Glute Bridge", sets: "3×20", muscle: "Glutes", cal: 70 },
    { name: "Calf Raises", sets: "4×20", muscle: "Calves", cal: 50 },
    { name: "Step-ups", sets: "3×12 each", muscle: "Quads, Glutes", cal: 90 },
    { name: "Sumo Squats", sets: "3×15", muscle: "Inner Thighs", cal: 100 },
    { name: "Leg Press", sets: "4×12", muscle: "Quads, Hamstrings", cal: 110 },
  ],
  shoulders: [
    { name: "Arnold Press", sets: "3×12", muscle: "All Delts", cal: 65 },
    { name: "Lateral Raises", sets: "3×15", muscle: "Side Delts", cal: 45 },
    { name: "Front Raises", sets: "3×12", muscle: "Front Delts", cal: 45 },
    { name: "Upright Rows", sets: "3×12", muscle: "Traps, Delts", cal: 60 },
    { name: "Shoulder Press (DB)", sets: "4×10", muscle: "All Delts", cal: 70 },
    { name: "Rear Delt Flyes", sets: "3×15", muscle: "Rear Delts", cal: 45 },
    { name: "Shrugs", sets: "3×20", muscle: "Traps", cal: 40 },
    { name: "Cable Lateral Raise", sets: "3×15", muscle: "Side Delts", cal: 45 },
  ],
  core: [
    { name: "Plank", sets: "3×60 sec", muscle: "Full Core", cal: 40 },
    { name: "Crunches", sets: "3×25", muscle: "Upper Abs", cal: 35 },
    { name: "Leg Raises", sets: "3×15", muscle: "Lower Abs", cal: 40 },
    { name: "Russian Twists", sets: "3×20", muscle: "Obliques", cal: 45 },
    { name: "Mountain Climbers", sets: "3×30 sec", muscle: "Core, Cardio", cal: 60 },
    { name: "Bicycle Crunches", sets: "3×20", muscle: "Obliques", cal: 45 },
    { name: "Dead Bug", sets: "3×10 each", muscle: "Deep Core", cal: 35 },
    { name: "Side Plank", sets: "3×45 sec", muscle: "Obliques", cal: 40 },
  ],
};

const YOGA = {
  flexibility: [
    { name: "Uttanasana (Standing Forward Fold)", dur: "5 min", benefit: "Hamstrings & spine stretch" },
    { name: "Paschimottanasana (Seated Forward Bend)", dur: "5 min", benefit: "Full back body stretch" },
    { name: "Pigeon Pose", dur: "5 min each", benefit: "Hip flexor release" },
    { name: "Gomukhasana (Cow Face)", dur: "4 min", benefit: "Shoulders & hips" },
    { name: "Supta Matsyendrasana (Spinal Twist)", dur: "4 min", benefit: "Spine mobility" },
    { name: "Anjaneyasana (Low Lunge)", dur: "3 min each", benefit: "Hip flexors & quads" },
  ],
  strength: [
    { name: "Virabhadrasana I (Warrior I)", dur: "4 min", benefit: "Legs, core & arms" },
    { name: "Virabhadrasana II (Warrior II)", dur: "4 min", benefit: "Leg endurance" },
    { name: "Chaturanga Dandasana", dur: "3×30 sec", benefit: "Arms, core & shoulders" },
    { name: "Utkatasana (Chair Pose)", dur: "3×45 sec", benefit: "Quads & glutes" },
    { name: "Navasana (Boat Pose)", dur: "3×30 sec", benefit: "Core strength" },
    { name: "Adho Mukha Svanasana (Downdog)", dur: "5 min", benefit: "Full body" },
  ],
  balance: [
    { name: "Vrikshasana (Tree Pose)", dur: "3 min each", benefit: "Balance & focus" },
    { name: "Garudasana (Eagle Pose)", dur: "3 min each", benefit: "Concentration" },
    { name: "Natarajasana (Dancer Pose)", dur: "2 min each", benefit: "Balance & flexibility" },
    { name: "Ardha Chandrasana (Half Moon)", dur: "3 min each", benefit: "Balance & stretch" },
    { name: "Virabhadrasana III (Warrior III)", dur: "3 min each", benefit: "Full body balance" },
    { name: "Bakasana (Crow Pose)", dur: "Attempt 5×", benefit: "Arm balance" },
  ],
  breathing: [
    { name: "Anulom Vilom (Alternate Nostril)", dur: "10 min", benefit: "Nervous system" },
    { name: "Kapalbhati (Skull Shining)", dur: "5 min", benefit: "Digestion & energy" },
    { name: "Bhramari (Bee Breath)", dur: "5 min", benefit: "Stress relief" },
    { name: "Ujjayi (Ocean Breath)", dur: "Throughout", benefit: "Focus & breath control" },
    { name: "Sitali (Cooling Breath)", dur: "3 min", benefit: "Calming & cooling" },
    { name: "Bhastrika (Bellows Breath)", dur: "3 min", benefit: "Energy & detox" },
  ],
  relaxation: [
    { name: "Shavasana (Corpse Pose)", dur: "10–15 min", benefit: "Full body reset" },
    { name: "Yoga Nidra", dur: "20 min guided", benefit: "Deep relaxation" },
    { name: "Balasana (Child's Pose)", dur: "5 min", benefit: "Calm & surrender" },
    { name: "Viparita Karani (Legs-up-Wall)", dur: "10 min", benefit: "Circulation" },
    { name: "Supta Baddha Konasana", dur: "8 min", benefit: "Hip release" },
    { name: "Makarasana (Crocodile Pose)", dur: "5 min", benefit: "Lower back relief" },
  ],
  "50plus": [
    { name: "Tadasana (Mountain Pose)", dur: "5 min", benefit: "Posture & grounding" },
    { name: "Marjaryasana (Cat-Cow)", dur: "5 min", benefit: "Spine mobility" },
    { name: "Setu Bandhasana (Bridge)", dur: "4 min", benefit: "Hip & spine health" },
    { name: "Viparita Karani (Legs-up-Wall)", dur: "10 min", benefit: "Joint relief" },
    { name: "Anulom Vilom", dur: "10 min", benefit: "Lung health & calm" },
    { name: "Shavasana", dur: "15 min", benefit: "Deep rest" },
  ],
};

const NEPALI_FOODS = [
  { name: "Dal Bhat (1 plate)", cal: 450, protein: 18, carbs: 72, fat: 8 },
  { name: "Sel Roti (2 pcs)", cal: 280, protein: 5, carbs: 52, fat: 7 },
  { name: "Momo (8 pcs, veg)", cal: 300, protein: 12, carbs: 42, fat: 8 },
  { name: "Momo (8 pcs, chicken)", cal: 360, protein: 22, carbs: 40, fat: 10 },
  { name: "Gundruk Soup", cal: 90, protein: 5, carbs: 12, fat: 2 },
  { name: "Thukpa (1 bowl)", cal: 320, protein: 14, carbs: 48, fat: 7 },
  { name: "Chatamari", cal: 250, protein: 10, carbs: 38, fat: 6 },
  { name: "Aloo Tama", cal: 180, protein: 6, carbs: 28, fat: 5 },
  { name: "Yomari (1 pc)", cal: 130, protein: 3, carbs: 25, fat: 3 },
  { name: "Juju Dhau (1 cup)", cal: 160, protein: 8, carbs: 22, fat: 5 },
  { name: "Dhido (1 bowl)", cal: 290, protein: 8, carbs: 58, fat: 3 },
  { name: "Bara (2 pcs)", cal: 220, protein: 10, carbs: 32, fat: 6 },
  { name: "Poha", cal: 250, protein: 6, carbs: 48, fat: 4 },
  { name: "Idli (3) + Sambar", cal: 220, protein: 9, carbs: 42, fat: 3 },
  { name: "Dal + 2 Roti", cal: 380, protein: 16, carbs: 62, fat: 7 },
  { name: "Rajma Chawal", cal: 420, protein: 18, carbs: 72, fat: 6 },
  { name: "Palak Paneer + Roti", cal: 430, protein: 18, carbs: 44, fat: 18 },
  { name: "Chole Bhature", cal: 520, protein: 16, carbs: 74, fat: 18 },
  { name: "Upma", cal: 230, protein: 6, carbs: 40, fat: 6 },
  { name: "Khichdi + Curd", cal: 350, protein: 14, carbs: 56, fat: 7 },
  { name: "Oats Porridge", cal: 180, protein: 7, carbs: 32, fat: 4 },
  { name: "Moong Dal Chilla", cal: 200, protein: 12, carbs: 28, fat: 4 },
  { name: "Banana (1)", cal: 90, protein: 1, carbs: 23, fat: 0 },
  { name: "Apple (1)", cal: 80, protein: 0, carbs: 21, fat: 0 },
  { name: "Boiled Egg (1)", cal: 78, protein: 6, carbs: 1, fat: 5 },
  { name: "Roasted Chana (30g)", cal: 120, protein: 7, carbs: 17, fat: 3 },
  { name: "Makhana (1 cup)", cal: 100, protein: 4, carbs: 18, fat: 1 },
  { name: "Buttermilk / Chaas", cal: 60, protein: 3, carbs: 7, fat: 2 },
  { name: "Mixed Nuts (30g)", cal: 180, protein: 5, carbs: 6, fat: 16 },
  { name: "Paneer (100g)", cal: 265, protein: 18, carbs: 4, fat: 20 },
];

const SECURITY_QUESTIONS = [
  "What was your first pet's name?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
];

const MOOD_OPTIONS = [
  { emoji: "😄", label: "Amazing" }, { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Okay" }, { emoji: "😔", label: "Low" }, { emoji: "😫", label: "Tough" },
];

const MOTIVATIONS = [
  "Rise like the Himalayas — strong, steady, unstoppable. Every step forward is progress. 🏔️",
  "Like the rivers of Nepal flow tirelessly to the sea, let your dedication be endless. 💧",
  "Namaste — honor the strength within you today. This moment is a gift, use it well. 🙏",
  "The mountains don't come to you — you climb to them. Be the force today. ⛰️",
  "Every sunrise brings new opportunity. Embrace this day with your full heart. 🌅",
  "Discipline is the bridge between goals and achievement. Cross it daily. 💪",
  "From the valleys to the peaks — every step counts on this beautiful journey. 🌄",
  "Small consistent habits build extraordinary lives. Keep going, one step at a time. ✨",
  "The Himalayas were not built in a day — neither is the best version of you. 🏔️",
  "Breathe deeply, move mindfully, live fully. You have everything you need within you. 🌿",
  "Like a prayer flag in the mountain wind — let your intentions carry far today. 🏁",
  "Strength is not just physical. Your mindset shapes your journey. Stay positive! 🌟",
  "Each healthy choice is a vote for the person you are becoming. Vote wisely today. 💚",
  "The summit feels impossible until you're standing on it. Keep climbing. 🧗",
];

function getDailyMotivation() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start) / 86400000);
  return MOTIVATIONS[dayOfYear % MOTIVATIONS.length];
}

const calcBMR = (w, h, a, g) => g === "male" ? Math.round(10 * w + 6.25 * h - 5 * a + 5) : Math.round(10 * w + 6.25 * h - 5 * a - 161);
const calcTDEE = (b) => Math.round(b * 1.375);
const calcBMI = (w, h) => (w / ((h / 100) ** 2)).toFixed(1);
const bmiInfo = (bmi) => {
  const b = parseFloat(bmi);
  if (b < 18.5) return { label: "Underweight", color: "#1565C0" };
  if (b < 25) return { label: "Normal", color: "#2E7D32" };
  if (b < 30) return { label: "Overweight", color: "#E65100" };
  return { label: "Obese", color: "#B71C1C" };
};
const todayKey = () => new Date().toISOString().split("T")[0];
const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const STORAGE_PREFIX = "vh:";

function SunriseIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs>
        <clipPath id={`circleClip-${size}`}>
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" />
      <g clipPath={`url(#circleClip-${size})`}>
        <rect x="0" y="0" width="100" height="35" fill="#FCD34D" />
        <rect x="0" y="35" width="100" height="12" fill="#FB923C" />
        <rect x="0" y="47" width="100" height="13" fill="#F97316" />
        <circle cx="50" cy="60" r="18" fill="#FBBF24" />
        <g stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round">
          <line x1="50" y1="32" x2="50" y2="25" />
          <line x1="32" y1="52" x2="26" y2="50" />
          <line x1="68" y1="52" x2="74" y2="50" />
          <line x1="38" y1="40" x2="33" y2="36" />
          <line x1="62" y1="40" x2="67" y2="36" />
        </g>
        <polygon points="0,72 18,52 30,62 42,45 55,60 70,48 85,58 100,52 100,100 0,100" fill="#5B4FCF" />
        <polygon points="0,82 15,68 28,78 45,65 58,75 72,68 88,76 100,72 100,100 0,100" fill="#4338CA" />
        <rect x="0" y="88" width="100" height="12" fill="#1E1B4B" />
      </g>
      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
    </svg>
  );
}

function storageGet(key) {
  try {
    const r = localStorage.getItem(STORAGE_PREFIX + key);
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}
function storageSet(key, value) {
  try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value)); }
  catch (e) { console.error("Save failed:", e); }
}

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState({});

  const [authForm, setAuthForm] = useState({ name: "", pin: "", confirmPin: "" });
  const [secQ, setSecQ] = useState(0);
  const [secAns, setSecAns] = useState("");
  const [secAnsInput, setSecAnsInput] = useState("");
  const [authErr, setAuthErr] = useState("");

  const [profile, setProfile] = useState({ weight: "", height: "", age: "", goal: "lose", gender: "male" });
  const [profileSaved, setProfileSaved] = useState(false);

  const today = todayKey();
  const [dailyData, setDailyData] = useState({});
  const [exHistory, setExHistory] = useState([]);

  const [foodQ, setFoodQ] = useState("");
  const [foodResults, setFoodResults] = useState([]);
  const [foodLoading, setFoodLoading] = useState(false);
  const [foodTab, setFoodTab] = useState("nepali");
  const [foodErr, setFoodErr] = useState("");

  const [exCat, setExCat] = useState("push");
  const [yogaCat, setYogaCat] = useState("flexibility");
  const [exTab, setExTab] = useState("exercise");
  const [toast, setToast] = useState("");

  const [logModal, setLogModal] = useState(null);
  const [logWeight, setLogWeight] = useState("");
  const [logReps, setLogReps] = useState("");
  const [logSets, setLogSets] = useState("");

  const [reportExercise, setReportExercise] = useState(null);

  useEffect(() => {
    const accs = storageGet("accounts");
    if (accs) setAccounts(accs);
    setScreen("login");
  }, []);

  useEffect(() => {
    if (!user) return;
    const p = storageGet(`profile:${user.username}`);
    if (p) { setProfile(p); setProfileSaved(true); }
    const d = storageGet(`daily:${user.username}:${today}`);
    if (d) setDailyData(d);
    const h = storageGet(`exHistory:${user.username}`);
    if (h) setExHistory(h);
  }, [user]);

  useEffect(() => {
    if (user && Object.keys(dailyData).length > 0) {
      storageSet(`daily:${user.username}:${today}`, dailyData);
    }
  }, [dailyData]);

  useEffect(() => {
    if (user && exHistory.length > 0) {
      storageSet(`exHistory:${user.username}`, exHistory);
    }
  }, [exHistory]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function getDay(key, def) {
    return dailyData[key] !== undefined ? dailyData[key] : def;
  }
  function setDay(key, val) {
    setDailyData(p => ({ ...p, [key]: val }));
  }

  const meals = getDay("meals", []);
  const habits = getDay("habits", {});
  const water = getDay("water", 0);
  const gymDays = getDay("gymDays", {});
  const exerciseLog = getDay("exerciseLog", []);
  const notes = getDay("notes", "");
  const mood = getDay("mood", null);
  const weightLog = getDay("weightLog", []);

  async function searchFood(q) {
    if (!q || q.length < 2) { setFoodErr("Type at least 2 characters"); return; }
    setFoodLoading(true); setFoodResults([]); setFoodErr("");
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&json=1&page_size=10&fields=product_name,nutriments`);
      const d = await res.json();
      const items = (d.products || []).filter(p => p.product_name && p.nutriments?.["energy-kcal_100g"]).map(p => ({
        name: p.product_name,
        cal: Math.round(p.nutriments["energy-kcal_100g"]),
        protein: Math.round(p.nutriments?.proteins_100g || 0),
        carbs: Math.round(p.nutriments?.carbohydrates_100g || 0),
        fat: Math.round(p.nutriments?.fat_100g || 0),
        per: "100g"
      })).filter(p => p.cal > 0);
      setFoodResults(items);
      if (items.length === 0) setFoodErr("No results. Try a different word.");
    } catch { setFoodErr("Search failed. Check your connection."); }
    setFoodLoading(false);
  }

  function handleRegisterStep1() {
    if (!authForm.name.trim()) { setAuthErr("Please enter your name"); return; }
    if (!/^\d{4}$/.test(authForm.pin)) { setAuthErr("PIN must be exactly 4 digits"); return; }
    if (authForm.pin !== authForm.confirmPin) { setAuthErr("PINs don't match"); return; }
    const username = authForm.name.toLowerCase().trim();
    if (accounts[username]) { setAuthErr("Name already registered. Try a different name or sign in."); return; }
    setAuthErr(""); setScreen("secQ");
  }
  function handleSecQSetup() {
    if (!secAns.trim()) { setAuthErr("Please answer the security question"); return; }
    const username = authForm.name.toLowerCase().trim();
    const newUser = { name: authForm.name.trim(), username, pin: authForm.pin, secQ, secAns: secAns.toLowerCase().trim() };
    const updated = { ...accounts, [username]: newUser };
    setAccounts(updated); storageSet("accounts", updated);
    setUser(newUser); setAuthErr(""); setScreen("dashboard");
    showToast("🎉 Account created! Welcome");
  }
  function handleLogin() {
    const username = authForm.name.toLowerCase().trim();
    const acc = accounts[username];
    if (!acc) { setAuthErr("Name not found. Please sign up first."); return; }
    if (acc.pin !== authForm.pin) { setAuthErr("Incorrect PIN"); return; }
    setSecQ(acc.secQ); setSecAnsInput(""); setAuthErr(""); setScreen("loginMFA");
  }
  function handleLoginMFA() {
    const acc = accounts[authForm.name.toLowerCase().trim()];
    if (secAnsInput.toLowerCase().trim() === acc.secAns) {
      setUser(acc); setAuthErr(""); setScreen("dashboard");
      showToast(`Welcome back, ${acc.name}! 🙏`);
    } else setAuthErr("Incorrect answer");
  }
  function handleSignOut() {
    setUser(null); setProfile({ weight: "", height: "", age: "", goal: "lose", gender: "male" });
    setProfileSaved(false); setDailyData({}); setExHistory([]);
    setAuthForm({ name: "", pin: "", confirmPin: "" }); setScreen("login");
    showToast("Signed out safely 👋");
  }
  function saveProfile() {
    if (!profile.weight || !profile.height || !profile.age) { showToast("⚠️ Please fill all fields"); return; }
    setProfileSaved(true);
    storageSet(`profile:${user.username}`, profile);
    const newWeight = parseFloat(profile.weight);
    const wLog = weightLog.length === 0 || weightLog[weightLog.length - 1].weight !== newWeight ?
      [...weightLog, { date: today, weight: newWeight }] : weightLog;
    setDay("weightLog", wLog);
    showToast("✓ Profile saved");
    if (screen === "onboarding") setScreen("dashboard");
  }

  const weight_kg = profileSaved ? +profile.weight * 0.453592 : 0;
  const height_cm = profileSaved ? +profile.height * 30.48 : 0;
  const bmr = profileSaved ? calcBMR(weight_kg, height_cm, +profile.age, profile.gender) : null;
  const tdee = bmr ? calcTDEE(bmr) : null;
  const bmi = profileSaved ? calcBMI(weight_kg, height_cm) : null;
  const bi = bmi ? bmiInfo(bmi) : null;
  function calTarget() {
    if (!tdee) return 2000;
    return profile.goal === "lose" ? tdee - 500 : profile.goal === "gain" ? tdee + 300 : tdee;
  }
  const totalCal = meals.reduce((s, m) => s + m.cal, 0);
  const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0);
  const pct = Math.min(Math.round((totalCal / calTarget()) * 100), 100);
  const isYoga50 = profileSaved && parseInt(profile.age) >= 50;
  const habitsCount = Object.values(habits).filter(Boolean).length;

  function logMeal(food) { setDay("meals", [...meals, food]); showToast(`✓ Logged ${food.name}`); }
  function removeM(i) { setDay("meals", meals.filter((_, j) => j !== i)); }
  function toggleHabit(k) { setDay("habits", { ...habits, [k]: !habits[k] }); }
  function toggleGym(d) { setDay("gymDays", { ...gymDays, [d]: !gymDays[d] }); }

  function openLogModal(ex, cat) {
    setLogModal({ ex, cat });
    setLogWeight(""); setLogReps(""); setLogSets("");
  }
  function confirmLogExercise() {
    if (!logModal) return;
    const { ex, cat } = logModal;
    const entry = {
      ...ex, cat,
      weight: logWeight ? parseFloat(logWeight) : null,
      reps: logReps ? parseInt(logReps) : null,
      setsDone: logSets ? parseInt(logSets) : null,
      date: today,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setDay("exerciseLog", [...exerciseLog, entry]);
    setExHistory(p => [...p, entry]);
    showToast(`✓ Logged ${ex.name}${entry.weight ? ` @ ${entry.weight}kg` : ""}`);
    setLogModal(null);
  }
  function removeExercise(i) { setDay("exerciseLog", exerciseLog.filter((_, j) => j !== i)); }
  function setWater(n) { setDay("water", Math.max(0, n)); }

  function getAllExercises() {
    const map = {};
    exHistory.forEach(e => {
      if (!e.weight) return;
      if (!map[e.name]) map[e.name] = [];
      map[e.name].push(e);
    });
    return Object.entries(map).map(([name, entries]) => {
      const maxW = Math.max(...entries.map(e => e.weight));
      const lastEntry = entries[entries.length - 1];
      return { name, entries: entries.sort((a, b) => a.date.localeCompare(b.date)), maxW, lastEntry, cat: entries[0].cat };
    }).sort((a, b) => b.maxW - a.maxW);
  }

  function getWeeklyVolume() {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dk = d.toISOString().split("T")[0];
      const dayEntries = exHistory.filter(e => e.date === dk);
      const volume = dayEntries.reduce((s, e) => s + ((e.weight || 0) * (e.reps || 0) * (e.setsDone || 1)), 0);
      const count = dayEntries.length;
      result.push({ date: dk, day: d.toLocaleDateString("en-US", { weekday: "short" }), volume, count });
    }
    return result;
  }

  const S = {
    wrap: { fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", paddingBottom: 90, position: "relative" },
    header: { background: C.primary, color: "#fff", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
    card: { background: C.card, borderRadius: 14, border: "0.5px solid #E2E0F5", padding: "14px 16px", margin: "10px 12px" },
    btn: (color = C.primary) => ({ background: color, color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontWeight: 600, cursor: "pointer", fontSize: 14, width: "100%" }),
    btnSm: (color = C.primary) => ({ background: color, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 600, cursor: "pointer", fontSize: 12 }),
    btnOut: { background: "transparent", color: C.primary, border: `1.5px solid ${C.primary}`, borderRadius: 8, padding: "6px 14px", fontWeight: 600, cursor: "pointer", fontSize: 12 },
    input: { width: "100%", border: "1px solid #D0CDF5", borderRadius: 10, padding: "11px 12px", fontSize: 14, boxSizing: "border-box", marginTop: 6, background: "#FAFAFE", outline: "none" },
    label: { fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 10, display: "block" },
    navBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "0.5px solid #E2E0F5", display: "flex", justifyContent: "space-around", padding: "8px 0 10px", zIndex: 100, boxShadow: "0 -2px 10px rgba(0,0,0,0.04)" },
    navItem: (a) => ({ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", color: a ? C.primary : "#AAA", fontSize: 10, fontWeight: a ? 700 : 400, gap: 2, padding: "2px 8px" }),
    stat: { background: C.primaryLight, borderRadius: 10, padding: "10px 8px", textAlign: "center", flex: 1 },
    tag: (c) => ({ background: c + "22", color: c, fontSize: 11, borderRadius: 20, padding: "2px 10px", fontWeight: 600 }),
    err: { color: C.danger, fontSize: 12, marginTop: 8, padding: "8px 10px", background: "#FFEBEE", borderRadius: 8, border: "1px solid #FFCDD2" },
    pill: (active) => ({ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${active ? C.primary : "#DDD"}`, background: active ? C.primaryLight : "#fff", color: active ? C.primary : C.muted, fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }),
    toast: { position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", background: C.text, color: "#fff", padding: "10px 18px", borderRadius: 30, fontSize: 13, fontWeight: 500, zIndex: 200, boxShadow: "0 4px 12px rgba(0,0,0,0.2)", maxWidth: 400 },
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 20 },
    modalCard: { background: "#fff", borderRadius: 16, padding: 22, width: "100%", maxWidth: 380 },
  };

  if (screen === "loading") return (
    <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <SunriseIcon size={72} />
        <div style={{ color: C.muted, marginTop: 14 }}>Loading My Sadbani… 🙏</div>
      </div>
    </div>
  );

  if (screen === "login" || screen === "register") {
    const isReg = screen === "register";
    return (
      <div style={S.wrap}>
        <div style={{ ...S.header, flexDirection: "column", textAlign: "center", padding: "28px 16px 24px", gap: 6 }}>
          <SunriseIcon size={72} />
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginTop: 8 }}>My Sadbani</div>
          <div style={{ fontSize: 13, opacity: 0.85, fontStyle: "italic" }}>Build virtue, one habit at a time ✨</div>
        </div>
        <div style={S.card}>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {[["login", "Sign In"], ["register", "Sign Up"]].map(([s, lbl]) => (
              <button key={s} style={{ ...S.pill(screen === s), flex: 1 }} onClick={() => { setScreen(s); setAuthErr(""); }}>{lbl}</button>
            ))}
          </div>
          <span style={S.label}>Full Name</span>
          <input style={S.input} placeholder="e.g. Manish Karki" value={authForm.name} onChange={e => setAuthForm(p => ({ ...p, name: e.target.value }))} />
          <span style={S.label}>4-Digit PIN</span>
          <input style={{ ...S.input, letterSpacing: 6, fontWeight: 700 }} type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={authForm.pin} onChange={e => setAuthForm(p => ({ ...p, pin: e.target.value.replace(/\D/g, "").slice(0, 4) }))} />
          {isReg && <>
            <span style={S.label}>Confirm PIN</span>
            <input style={{ ...S.input, letterSpacing: 6, fontWeight: 700 }} type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={authForm.confirmPin} onChange={e => setAuthForm(p => ({ ...p, confirmPin: e.target.value.replace(/\D/g, "").slice(0, 4) }))} />
          </>}
          {authErr && <div style={S.err}>⚠️ {authErr}</div>}
          <button style={{ ...S.btn(), marginTop: 16 }} onClick={isReg ? handleRegisterStep1 : handleLogin}>
            {isReg ? "Continue → Security Setup" : "Sign In"}
          </button>
        </div>
        {isReg && (
          <div style={{ ...S.card, background: C.primaryLight, border: `1px solid #C5C0F5` }}>
            <div style={{ fontSize: 12, color: C.primary, fontWeight: 700 }}>🔐 Two-Step Security</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>Sign-in uses your 4-digit PIN + a security question for extra account safety.</div>
          </div>
        )}
        {toast && <div style={S.toast}>{toast}</div>}
      </div>
    );
  }

  if (screen === "secQ") return (
    <div style={S.wrap}>
      <div style={{ ...S.header, justifyContent: "center", flexDirection: "column", textAlign: "center", padding: "24px 16px" }}>
        <div style={{ fontSize: 34 }}>🔐</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Security Setup</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>One-time setup · protects your account</div>
      </div>
      <div style={S.card}>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>You'll be asked this question on future logins.</div>
        <span style={S.label}>Choose a security question</span>
        <select style={S.input} value={secQ} onChange={e => setSecQ(+e.target.value)}>
          {SECURITY_QUESTIONS.map((q, i) => <option key={i} value={i}>{q}</option>)}
        </select>
        <span style={S.label}>Your Answer</span>
        <input style={S.input} placeholder="Case-insensitive" value={secAns} onChange={e => setSecAns(e.target.value)} />
        {authErr && <div style={S.err}>⚠️ {authErr}</div>}
        <button style={{ ...S.btn(), marginTop: 14 }} onClick={handleSecQSetup}>Complete Setup 🎉</button>
      </div>
      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );

  if (screen === "loginMFA") return (
    <div style={S.wrap}>
      <div style={{ ...S.header, justifyContent: "center", flexDirection: "column", textAlign: "center", padding: "24px 16px" }}>
        <div style={{ fontSize: 34 }}>🔐</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Verify It's You</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>2-Factor Security</div>
      </div>
      <div style={S.card}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{SECURITY_QUESTIONS[secQ]}</div>
        <input style={S.input} placeholder="Your answer" value={secAnsInput} onChange={e => setSecAnsInput(e.target.value)} />
        {authErr && <div style={S.err}>⚠️ {authErr}</div>}
        <button style={{ ...S.btn(), marginTop: 14 }} onClick={handleLoginMFA}>Verify & Sign In</button>
        <button style={{ ...S.btnOut, width: "100%", marginTop: 10, padding: "10px" }} onClick={() => setScreen("login")}>← Back</button>
      </div>
      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );

  if (screen === "onboarding") return (
    <div style={S.wrap}>
      <div style={{ ...S.header, justifyContent: "center", flexDirection: "column", textAlign: "center", padding: "24px 16px" }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Set Up Your Profile</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>Help us personalize your plan</div>
      </div>
      <div style={S.card}>
        {[["Weight (lbs)", "weight", "150"], ["Height (ft)", "height", "5.7"], ["Age", "age", "30"]].map(([lbl, k, ph]) => (
          <div key={k}><span style={S.label}>{lbl}</span><input style={S.input} type="number" placeholder={ph} value={profile[k]} onChange={e => setProfile(p => ({ ...p, [k]: e.target.value }))} /></div>
        ))}
        <span style={S.label}>Gender</span>
        <select style={S.input} value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}>
          <option value="male">Male</option><option value="female">Female</option>
        </select>
        <span style={S.label}>Goal</span>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {[["lose", "🔥 Lose"], ["maintain", "⚖️ Maintain"], ["gain", "💪 Gain"]].map(([v, lbl]) => (
            <button key={v} style={{ ...S.pill(profile.goal === v), flex: 1 }} onClick={() => setProfile(p => ({ ...p, goal: v }))}>{lbl}</button>
          ))}
        </div>
        <button style={{ ...S.btn(), marginTop: 18 }} onClick={saveProfile}>Generate My Plan →</button>
      </div>
      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );

  const TABS = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "diet", icon: "🥗", label: "Diet" },
    { id: "exercise", icon: "💪", label: "Exercise" },
    { id: "journal", icon: "📔", label: "Journal" },
    { id: "profile", icon: "👤", label: "Me" },
  ];

  const allExHistory = getAllExercises();
  const weeklyVolume = getWeeklyVolume();
  const maxVolume = Math.max(...weeklyVolume.map(d => d.volume), 1);

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SunriseIcon size={36} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>My Sadbani</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Namaste, {user?.name} 🙏</div>
          </div>
        </div>
        <button style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }} onClick={handleSignOut}>Sign out</button>
      </div>

      {!profileSaved && (
        <div style={{ ...S.card, background: C.primaryLight, border: `1.5px solid ${C.primary}` }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>👋 Welcome! Set up your profile to unlock your personalized plan.</div>
          <button style={{ ...S.btn(), marginTop: 10 }} onClick={() => setScreen("onboarding")}>Set Up Profile →</button>
        </div>
      )}

      {/* HOME */}
      {tab === "home" && <>
        <div style={{ ...S.card, background: "linear-gradient(135deg, #EEF0FF, #E8FAF0)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>🌄 Today's Motivation</div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{getDailyMotivation()}</div>
        </div>

        {profileSaved && (
          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>📊 Today's Snapshot</div>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ ...S.stat, cursor: "pointer" }} onClick={() => setTab("diet")}><div style={{ fontSize: 10, color: C.muted }}>Calories</div><div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>{totalCal}</div><div style={{ fontSize: 9, color: C.muted }}>/{calTarget()}</div></div>
              <div style={{ ...S.stat, cursor: "pointer" }} onClick={() => setTab("journal")}><div style={{ fontSize: 10, color: C.muted }}>Water</div><div style={{ fontSize: 18, fontWeight: 800, color: C.blue }}>{water}</div><div style={{ fontSize: 9, color: C.muted }}>/8 cups</div></div>
              <div style={{ ...S.stat, cursor: "pointer" }} onClick={() => setTab("exercise")}><div style={{ fontSize: 10, color: C.muted }}>Workout</div><div style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>{exerciseLog.length}</div><div style={{ fontSize: 9, color: C.muted }}>done</div></div>
              <div style={{ ...S.stat, cursor: "pointer" }} onClick={() => setTab("journal")}><div style={{ fontSize: 10, color: C.muted }}>Habits</div><div style={{ fontSize: 18, fontWeight: 800, color: C.warn }}>{habitsCount}</div><div style={{ fontSize: 9, color: C.muted }}>/5</div></div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted }}><span>Calorie Progress</span><span>{pct}%</span></div>
              <div style={{ height: 8, borderRadius: 4, background: "#E5E2F5", marginTop: 4, overflow: "hidden" }}>
                <div style={{ height: 8, borderRadius: 4, width: pct + "%", background: pct >= 100 ? C.danger : C.primary, transition: "width 0.4s" }}></div>
              </div>
            </div>
          </div>
        )}

        <div style={S.card}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Quick Habits</div>
          {[["💧", "Drank 8 glasses of water", "water"], ["🥗", "Ate mindfully today", "healthy"], ["🧘", "Meditated / Pranayama", "meditate"], ["😴", "Slept 7+ hours", "sleep"], ["🚶", "Walked 7,000+ steps", "walk"]].map(([icon, lbl, key]) => (
            <div key={key} onClick={() => toggleHabit(key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "0.5px solid #F0EEF9", cursor: "pointer" }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, border: `2px solid ${habits[key] ? C.accent : "#CCC"}`, background: habits[key] ? C.accent : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{habits[key] ? "✓" : ""}</div>
              <span style={{ fontSize: 13 }}>{icon} {lbl}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 12px 8px" }}>
          <button style={S.btnSm(C.primary)} onClick={() => setTab("diet")}>Diet →</button>
        </div>
      </>}

      {/* DIET */}
      {tab === "diet" && <>
        {profileSaved && <div style={{ ...S.card, background: C.primaryLight }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>🎯 Target: <span style={{ color: C.primary }}>{calTarget()} kcal/day</span></div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Eaten: <b style={{ color: C.accent }}>{totalCal} kcal</b> · Protein: <b>{totalProtein}g</b></div>
        </div>}

        <div style={S.card}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[["nepali", "🇳🇵 Nepali / Indian"], ["search", "🔍 Search Foods"]].map(([t, lbl]) => <button key={t} style={S.pill(foodTab === t)} onClick={() => setFoodTab(t)}>{lbl}</button>)}
          </div>

          {foodTab === "nepali" && NEPALI_FOODS.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #F0EEF9" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{f.cal} kcal · P:{f.protein}g C:{f.carbs}g F:{f.fat}g</div>
              </div>
              <button style={S.btnSm(C.accent)} onClick={() => logMeal(f)}>+ Log</button>
            </div>
          ))}

          {foodTab === "search" && <>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...S.input, marginTop: 0, flex: 1 }} placeholder="Search any food..." value={foodQ} onChange={e => setFoodQ(e.target.value)} onKeyDown={e => e.key === "Enter" && searchFood(foodQ)} />
              <button style={{ ...S.btnSm(C.primary), whiteSpace: "nowrap" }} onClick={() => searchFood(foodQ)} disabled={foodLoading}>{foodLoading ? "..." : "Search"}</button>
            </div>
            {foodErr && <div style={{ ...S.err, fontSize: 12 }}>⚠️ {foodErr}</div>}
            {foodLoading && <div style={{ fontSize: 13, color: C.muted, marginTop: 10, textAlign: "center" }}>🔍 Searching global food database...</div>}
            {foodResults.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #F0EEF9" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{f.cal} kcal/{f.per} · P:{f.protein}g C:{f.carbs}g F:{f.fat}g</div>
                </div>
                <button style={S.btnSm(C.accent)} onClick={() => logMeal(f)}>+ Log</button>
              </div>
            ))}
          </>}
        </div>

        {meals.length > 0 && (
          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Today's Food Log 📝 ({meals.length})</div>
            {meals.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid #F0EEF9" }}>
                <div style={{ fontSize: 13 }}>{m.name} <span style={{ color: C.muted, fontSize: 11 }}>({m.cal} kcal)</span></div>
                <span style={{ color: C.danger, cursor: "pointer", fontSize: 22, lineHeight: 1, padding: "0 8px" }} onClick={() => removeM(i)}>×</span>
              </div>
            ))}
            <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginTop: 8 }}>Total: {totalCal} kcal · {totalProtein}g protein</div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 12px 8px" }}>
          <button style={S.btnSm(C.primary)} onClick={() => setTab("exercise")}>Exercise →</button>
        </div>
      </>}

      {/* EXERCISE */}
      {tab === "exercise" && <>
        <div style={{ ...S.card, paddingBottom: 10 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[["exercise", "💪 Workout"], ["yoga", "🧘 Yoga"], ["reports", "📊 Reports"]].map(([t, lbl]) => <button key={t} style={S.pill(exTab === t)} onClick={() => { setExTab(t); setReportExercise(null); }}>{lbl}</button>)}
          </div>
        </div>

        {exTab === "exercise" && <>
          <div style={{ padding: "0 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["push", "pull", "legs", "shoulders", "core"].map(c => (
              <button key={c} style={S.pill(exCat === c)} onClick={() => setExCat(c)}>{c.charAt(0).toUpperCase() + c.slice(1)}</button>
            ))}
          </div>
          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, textTransform: "capitalize" }}>{exCat} Day Workout</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
              {exCat === "push" ? "Chest, Shoulders & Triceps" : exCat === "pull" ? "Back & Biceps" : exCat === "legs" ? "Quads, Hamstrings & Glutes" : exCat === "shoulders" ? "Deltoid Focus" : "Abs, Obliques & Stability"}
            </div>
            {EXERCISES[exCat].map((ex, i) => {
              const history = exHistory.filter(e => e.name === ex.name && e.weight);
              const lastEntry = history[history.length - 1];
              const pr = history.length > 0 ? Math.max(...history.map(e => e.weight)) : null;
              return (
                <div key={i} style={{ padding: "8px 0", borderBottom: "0.5px solid #F0EEF9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</div>
                      <span style={S.tag(C.primary)}>{ex.sets}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{ex.muscle} · ~{ex.cal} kcal</div>
                    {pr && <div style={{ fontSize: 11, color: C.accent, marginTop: 2, fontWeight: 600 }}>🏆 PR: {pr}kg · Last: {lastEntry.weight}kg × {lastEntry.reps}</div>}
                  </div>
                  <button style={S.btnSm(C.accent)} onClick={() => openLogModal(ex, exCat)}>+ Log</button>
                </div>
              );
            })}
          </div>

          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>🏋️ Gym Tracker — Past 7 Days</div>
            <div style={{ display: "flex", gap: 5 }}>
              {[-6, -5, -4, -3, -2, -1, 0].map(off => {
                const d = new Date(); d.setDate(d.getDate() + off);
                const dk = d.toISOString().split("T")[0];
                const dn = d.toLocaleDateString("en-US", { weekday: "short" });
                const num = d.getDate();
                return (
                  <div key={dk} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{dn}</div>
                    <div onClick={() => toggleGym(dk)} style={{ width: 34, height: 34, borderRadius: 8, border: `2px solid ${gymDays[dk] ? C.accent : "#DDD"}`, background: gymDays[dk] ? C.accent : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, margin: "0 auto", color: gymDays[dk] ? "#fff" : C.muted, fontWeight: 700 }}>{gymDays[dk] ? "✓" : num}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>Gym this week: <b style={{ color: C.accent }}>{Object.values(gymDays).filter(Boolean).length} days</b> 💪</div>
          </div>
        </>}

        {exTab === "yoga" && <>
          <div style={{ padding: "0 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(isYoga50 ? ["50plus", "flexibility", "strength", "balance", "breathing", "relaxation"] : ["flexibility", "strength", "balance", "breathing", "relaxation", "50plus"]).map(c => (
              <button key={c} style={S.pill(yogaCat === c)} onClick={() => setYogaCat(c)}>
                {c === "50plus" ? "🌿 50+" : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              {yogaCat === "50plus" ? "🌿 Gentle Yoga for 50+" : yogaCat.charAt(0).toUpperCase() + yogaCat.slice(1) + " Yoga"}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
              {yogaCat === "flexibility" ? "Improve range of motion" : yogaCat === "strength" ? "Build body strength" : yogaCat === "balance" ? "Improve stability & focus" : yogaCat === "breathing" ? "Pranayama for calm" : yogaCat === "relaxation" ? "Deep rest" : "Safe practice for seniors"}
            </div>
            {YOGA[yogaCat].map((y, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: "0.5px solid #F0EEF9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{y.name}</div>
                  <span style={S.tag(C.accent)}>{y.dur}</span>
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{y.benefit}</div>
              </div>
            ))}
          </div>
        </>}

        {exTab === "reports" && <>
          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>📊 Workout Reports</div>
            <div style={{ fontSize: 12, color: C.muted }}>Track your progress and personal records</div>
          </div>

          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>📈 Weekly Volume (kg lifted)</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 120, gap: 4, padding: "0 4px" }}>
              {weeklyVolume.map((d, i) => {
                const h = d.volume > 0 ? Math.max(8, (d.volume / maxVolume) * 100) : 4;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ fontSize: 9, color: C.muted, fontWeight: 600 }}>{d.volume > 0 ? Math.round(d.volume) : ""}</div>
                    <div style={{ width: "100%", height: h + "%", background: d.volume > 0 ? C.primary : "#E5E2F5", borderRadius: "4px 4px 0 0", transition: "height 0.4s" }}></div>
                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 500 }}>{d.day}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 10 }}>Total volume = weight × reps × sets</div>
          </div>

          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>🏆 Personal Records</div>
            {allExHistory.length === 0 ? (
              <div style={{ fontSize: 13, color: C.muted, padding: 14, textAlign: "center", background: "#F5F3FF", borderRadius: 10 }}>
                No workouts logged yet. Start logging exercises with weight to track PRs! 💪
              </div>
            ) : (
              allExHistory.map((e, i) => (
                <div key={i} onClick={() => setReportExercise(reportExercise === e.name ? null : e.name)} style={{ padding: "10px 0", borderBottom: "0.5px solid #F0EEF9", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{e.cat} · {e.entries.length} session{e.entries.length > 1 ? "s" : ""}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>{e.maxW}kg</div>
                      <div style={{ fontSize: 10, color: C.muted }}>PR</div>
                    </div>
                    <span style={{ marginLeft: 8, color: C.muted, fontSize: 18 }}>{reportExercise === e.name ? "▼" : "▶"}</span>
                  </div>
                  {reportExercise === e.name && (
                    <div style={{ marginTop: 10, background: C.primaryLight, borderRadius: 8, padding: 10 }}>
                      <div style={{ fontSize: 11, color: C.primary, fontWeight: 700, marginBottom: 6 }}>Full History ({e.entries.length} sessions)</div>
                      {e.entries.slice().reverse().map((entry, j) => (
                        <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: j < e.entries.length - 1 ? "0.5px solid #D5D2EE" : "none", fontSize: 12 }}>
                          <span style={{ color: C.muted }}>{entry.date}</span>
                          <span style={{ fontWeight: 600 }}>{entry.weight}kg × {entry.reps} reps{entry.setsDone ? ` × ${entry.setsDone} sets` : ""}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {exHistory.length > 0 && (
            <div style={S.card}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>📈 All-Time Stats</div>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={S.stat}><div style={{ fontSize: 10, color: C.muted }}>Workouts</div><div style={{ fontSize: 20, fontWeight: 800, color: C.primary }}>{exHistory.length}</div></div>
                <div style={S.stat}><div style={{ fontSize: 10, color: C.muted }}>Exercises</div><div style={{ fontSize: 20, fontWeight: 800, color: C.accent }}>{allExHistory.length}</div></div>
                <div style={S.stat}><div style={{ fontSize: 10, color: C.muted }}>Total kg</div><div style={{ fontSize: 20, fontWeight: 800, color: C.warn }}>{Math.round(exHistory.reduce((s, e) => s + ((e.weight || 0) * (e.reps || 0) * (e.setsDone || 1)), 0))}</div></div>
              </div>
            </div>
          )}
        </>}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 12px 8px" }}>
          <button style={S.btnSm(C.primary)} onClick={() => setTab("journal")}>Journal →</button>
        </div>
      </>}

      {/* JOURNAL */}
      {tab === "journal" && <>
        <div style={{ ...S.card, background: "linear-gradient(135deg, #EEF0FF, #DBEAFE)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>📔 Daily Journal — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Everything you tracked today, all in one place.</div>
        </div>

        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>💧 Water Intake</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>{water} / 8 cups</div>
          </div>
          <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} onClick={() => setWater(water > i ? i : i + 1)} style={{ cursor: "pointer", fontSize: 28, opacity: i < water ? 1 : 0.25, transition: "all 0.15s" }}>💧</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button style={{ ...S.btnSm(C.blue), flex: 1 }} onClick={() => setWater(water + 1)}>+ Add Cup</button>
            <button style={{ ...S.btnOut, flex: 1, padding: "6px" }} onClick={() => setWater(0)}>Reset</button>
          </div>
        </div>

        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>🥗 Eating ({meals.length} meals)</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{totalCal} kcal</span>
          </div>
          {meals.length === 0 ? <div style={{ fontSize: 13, color: C.muted, padding: 8, textAlign: "center" }}>No meals logged. Tap <b>Diet</b> tab to add.</div> :
            meals.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "0.5px solid #F0EEF9" }}>
                <span>• {m.name}</span><span style={{ color: C.primary, fontWeight: 600 }}>{m.cal} kcal</span>
              </div>
            ))
          }
        </div>

        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>💪 Workouts ({exerciseLog.length})</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{exerciseLog.reduce((s, e) => s + (e.cal || 0), 0)} kcal</span>
          </div>
          {exerciseLog.length === 0 ? <div style={{ fontSize: 13, color: C.muted, padding: 8, textAlign: "center" }}>No exercises logged. Tap <b>Exercise</b> tab to add.</div> :
            exerciseLog.map((e, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid #F0EEF9" }}>
                <div style={{ fontSize: 13, flex: 1 }}>
                  <div>{e.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    {e.weight ? `${e.weight}kg × ${e.reps || "?"} reps${e.setsDone ? ` × ${e.setsDone} sets` : ""} · ` : ""}{e.cat} · {e.time}
                  </div>
                </div>
                <span style={{ color: C.danger, cursor: "pointer", fontSize: 20, padding: "0 6px" }} onClick={() => removeExercise(i)}>×</span>
              </div>
            ))
          }
        </div>

        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>✅ Habits</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.warn }}>{habitsCount} / 5 done</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[["💧", "water", "Water"], ["🥗", "healthy", "Eat"], ["🧘", "meditate", "Meditate"], ["😴", "sleep", "Sleep"], ["🚶", "walk", "Walk"]].map(([icon, k, lbl]) => (
              <div key={k} style={{ flex: 1, minWidth: 60, textAlign: "center", padding: "8px 4px", borderRadius: 8, background: habits[k] ? C.accentLight : "#F5F5F8", border: `1px solid ${habits[k] ? C.accent : "#EEE"}` }}>
                <div style={{ fontSize: 18 }}>{icon}</div>
                <div style={{ fontSize: 10, color: habits[k] ? C.accent : C.muted, fontWeight: 600, marginTop: 2 }}>{habits[k] ? "✓ " : ""}{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>😊 How are you feeling?</div>
          <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
            {MOOD_OPTIONS.map((m, i) => (
              <div key={i} onClick={() => setDay("mood", m.label)} style={{ cursor: "pointer", flex: 1, textAlign: "center", padding: 8, borderRadius: 10, background: mood === m.label ? C.primaryLight : "transparent", border: `1.5px solid ${mood === m.label ? C.primary : "transparent"}` }}>
                <div style={{ fontSize: 26 }}>{m.emoji}</div>
                <div style={{ fontSize: 10, color: mood === m.label ? C.primary : C.muted, fontWeight: 600 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>📝 Daily Reflection</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>How did your day go? Wins, challenges, thoughts...</div>
          <textarea
            style={{ ...S.input, minHeight: 100, fontFamily: "inherit", resize: "vertical", marginTop: 0 }}
            placeholder="Today I felt... I'm grateful for... Tomorrow I want to..."
            value={notes}
            onChange={e => setDay("notes", e.target.value)}
          />
          <div style={{ fontSize: 11, color: C.muted, marginTop: 6, textAlign: "right" }}>{notes.length} characters · Auto-saved 💾</div>
        </div>

        <div style={{ ...S.card, background: C.accentLight, border: `1px solid ${C.accent}`, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#065F46", fontWeight: 600 }}>🌟 Day Score: {Math.round(((habitsCount * 20) + (water >= 8 ? 20 : water * 2.5) + (exerciseLog.length > 0 ? 20 : 0) + (notes.length > 20 ? 20 : 0) + (mood ? 20 : 0)) / 5)}%</div>
          <div style={{ fontSize: 11, color: "#065F46", marginTop: 4 }}>Habits · Water · Exercise · Reflection · Mood</div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 12px 8px" }}>
          <button style={S.btnSm(C.primary)} onClick={() => setTab("profile")}>My Profile →</button>
        </div>
      </>}

      {/* PROFILE */}
      {tab === "profile" && <>
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff", fontWeight: 800 }}>{user?.name?.[0]?.toUpperCase()}</div>
            <div><div style={{ fontWeight: 800, fontSize: 17 }}>{user?.name}</div><div style={{ fontSize: 12, color: C.muted }}>@{user?.username}</div></div>
          </div>
          {profileSaved && (
            <div style={{ display: "flex", gap: 6 }}>
              {[["Weight", profile.weight + " lbs"], ["Height", profile.height + " ft"], ["Age", profile.age + " yrs"]].map(([lbl, val]) => (
                <div key={lbl} style={S.stat}><div style={{ fontSize: 10, color: C.muted }}>{lbl}</div><div style={{ fontSize: 15, fontWeight: 800 }}>{val}</div></div>
              ))}
            </div>
          )}
        </div>

        {profileSaved && (
          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>📈 Health Metrics</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[["BMI", bmi, bi?.color, bi?.label], ["BMR", bmr, C.primary, "kcal/day"], ["TDEE", tdee, C.accent, "kcal/day"]].map(([lbl, val, col, sub]) => (
                <div key={lbl} style={S.stat}><div style={{ fontSize: 10, color: C.muted }}>{lbl}</div><div style={{ fontSize: 18, fontWeight: 800, color: col }}>{val}</div><div style={{ fontSize: 9, color: col }}>{sub}</div></div>
              ))}
            </div>
            {isYoga50 && <div style={{ ...S.tag(C.accent), marginTop: 12, display: "inline-block", padding: "4px 12px" }}>🧘 50+ Gentle Yoga recommended</div>}
          </div>
        )}

        {weightLog.length > 0 && (
          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>⚖️ Body Weight History</div>
            {weightLog.slice(-5).reverse().map((w, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "0.5px solid #F0EEF9" }}>
                <span style={{ color: C.muted }}>{w.date}</span><span style={{ fontWeight: 700 }}>{w.weight} lbs</span>
              </div>
            ))}
          </div>
        )}

        <div style={S.card}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>✏️ Update Profile</div>
          {[["Weight (lbs)", "weight"], ["Height (ft)", "height"], ["Age", "age"]].map(([lbl, k]) => (
            <div key={k}><span style={S.label}>{lbl}</span><input style={S.input} type="number" value={profile[k]} onChange={e => setProfile(p => ({ ...p, [k]: e.target.value }))} /></div>
          ))}
          <span style={S.label}>Goal</span>
          <select style={S.input} value={profile.goal} onChange={e => setProfile(p => ({ ...p, goal: e.target.value }))}>
            <option value="lose">Lose Weight</option><option value="maintain">Maintain</option><option value="gain">Gain Muscle</option>
          </select>
          <button style={{ ...S.btn(), marginTop: 14 }} onClick={saveProfile}>Save Changes ✓</button>
        </div>

        <div style={{ ...S.card, background: "#FFF9E6", border: "1px solid #F59E0B" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E" }}>🔒 Your Data is Safe</div>
          <div style={{ fontSize: 11, color: "#92400E", marginTop: 4, lineHeight: 1.5 }}>All data is stored privately on this device. Sign out to keep it secure.</div>
        </div>
      </>}

      <nav style={S.navBar}>
        {TABS.map(({ id, icon, label }) => (
          <div key={id} style={S.navItem(tab === id)} onClick={() => setTab(id)}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </nav>

      {logModal && (
        <div style={S.modal} onClick={() => setLogModal(null)}>
          <div style={S.modalCard} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Log Workout</div>
            <div style={{ fontSize: 13, color: C.primary, fontWeight: 600 }}>{logModal.ex.name}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Target: {logModal.ex.sets} · {logModal.ex.muscle}</div>

            {(() => {
              const prevEntry = exHistory.filter(e => e.name === logModal.ex.name && e.weight).pop();
              return prevEntry && (
                <div style={{ background: C.primaryLight, borderRadius: 8, padding: 10, marginTop: 12, fontSize: 12 }}>
                  <b>Last time:</b> {prevEntry.weight}kg × {prevEntry.reps} reps{prevEntry.setsDone ? ` × ${prevEntry.setsDone}` : ""}
                </div>
              );
            })()}

            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <div style={{ flex: 1 }}>
                <span style={{ ...S.label, marginTop: 0 }}>Weight (kg)</span>
                <input style={S.input} type="number" placeholder="0" value={logWeight} onChange={e => setLogWeight(e.target.value)} autoFocus />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ ...S.label, marginTop: 0 }}>Reps</span>
                <input style={S.input} type="number" placeholder="0" value={logReps} onChange={e => setLogReps(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ ...S.label, marginTop: 0 }}>Sets</span>
                <input style={S.input} type="number" placeholder="0" value={logSets} onChange={e => setLogSets(e.target.value)} />
              </div>
            </div>

            <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>💡 Bodyweight exercises? Leave weight at 0.</div>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button style={{ ...S.btnOut, flex: 1, padding: "10px" }} onClick={() => setLogModal(null)}>Cancel</button>
              <button style={{ ...S.btn(), flex: 2 }} onClick={confirmLogExercise}>Save Workout ✓</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}
