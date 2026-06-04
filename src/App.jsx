import { useState, useEffect, Component } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";

export class AppErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { err: null }; }
  static getDerivedStateFromError(e) { return { err: e }; }
  render() {
    if (this.state.err) return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: 32, textAlign: "center", maxWidth: 400, margin: "60px auto" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>😔</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Something went wrong</div>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>Your data is safe. Tap below to reload.</div>
        <button onClick={() => window.location.reload()} style={{ background: "#5B4FCF", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Reload App</button>
      </div>
    );
    return this.props.children;
  }
}

const C = {
  primary: "#5B4FCF", primaryDark: "#4338CA", primaryLight: "#EEF0FF",
  accent: "#10B981", accentLight: "#E8FAF0",
  bg: "#F7F6FF", card: "#FFFFFF", text: "#1A1A2E", muted: "#6B7280",
  danger: "#E53935", warn: "#F59E0B", blue: "#3B82F6", blueLight: "#DBEAFE",
};

const EXERCISES = {
  push: [
    { name: "Barbell Bench Press", sets: "4×8", muscle: "Chest, Triceps", cal: 85 },
    { name: "Dumbbell Bench Press", sets: "4×10", muscle: "Chest, Triceps", cal: 80 },
    { name: "Chest Flyes (Cable)", sets: "3×12", muscle: "Chest", cal: 60 },
    { name: "Incline Push-ups", sets: "3×12", muscle: "Upper Chest", cal: 50 },
    { name: "Push-ups", sets: "3×15", muscle: "Chest, Triceps", cal: 60 },
    { name: "Tricep Pushdown (Cable)", sets: "3×12", muscle: "Triceps", cal: 50 },
    { name: "Overhead Tricep Extension", sets: "3×12", muscle: "Triceps", cal: 55 },
    { name: "Tricep Dips", sets: "3×12", muscle: "Triceps", cal: 55 },
    { name: "Diamond Push-ups", sets: "3×10", muscle: "Triceps, Inner Chest", cal: 60 },
  ],
  pull: [
    { name: "Deadlift", sets: "3×8", muscle: "Lower Back, Hamstrings, Glutes", cal: 120 },
    { name: "Barbell Row", sets: "3×10", muscle: "Upper Back, Biceps", cal: 85 },
    { name: "Lat Pulldown", sets: "3×12", muscle: "Lats", cal: 75 },
    { name: "Seated Cable Row", sets: "3×12", muscle: "Mid Back", cal: 70 },
    { name: "Dumbbell Rows", sets: "3×12", muscle: "Upper Back", cal: 70 },
    { name: "Rear Delt Fly (Cable)", sets: "3×15", muscle: "Rear Delts, Upper Back", cal: 45 },
    { name: "Face Pulls", sets: "3×15", muscle: "Rear Delts", cal: 45 },
    { name: "Bicep Curl (Barbell)", sets: "3×12", muscle: "Biceps", cal: 55 },
    { name: "Bicep Curl (Dumbbell)", sets: "3×15", muscle: "Biceps", cal: 50 },
    { name: "Hammer Curls", sets: "3×12", muscle: "Biceps, Forearms", cal: 50 },
    { name: "Pull-ups", sets: "3×8", muscle: "Back, Biceps", cal: 80 },
  ],
  legs: [
    { name: "Squat (Barbell)", sets: "4×12", muscle: "Quads, Glutes", cal: 130 },
    { name: "Dumbbell Squat", sets: "4×12", muscle: "Quads, Glutes", cal: 110 },
    { name: "Leg Press", sets: "4×12", muscle: "Quads, Hamstrings", cal: 110 },
    { name: "Leg Extension", sets: "3×12", muscle: "Quads", cal: 60 },
    { name: "Hamstring Curl", sets: "3×12", muscle: "Hamstrings", cal: 65 },
    { name: "Walking Lunges", sets: "3×12 each", muscle: "Quads, Glutes", cal: 100 },
    { name: "Calf Raises", sets: "4×20", muscle: "Calves", cal: 50 },
    { name: "Inner Thigh (Adductor)", sets: "3×15", muscle: "Inner Thighs", cal: 50 },
    { name: "Outer Thigh (Abductor)", sets: "3×15", muscle: "Outer Thighs", cal: 50 },
    { name: "Romanian Deadlift", sets: "3×12", muscle: "Hamstrings, Glutes", cal: 110 },
    { name: "Glute Bridge", sets: "3×20", muscle: "Glutes", cal: 70 },
  ],
  shoulders: [
    { name: "Shoulder Press (DB)", sets: "4×10", muscle: "All Delts", cal: 70 },
    { name: "Arnold Press", sets: "3×12", muscle: "All Delts", cal: 65 },
    { name: "Lateral Raises", sets: "3×15", muscle: "Side Delts", cal: 45 },
    { name: "Front Raises", sets: "3×12", muscle: "Front Delts", cal: 45 },
    { name: "Upright Rows", sets: "3×12", muscle: "Traps, Delts", cal: 60 },
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
    { name: "Cable Crunch", sets: "3×15", muscle: "Upper Abs", cal: 40 },
    { name: "Hanging Leg Raises", sets: "3×12", muscle: "Lower Abs", cal: 45 },
  ],
  cardio: [
    { name: "Treadmill Run", sets: "log mins", muscle: "Full Body, Cardio", cal: 300 },
    { name: "Treadmill Walk (incline)", sets: "log mins", muscle: "Legs, Cardio", cal: 180 },
    { name: "Stationary Bike", sets: "log mins", muscle: "Legs, Cardio", cal: 250 },
    { name: "Elliptical", sets: "log mins", muscle: "Full Body, Low Impact", cal: 270 },
    { name: "Rowing Machine", sets: "log mins", muscle: "Back, Arms, Cardio", cal: 280 },
    { name: "Stair Climber", sets: "log mins", muscle: "Glutes, Legs, Cardio", cal: 300 },
    { name: "Jump Rope / Skipping", sets: "500 reps", muscle: "Full Body, Cardio", cal: 200 },
    { name: "Jumping Jacks", sets: "3×50", muscle: "Full Body, Cardio", cal: 80 },
    { name: "Burpees", sets: "3×15", muscle: "Full Body, HIIT", cal: 100 },
    { name: "HIIT Circuit", sets: "log mins", muscle: "Full Body, Fat Burn", cal: 350 },
    { name: "Outdoor Walk", sets: "log mins / steps", muscle: "Legs, Cardio", cal: 150 },
    { name: "Outdoor Run", sets: "log mins / km", muscle: "Full Body, Cardio", cal: 320 },
    { name: "Swimming", sets: "log mins / laps", muscle: "Full Body, Low Impact", cal: 300 },
    { name: "Cycling (outdoor)", sets: "log mins / km", muscle: "Legs, Cardio", cal: 260 },
    { name: "Zumba / Dance", sets: "log mins", muscle: "Full Body, Fun Cardio", cal: 220 },
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

const FOOD_DB = {
  breakfast: [
    { name: "Egg White (1 large)", cal: 17, protein: 4, carbs: 0, fat: 0 },
    { name: "Whole Egg (1)", cal: 78, protein: 6, carbs: 1, fat: 5 },
    { name: "Boiled Egg (1)", cal: 78, protein: 6, carbs: 1, fat: 5 },
    { name: "Oats, dry (50g)", cal: 190, protein: 6, carbs: 34, fat: 3 },
    { name: "Muesli (50g)", cal: 180, protein: 5, carbs: 33, fat: 3 },
    { name: "Weetabix (60g / 2 biscuits)", cal: 210, protein: 6, carbs: 43, fat: 1 },
    { name: "Protein Powder (1 scoop 30g)", cal: 120, protein: 25, carbs: 3, fat: 2 },
    { name: "Protein Powder (0.5 scoop)", cal: 60, protein: 12, carbs: 2, fat: 1 },
    { name: "Whole Milk (200ml)", cal: 120, protein: 6, carbs: 10, fat: 7 },
    { name: "Low Fat Milk (200ml)", cal: 80, protein: 7, carbs: 10, fat: 2 },
    { name: "Almond Milk (200ml)", cal: 50, protein: 1, carbs: 4, fat: 2 },
    { name: "Mixed Nuts (8g)", cal: 50, protein: 1, carbs: 2, fat: 4 },
    { name: "Mixed Nuts (30g)", cal: 180, protein: 5, carbs: 6, fat: 16 },
    { name: "Soaked Chana (80g)", cal: 200, protein: 12, carbs: 33, fat: 2 },
    { name: "Green Moong Salad (80g)", cal: 140, protein: 10, carbs: 24, fat: 1 },
    { name: "Brown Bread (1 slice)", cal: 80, protein: 4, carbs: 15, fat: 1 },
    { name: "Multigrain Bread (1 slice)", cal: 90, protein: 4, carbs: 17, fat: 2 },
    { name: "Strawberries (100g)", cal: 33, protein: 1, carbs: 8, fat: 0 },
    { name: "Blueberries (100g)", cal: 57, protein: 1, carbs: 14, fat: 0 },
    { name: "Banana (1 medium)", cal: 90, protein: 1, carbs: 23, fat: 0 },
    { name: "Apple (1 medium)", cal: 80, protein: 0, carbs: 21, fat: 0 },
    { name: "Mixed Fruits Bowl (200g)", cal: 120, protein: 1, carbs: 30, fat: 0 },
    { name: "Avocado (100g)", cal: 160, protein: 2, carbs: 9, fat: 15 },
    { name: "Apple Cider Vinegar (1 tsp)", cal: 1, protein: 0, carbs: 0, fat: 0 },
    { name: "Black Coffee (1 cup)", cal: 2, protein: 0, carbs: 0, fat: 0 },
  ],
  lunch: [
    { name: "Brown Rice, cooked (130g)", cal: 170, protein: 4, carbs: 37, fat: 1 },
    { name: "White Rice, cooked (130g)", cal: 170, protein: 3, carbs: 38, fat: 0 },
    { name: "Quinoa, cooked (130g)", cal: 170, protein: 6, carbs: 30, fat: 3 },
    { name: "Whole Wheat Roti (1)", cal: 80, protein: 3, carbs: 16, fat: 1 },
    { name: "Oats Roti (1)", cal: 90, protein: 4, carbs: 17, fat: 2 },
    { name: "Chicken Curry (120g)", cal: 220, protein: 28, carbs: 5, fat: 10 },
    { name: "Chicken Breast, grilled (130g)", cal: 200, protein: 38, carbs: 0, fat: 4 },
    { name: "Chicken Wrap (1 wrap, 75g chicken)", cal: 240, protein: 22, carbs: 25, fat: 6 },
    { name: "Fish Curry (130g)", cal: 180, protein: 26, carbs: 3, fat: 7 },
    { name: "Paneer (120g)", cal: 320, protein: 22, carbs: 5, fat: 24 },
    { name: "Tofu (150g)", cal: 120, protein: 14, carbs: 4, fat: 7 },
    { name: "Soya Chunks, dry (30g)", cal: 100, protein: 17, carbs: 6, fat: 1 },
    { name: "Dal / Lentils, cooked (120g)", cal: 130, protein: 8, carbs: 22, fat: 1 },
    { name: "Rajma, cooked (140g)", cal: 160, protein: 10, carbs: 28, fat: 1 },
    { name: "Chana Stir Fry (100g)", cal: 140, protein: 8, carbs: 22, fat: 2 },
    { name: "Wheat Pasta, boiled (120g)", cal: 160, protein: 6, carbs: 34, fat: 1 },
    { name: "Wheat Spaghetti, boiled (120g)", cal: 155, protein: 5, carbs: 33, fat: 1 },
    { name: "Stir Fry Veggies (140g)", cal: 60, protein: 2, carbs: 12, fat: 1 },
    { name: "Mixed Veggies (120g)", cal: 50, protein: 2, carbs: 10, fat: 0 },
    { name: "Salad — cucumber/carrot/beetroot (100g)", cal: 35, protein: 1, carbs: 7, fat: 0 },
    { name: "Dahi / Plain Yogurt (100g)", cal: 80, protein: 4, carbs: 8, fat: 4 },
    { name: "Raita (100g)", cal: 70, protein: 3, carbs: 7, fat: 3 },
    { name: "Chicken Biryani (140g chicken + 120g rice)", cal: 450, protein: 36, carbs: 52, fat: 10 },
    { name: "Egg Whites Curry (2 whites)", cal: 40, protein: 8, carbs: 1, fat: 0 },
  ],
  snack: [
    { name: "Chicken Salad (100g)", cal: 160, protein: 28, carbs: 3, fat: 4 },
    { name: "Egg Sandwich (1 bread + 2 eggs + 1 white)", cal: 280, protein: 22, carbs: 20, fat: 10 },
    { name: "Chicken Soup (200ml)", cal: 100, protein: 14, carbs: 5, fat: 2 },
    { name: "Beaten Rice / Chiura (30g dry)", cal: 110, protein: 2, carbs: 24, fat: 1 },
    { name: "Egg Roll (3 egg whites)", cal: 100, protein: 12, carbs: 10, fat: 1 },
    { name: "Fruit + Yogurt + Protein (200g+100g+0.5 scoop)", cal: 280, protein: 16, carbs: 45, fat: 3 },
    { name: "Banana Protein Smoothie (milk+banana+oats+protein)", cal: 360, protein: 30, carbs: 52, fat: 5 },
    { name: "Avocado Protein Smoothie (avocado+milk+protein)", cal: 300, protein: 25, carbs: 20, fat: 14 },
    { name: "Roasted Chana (30g)", cal: 120, protein: 7, carbs: 17, fat: 3 },
    { name: "Makhana (1 cup)", cal: 100, protein: 4, carbs: 18, fat: 1 },
    { name: "Buttermilk / Chaas (1 glass)", cal: 60, protein: 3, carbs: 7, fat: 2 },
  ],
  dinner: [
    { name: "Grilled Chicken (140g)", cal: 220, protein: 42, carbs: 0, fat: 5 },
    { name: "Grilled Fish (140g)", cal: 160, protein: 30, carbs: 0, fat: 4 },
    { name: "Egg Bhurji (100g)", cal: 180, protein: 14, carbs: 4, fat: 12 },
    { name: "Grilled Mushroom (120g)", cal: 30, protein: 3, carbs: 4, fat: 0 },
    { name: "Fried Rice (150g)", cal: 200, protein: 4, carbs: 40, fat: 3 },
    { name: "Poha / Chiura (40g dry)", cal: 145, protein: 3, carbs: 32, fat: 1 },
    { name: "Soya Chunks Pulao (30g soya + 130g brown rice)", cal: 350, protein: 22, carbs: 62, fat: 3 },
    { name: "Wheat Noodles / Thukpa (120g boiled)", cal: 200, protein: 7, carbs: 42, fat: 1 },
    { name: "Wheat Momo (8 pieces)", cal: 320, protein: 16, carbs: 52, fat: 6 },
    { name: "Veg Roll (2 roti + 30g soya)", cal: 320, protein: 16, carbs: 52, fat: 6 },
    { name: "Brown Rice, cooked (120g)", cal: 155, protein: 3, carbs: 34, fat: 1 },
    { name: "Whole Wheat Roti (2)", cal: 160, protein: 6, carbs: 32, fat: 2 },
    { name: "Dal / Lentils, cooked (70g)", cal: 75, protein: 5, carbs: 13, fat: 0 },
    { name: "Rajma, cooked (40g dry → cooked)", cal: 130, protein: 8, carbs: 23, fat: 1 },
  ],
  nepali: [
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
    { name: "Poha (traditional)", cal: 250, protein: 6, carbs: 48, fat: 4 },
    { name: "Idli (3) + Sambar", cal: 220, protein: 9, carbs: 42, fat: 3 },
    { name: "Dal + 2 Roti", cal: 380, protein: 16, carbs: 62, fat: 7 },
    { name: "Rajma Chawal", cal: 420, protein: 18, carbs: 72, fat: 6 },
    { name: "Palak Paneer + Roti", cal: 430, protein: 18, carbs: 44, fat: 18 },
    { name: "Chole Bhature", cal: 520, protein: 16, carbs: 74, fat: 18 },
    { name: "Upma", cal: 230, protein: 6, carbs: 40, fat: 6 },
    { name: "Khichdi + Curd", cal: 350, protein: 14, carbs: 56, fat: 7 },
    { name: "Oats Porridge", cal: 180, protein: 7, carbs: 32, fat: 4 },
    { name: "Moong Dal Chilla", cal: 200, protein: 12, carbs: 28, fat: 4 },
    { name: "Paneer (100g)", cal: 265, protein: 18, carbs: 4, fat: 20 },
  ],
};

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

function GoalRing({ pct, color, label, value, target, unit }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const filled = Math.min(pct / 100, 1) * circ;
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <svg width={66} height={66} viewBox="0 0 66 66">
        <circle cx={33} cy={33} r={r} fill="none" stroke="#E5E2F5" strokeWidth={8} />
        <circle cx={33} cy={33} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={circ - filled}
          strokeLinecap="round" transform="rotate(-90 33 33)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }} />
        <text x={33} y={37} textAnchor="middle" fontSize={11} fontWeight="800" fill={color}>
          {Math.min(pct, 100)}%
        </text>
      </svg>
      <div style={{ fontSize: 12, fontWeight: 700, color, marginTop: 2 }}>{label}</div>
      <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>{value} / {target}{unit}</div>
    </div>
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
  const [foodTab, setFoodTab] = useState("breakfast");
  const [foodErr, setFoodErr] = useState("");
  const [dietDate, setDietDate] = useState(today);
  const [exHistDate, setExHistDate] = useState(today);

  const [exCat, setExCat] = useState("push");
  const [yogaCat, setYogaCat] = useState("flexibility");
  const [exTab, setExTab] = useState("exercise");
  const [toast, setToast] = useState("");

  const [logModal, setLogModal] = useState(null);
  const [logWeight, setLogWeight] = useState("");
  const [logReps, setLogReps] = useState("");
  const [logSets, setLogSets] = useState("");

  const [reportExercise, setReportExercise] = useState(null);
  const [journalDate, setJournalDate] = useState(today);
  const [dailyCache, setDailyCache] = useState({});
  const [dataLoading, setDataLoading] = useState(false);
  const [quantityModal, setQuantityModal] = useState(null);
  const [quantityInput, setQuantityInput] = useState("");
  const [customFood, setCustomFood] = useState({ name: "", cal: "", protein: "", carbs: "", fat: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "accounts"));
        const accs = {};
        snap.forEach(d => { accs[d.id] = d.data(); });
        setAccounts(accs);
      } catch (e) { console.error("Failed to load accounts", e); }
      setScreen("login");
    };
    load();
    window.history.pushState(null, "", window.location.href);
    const handlePop = () => { window.history.pushState(null, "", window.location.href); };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    if (user && Object.keys(dailyData).length > 0) {
      setDoc(doc(db, "daily", `${user.username}_${today}`), dailyData).catch(console.error);
    }
  }, [dailyData]);

  useEffect(() => {
    if (user && exHistory.length > 0) {
      setDoc(doc(db, "exHistory", user.username), { entries: exHistory }).catch(console.error);
    }
  }, [exHistory]);

  // Load uncached past-date data when date nav changes
  useEffect(() => {
    if (!user || dietDate === today || dailyCache[dietDate] !== undefined) return;
    getDoc(doc(db, "daily", `${user.username}_${dietDate}`)).then(snap => {
      setDailyCache(p => ({ ...p, [dietDate]: snap.exists() ? snap.data() : {} }));
    }).catch(console.error);
  }, [dietDate, user]);

  useEffect(() => {
    if (!user || journalDate === today || dailyCache[journalDate] !== undefined) return;
    getDoc(doc(db, "daily", `${user.username}_${journalDate}`)).then(snap => {
      setDailyCache(p => ({ ...p, [journalDate]: snap.exists() ? snap.data() : {} }));
    }).catch(console.error);
  }, [journalDate, user]);

  useEffect(() => {
    if (!user || exHistDate === today || dailyCache[exHistDate] !== undefined) return;
    getDoc(doc(db, "daily", `${user.username}_${exHistDate}`)).then(snap => {
      setDailyCache(p => ({ ...p, [exHistDate]: snap.exists() ? snap.data() : {} }));
    }).catch(console.error);
  }, [exHistDate, user]);

  const isViewingToday = journalDate === today;
  const isJournalEditable = isViewingToday || canEdit(journalDate);
  const journalViewData = isViewingToday ? dailyData : (dailyCache[journalDate] || {});
  function jGet(key, def) {
    return journalViewData[key] !== undefined ? journalViewData[key] : def;
  }
  function navigateJournalDate(dir) {
    const d = new Date(journalDate + "T12:00:00");
    d.setDate(d.getDate() + dir);
    const newKey = d.toISOString().split("T")[0];
    if (newKey <= today) setJournalDate(newKey);
  }
  function formatJournalDate(dk) {
    const d = new Date(dk + "T12:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }
  function navigateDietDate(dir) {
    const d = new Date(dietDate + "T12:00:00"); d.setDate(d.getDate() + dir);
    const k = d.toISOString().split("T")[0]; if (k <= today) setDietDate(k);
  }
  function navigateExHistDate(dir) {
    const d = new Date(exHistDate + "T12:00:00"); d.setDate(d.getDate() + dir);
    const k = d.toISOString().split("T")[0]; if (k <= today) setExHistDate(k);
  }
  const canEdit = (date) => {
    const diff = Math.round((new Date(today + "T12:00:00") - new Date(date + "T12:00:00")) / 86400000);
    return diff <= 4;
  };
  function savePastDay(date, updated) {
    setDailyCache(p => ({ ...p, [date]: updated }));
    setDoc(doc(db, "daily", `${user.username}_${date}`), updated).catch(console.error);
  }
  function setDayForDate(date, key, value) {
    if (date === today) { setDay(key, value); return; }
    const existing = dailyCache[date] || {};
    savePastDay(date, { ...existing, [key]: value });
  }
  function logMealForDate(food, date) {
    if (date === today) { logMeal(food); return; }
    const existing = dailyCache[date] || {};
    savePastDay(date, { ...existing, meals: [...(existing.meals || []), food] });
    showToast(`✓ Logged ${food.name}`);
  }
  function removeMealForDate(i, date) {
    if (date === today) { removeM(i); return; }
    const existing = dailyCache[date] || {};
    savePastDay(date, { ...existing, meals: (existing.meals || []).filter((_, j) => j !== i) });
  }
  function removeExForDate(i, date) {
    if (date === today) { removeExercise(i); return; }
    const existing = dailyCache[date] || {};
    savePastDay(date, { ...existing, exerciseLog: (existing.exerciseLog || []).filter((_, j) => j !== i) });
  }

  const isDietToday = dietDate === today;
  const isDietEditable = isDietToday || canEdit(dietDate);
  const dietViewData = isDietToday ? dailyData : (dailyCache[dietDate] || {});
  const dietMeals = dietViewData.meals || [];
  const dietTotalCal = dietMeals.reduce((s, m) => s + m.cal, 0);
  const dietTotalProtein = dietMeals.reduce((s, m) => s + (m.protein || 0), 0);
  const exHistDayData = exHistDate === today ? dailyData : (dailyCache[exHistDate] || {});
  const exHistDayLog = exHistDayData.exerciseLog || [];

  const jMeals = jGet("meals", []);
  const jHabits = jGet("habits", {});
  const jWater = jGet("water", 0);
  const jExLog = jGet("exerciseLog", []);
  const jNotes = jGet("notes", "");
  const jMood = jGet("mood", null);
  const jHabitsCount = Object.values(jHabits).filter(Boolean).length;
  const jTotalCal = jMeals.reduce((s, m) => s + m.cal, 0);

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

  async function handleRegisterStep1() {
    if (!authForm.name.trim()) { setAuthErr("Please enter your name"); return; }
    if (!/^\d{4}$/.test(authForm.pin)) { setAuthErr("PIN must be exactly 4 digits"); return; }
    if (authForm.pin !== authForm.confirmPin) { setAuthErr("PINs don't match"); return; }
    const username = authForm.name.toLowerCase().trim();
    if (accounts[username]) { setAuthErr("Name already registered. Try a different name or sign in."); return; }
    setDataLoading(true);
    try {
      const newUser = { name: authForm.name.trim(), username, pin: authForm.pin };
      await setDoc(doc(db, "accounts", username), newUser);
      setAccounts(p => ({ ...p, [username]: newUser }));
      setUser(newUser); setAuthErr(""); setScreen("dashboard");
      showToast("🎉 Account created! Welcome");
    } catch (e) { setAuthErr("Could not create account. Check your connection."); }
    setDataLoading(false);
  }
  async function handleLogin() {
    const pin = authForm.pin;
    if (!pin) { setAuthErr("Please enter your PIN"); return; }
    const match = Object.values(accounts).find(a => a.pin === pin);
    if (!match) { setAuthErr("Incorrect PIN. Please try again."); return; }
    setDataLoading(true);
    try {
      const [profileSnap, daySnap, histSnap] = await Promise.all([
        getDoc(doc(db, "profiles", match.username)),
        getDoc(doc(db, "daily", `${match.username}_${today}`)),
        getDoc(doc(db, "exHistory", match.username)),
      ]);
      if (profileSnap.exists()) { setProfile(profileSnap.data()); setProfileSaved(true); }
      if (daySnap.exists()) setDailyData(daySnap.data());
      if (histSnap.exists()) setExHistory(histSnap.data().entries || []);
      setUser(match); setAuthErr(""); setScreen("dashboard");
      showToast(`Welcome back, ${match.name}! 🙏`);
    } catch (e) { setAuthErr("Sign-in failed. Check your connection."); }
    setDataLoading(false);
  }
  function handleSignOut() {
    setUser(null); setProfile({ weight: "", height: "", age: "", goal: "lose", gender: "male" });
    setProfileSaved(false); setDailyData({}); setExHistory([]);
    setAuthForm({ name: "", pin: "", confirmPin: "" }); setScreen("login");
    showToast("Signed out safely 👋");
  }
  async function saveProfile() {
    if (!profile.weight || !profile.height || !profile.age) { showToast("⚠️ Please fill all fields"); return; }
    setProfileSaved(true);
    setDoc(doc(db, "profiles", user.username), profile).catch(console.error);
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
  function openQuantityModal(food, date) {
    setQuantityModal({ food, date });
    setQuantityInput("");
  }
  function confirmQuantityLog() {
    if (!quantityModal) return;
    const { food, date } = quantityModal;
    const qty = parseFloat(quantityInput) || 1;
    const isPer100g = food.per === "100g";
    const multiplier = isPer100g ? qty / 100 : qty;
    const scaled = {
      ...food,
      name: isPer100g ? `${food.name} (${qty}g)` : qty === 1 ? food.name : `${food.name} ×${qty}`,
      cal: Math.round(food.cal * multiplier),
      protein: Math.round((food.protein || 0) * multiplier),
      carbs: Math.round((food.carbs || 0) * multiplier),
      fat: Math.round((food.fat || 0) * multiplier),
    };
    logMealForDate(scaled, date);
    setQuantityModal(null);
  }
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
    wrap: { fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 90px)", position: "relative" },
    header: { background: C.primary, color: "#fff", padding: "14px 16px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
    card: { background: C.card, borderRadius: 14, border: "0.5px solid #E2E0F5", padding: "14px 16px", margin: "10px 12px" },
    btn: (color = C.primary) => ({ background: color, color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontWeight: 600, cursor: "pointer", fontSize: 14, width: "100%" }),
    btnSm: (color = C.primary) => ({ background: color, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 600, cursor: "pointer", fontSize: 12 }),
    btnOut: { background: "transparent", color: C.primary, border: `1.5px solid ${C.primary}`, borderRadius: 8, padding: "6px 14px", fontWeight: 600, cursor: "pointer", fontSize: 12 },
    input: { width: "100%", border: "1px solid #D0CDF5", borderRadius: 10, padding: "11px 12px", fontSize: 14, boxSizing: "border-box", marginTop: 6, background: "#FAFAFE", outline: "none" },
    label: { fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 10, display: "block" },
    navBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "0.5px solid #E2E0F5", display: "flex", justifyContent: "space-around", padding: "8px 0", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)", zIndex: 100, boxShadow: "0 -2px 10px rgba(0,0,0,0.04)" },
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
        <div style={{ ...S.header, flexDirection: "column", textAlign: "center", padding: "28px 16px 24px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 28px)", gap: 6 }}>
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
          {isReg && <>
            <span style={S.label}>Full Name</span>
            <input style={S.input} placeholder="e.g. Manish Karki" value={authForm.name} onChange={e => setAuthForm(p => ({ ...p, name: e.target.value }))} />
          </>}
          <span style={S.label}>4-Digit PIN</span>
          <input style={{ ...S.input, letterSpacing: 6, fontWeight: 700 }} type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={authForm.pin} onChange={e => setAuthForm(p => ({ ...p, pin: e.target.value.replace(/\D/g, "").slice(0, 4) }))} />
          {isReg && <>
            <span style={S.label}>Confirm PIN</span>
            <input style={{ ...S.input, letterSpacing: 6, fontWeight: 700 }} type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={authForm.confirmPin} onChange={e => setAuthForm(p => ({ ...p, confirmPin: e.target.value.replace(/\D/g, "").slice(0, 4) }))} />
          </>}
          {authErr && <div style={S.err}>⚠️ {authErr}</div>}
          <button style={{ ...S.btn(), marginTop: 16, opacity: dataLoading ? 0.7 : 1 }} onClick={isReg ? handleRegisterStep1 : handleLogin} disabled={dataLoading}>
            {dataLoading ? "Please wait…" : isReg ? "Create Account 🎉" : "Sign In with PIN"}
          </button>
        </div>
        {toast && <div style={S.toast}>{toast}</div>}
      </div>
    );
  }


  if (screen === "onboarding") return (
    <div style={S.wrap}>
      <div style={{ ...S.header, justifyContent: "center", flexDirection: "column", textAlign: "center", padding: "24px 16px", paddingTop: "calc(env(safe-area-inset-top, 0px) + 24px)" }}>
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
    { id: "journal", icon: "📋", label: "Report" },
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
        <div style={{ fontSize: 11, opacity: 0.75, fontStyle: "italic" }}>Build virtue 🌄</div>
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

        <div style={{ ...S.card }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>🎯 Today's Goals</div>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-start" }}>
            <GoalRing
              pct={Math.round((totalCal / calTarget()) * 100)}
              color="#5B4FCF"
              label="Calories"
              value={totalCal}
              target={calTarget()}
              unit=" kcal"
            />
            <GoalRing
              pct={profileSaved ? Math.round((totalProtein / Math.round(+profile.weight * 0.8)) * 100) : 0}
              color="#10B981"
              label="Protein"
              value={totalProtein}
              target={profileSaved ? Math.round(+profile.weight * 0.8) : 120}
              unit="g"
            />
            <GoalRing
              pct={Math.round((water / 8) * 100)}
              color="#3B82F6"
              label="Water"
              value={water}
              target={8}
              unit=" cups"
            />
          </div>
          <div style={{ marginTop: 14, padding: "10px 12px", background: C.primaryLight, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: C.muted }}>💪 Workouts today</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{exerciseLog.length}</div>
          </div>
          {profileSaved && totalCal === 0 && water === 0 && (
            <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 10 }}>
              Log meals in Diet and water in Report to fill your rings!
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 12px 8px" }}>
          <button style={S.btnSm(C.primary)} onClick={() => setTab("diet")}>Diet →</button>
        </div>
      </>}

      {/* DIET */}
      {tab === "diet" && <>
        {profileSaved && <div style={{ ...S.card, background: C.primaryLight }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>🎯 Target: <span style={{ color: C.primary }}>{calTarget()} kcal/day</span></div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Today eaten: <b style={{ color: C.accent }}>{totalCal} kcal</b> · Protein: <b>{totalProtein}g</b></div>
        </div>}

        <div style={S.card}>
          <div style={{ overflowX: "auto", display: "flex", gap: 6, marginBottom: 12, paddingBottom: 4 }}>
            {[["breakfast","🌅 Breakfast"],["lunch","🍽️ Lunch"],["snack","🥪 Snack"],["dinner","🌙 Dinner"],["nepali","🇳🇵 Nepali"],["search","🔍 Search"],["custom","✏️ Custom"]].map(([t,lbl]) => (
              <button key={t} style={{ ...S.pill(foodTab===t), flexShrink: 0 }} onClick={() => setFoodTab(t)}>{lbl}</button>
            ))}
          </div>

          {foodTab !== "search" && (FOOD_DB[foodTab] || []).map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #F0EEF9" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{f.cal} kcal · P:{f.protein}g C:{f.carbs}g F:{f.fat}g</div>
              </div>
              {isDietEditable && <button style={S.btnSm(C.accent)} onClick={() => openQuantityModal(f, dietDate)}>+ Log</button>}
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
                {isDietEditable && <button style={S.btnSm(C.accent)} onClick={() => openQuantityModal(f, dietDate)}>+ Log</button>}
              </div>
            ))}
            {!foodLoading && (
              <div style={{ marginTop: 12, padding: "10px 12px", background: "#FFF9E6", borderRadius: 10, border: "1px solid #F59E0B" }}>
                <div style={{ fontSize: 12, color: "#92400E", fontWeight: 600, marginBottom: 4 }}>Can't find it? Use ✏️ Custom tab to add any food manually.</div>
              </div>
            )}
          </>}

          {foodTab === "custom" && <>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>Add any food — great for Nepali dishes, home-cooked meals, or anything not in the database.</div>
            <span style={S.label}>Food Name *</span>
            <input style={S.input} placeholder="e.g. Dal Bhat, Sel Roti, Momo..." value={customFood.name} onChange={e => setCustomFood(p => ({ ...p, name: e.target.value }))} />
            <span style={S.label}>Calories (kcal) *</span>
            <input style={S.input} type="number" inputMode="numeric" placeholder="e.g. 350" value={customFood.cal} onChange={e => setCustomFood(p => ({ ...p, cal: e.target.value }))} />
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <span style={S.label}>Protein (g)</span>
                <input style={S.input} type="number" inputMode="decimal" placeholder="0" value={customFood.protein} onChange={e => setCustomFood(p => ({ ...p, protein: e.target.value }))} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={S.label}>Carbs (g)</span>
                <input style={S.input} type="number" inputMode="decimal" placeholder="0" value={customFood.carbs} onChange={e => setCustomFood(p => ({ ...p, carbs: e.target.value }))} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={S.label}>Fat (g)</span>
                <input style={S.input} type="number" inputMode="decimal" placeholder="0" value={customFood.fat} onChange={e => setCustomFood(p => ({ ...p, fat: e.target.value }))} />
              </div>
            </div>
            {isDietEditable && (
              <button
                style={{ ...S.btn(C.accent), marginTop: 14 }}
                onClick={() => {
                  if (!customFood.name.trim() || !customFood.cal) { showToast("⚠️ Name and calories are required"); return; }
                  const food = {
                    name: customFood.name.trim(),
                    cal: parseInt(customFood.cal) || 0,
                    protein: parseInt(customFood.protein) || 0,
                    carbs: parseInt(customFood.carbs) || 0,
                    fat: parseInt(customFood.fat) || 0,
                  };
                  openQuantityModal(food, dietDate);
                  setCustomFood({ name: "", cal: "", protein: "", carbs: "", fat: "" });
                }}
              >
                Next: Set Quantity →
              </button>
            )}
          </>}
        </div>

        {/* Food log with date navigation */}
        <div style={S.card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <button style={{ ...S.btnSm(C.primary), padding: "5px 10px" }} onClick={() => navigateDietDate(-1)}>‹ Prev</button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>📝 {isDietToday ? "Today's Log" : formatJournalDate(dietDate)}</div>
              {!isDietToday && <div style={{ fontSize: 10, color: isDietEditable ? C.accent : C.warn, fontWeight: 600 }}>{isDietEditable ? "✏️ Editable" : "🔒 Read only"}</div>}
            </div>
            <button style={{ ...S.btnSm(isDietToday ? "#CCC" : C.primary), padding: "5px 10px" }} onClick={() => navigateDietDate(1)} disabled={isDietToday}>Next ›</button>
          </div>
          {!isDietToday && <button style={{ ...S.btnSm(C.accent), width: "100%", marginBottom: 10 }} onClick={() => setDietDate(today)}>Jump to Today</button>}
          {dietMeals.length === 0
            ? <div style={{ fontSize: 13, color: C.muted, textAlign: "center", padding: 10 }}>{isDietToday ? "No meals logged yet. Pick from the categories above." : "No meals logged on this day."}</div>
            : dietMeals.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid #F0EEF9" }}>
                <div style={{ fontSize: 13 }}>{m.name} <span style={{ color: C.muted, fontSize: 11 }}>({m.cal} kcal)</span></div>
                {isDietEditable && <span style={{ color: C.danger, cursor: "pointer", fontSize: 22, lineHeight: 1, padding: "0 8px" }} onClick={() => removeMealForDate(i, dietDate)}>×</span>}
              </div>
            ))
          }
          {dietMeals.length > 0 && <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginTop: 8 }}>Total: {dietTotalCal} kcal · {dietTotalProtein}g protein</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 12px 8px" }}>
          <button style={S.btnSm(C.primary)} onClick={() => setTab("exercise")}>व्यायाम →</button>
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
            {[["push","Chest & Tri"], ["pull","Back & Bi"], ["legs","Legs"], ["shoulders","Shoulders"], ["core","Abs"], ["cardio","❤️ Cardio"]].map(([c, lbl]) => (
              <button key={c} style={{ ...S.pill(exCat === c), flexShrink: 0 }} onClick={() => setExCat(c)}>{lbl}</button>
            ))}
          </div>
          <div style={S.card}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              {exCat === "push" ? "Chest & Triceps" : exCat === "pull" ? "Back & Biceps" : exCat === "legs" ? "Legs" : exCat === "shoulders" ? "Shoulders" : exCat === "core" ? "Abs" : "❤️ Cardio"} Workout
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
              {exCat === "push" ? "Chest, Triceps & Upper Body" : exCat === "pull" ? "Back, Biceps & Deadlift" : exCat === "legs" ? "Quads, Hamstrings, Glutes & More" : exCat === "shoulders" ? "Deltoid Focus" : exCat === "core" ? "Abs, Obliques & Core Stability" : "Log mins in the Reps field · Sets = rounds"}
            </div>
            {EXERCISES[exCat].map((ex, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: "0.5px solid #F0EEF9", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</div>
                    <span style={S.tag(C.primary)}>{ex.sets}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{ex.muscle} · ~{ex.cal} kcal</div>
                </div>
                <button style={S.btnSm(C.accent)} onClick={() => openLogModal(ex, exCat)}>+ Log</button>
              </div>
            ))}
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
                <div style={S.stat}><div style={{ fontSize: 10, color: C.muted }}>Total lbs</div><div style={{ fontSize: 20, fontWeight: 800, color: C.warn }}>{Math.round(exHistory.reduce((s, e) => s + ((e.weight || 0) * (e.reps || 0) * (e.setsDone || 1)), 0))}</div></div>
              </div>
            </div>
          )}

          {/* Daily exercise log by date */}
          <div style={S.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <button style={{ ...S.btnSm(C.primary), padding: "5px 10px" }} onClick={() => navigateExHistDate(-1)}>‹ Prev</button>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>📅 {exHistDate === today ? "Today" : formatJournalDate(exHistDate)}</div>
                <div style={{ fontSize: 10, color: C.muted }}>Daily Exercise Log</div>
              </div>
              <button style={{ ...S.btnSm(exHistDate === today ? "#CCC" : C.primary), padding: "5px 10px" }} onClick={() => navigateExHistDate(1)} disabled={exHistDate === today}>Next ›</button>
            </div>
            {exHistDate !== today && <button style={{ ...S.btnSm(C.accent), width: "100%", marginBottom: 10 }} onClick={() => setExHistDate(today)}>Jump to Today</button>}
            {exHistDayLog.length === 0
              ? <div style={{ fontSize: 13, color: C.muted, textAlign: "center", padding: 10 }}>No exercises logged on this day.</div>
              : exHistDayLog.map((e, i) => (
                <div key={i} style={{ padding: "7px 0", borderBottom: "0.5px solid #F0EEF9" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    {e.weight ? `${e.weight}lbs × ${e.reps || "?"} reps${e.setsDone ? ` × ${e.setsDone} sets` : ""}` : "Bodyweight"} · {e.cat} · {e.time}
                  </div>
                </div>
              ))
            }
            {exHistDayLog.length > 0 && (
              <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, marginTop: 8 }}>
                {exHistDayLog.length} exercise{exHistDayLog.length > 1 ? "s" : ""} · {Math.round(exHistDayLog.reduce((s, e) => s + (e.cal || 0), 0))} kcal burned
              </div>
            )}
          </div>
        </>}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 12px 8px" }}>
          <button style={S.btnSm(C.primary)} onClick={() => setTab("journal")}>Report →</button>
        </div>
      </>}

      {/* JOURNAL */}
      {tab === "journal" && <>
        <div style={{ ...S.card, background: "linear-gradient(135deg, #EEF0FF, #DBEAFE)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <button style={{ ...S.btnSm(C.primary), padding: "5px 10px" }} onClick={() => navigateJournalDate(-1)}>‹ Prev</button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>📋 {isViewingToday ? "Today's Report" : formatJournalDate(journalDate)}</div>
              {!isViewingToday && <div style={{ fontSize: 10, color: isJournalEditable ? C.accent : C.warn, fontWeight: 600, marginTop: 2 }}>{isJournalEditable ? "✏️ Editable — within 4 days" : "🔒 Read only — too old to edit"}</div>}
            </div>
            <button style={{ ...S.btnSm(isViewingToday ? "#CCC" : C.primary), padding: "5px 10px" }} onClick={() => navigateJournalDate(1)} disabled={isViewingToday}>Next ›</button>
          </div>
          {!isViewingToday && <button style={{ ...S.btnSm(C.accent), width: "100%", marginTop: 4 }} onClick={() => setJournalDate(today)}>Jump to Today</button>}
          {isViewingToday && <div style={{ fontSize: 12, color: C.muted }}>Everything you tracked today, all in one place.</div>}
        </div>

        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>💧 Water Intake</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>{jWater} / 8 cups</div>
          </div>
          <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} onClick={() => isJournalEditable && setDayForDate(journalDate, "water", Math.max(0, jWater > i ? i : i + 1))} style={{ cursor: isJournalEditable ? "pointer" : "default", fontSize: 28, opacity: i < jWater ? 1 : 0.25, transition: "all 0.15s" }}>💧</div>
            ))}
          </div>
          {isJournalEditable && <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button style={{ ...S.btnSm(C.blue), flex: 1 }} onClick={() => setDayForDate(journalDate, "water", Math.max(0, jWater + 1))}>+ Add Cup</button>
            <button style={{ ...S.btnOut, flex: 1, padding: "6px" }} onClick={() => setDayForDate(journalDate, "water", 0)}>Reset</button>
          </div>}
        </div>

        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>🥗 Eating ({jMeals.length} meals)</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{jTotalCal} kcal</span>
          </div>
          {jMeals.length === 0 ? <div style={{ fontSize: 13, color: C.muted, padding: 8, textAlign: "center" }}>No meals logged{isViewingToday ? ". Tap Diet tab to add." : " on this day."}</div> :
            jMeals.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "0.5px solid #F0EEF9" }}>
                <span>• {m.name}</span><span style={{ color: C.primary, fontWeight: 600 }}>{m.cal} kcal</span>
              </div>
            ))
          }
        </div>

        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>💪 Workouts ({jExLog.length})</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{jExLog.reduce((s, e) => s + (e.cal || 0), 0)} kcal</span>
          </div>
          {jExLog.length === 0 ? <div style={{ fontSize: 13, color: C.muted, padding: 8, textAlign: "center" }}>No exercises logged{isViewingToday ? ". Tap Exercise tab to add." : " on this day."}</div> :
            jExLog.map((e, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid #F0EEF9" }}>
                <div style={{ fontSize: 13, flex: 1 }}>
                  <div>{e.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    {e.weight ? `${e.weight}lbs × ${e.reps || "?"} reps${e.setsDone ? ` × ${e.setsDone} sets` : ""} · ` : ""}{e.cat} · {e.time}
                  </div>
                </div>
                {isJournalEditable && <span style={{ color: C.danger, cursor: "pointer", fontSize: 20, padding: "0 6px" }} onClick={() => removeExForDate(i, journalDate)}>×</span>}
              </div>
            ))
          }
        </div>

        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>✅ Habits</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.warn }}>{jHabitsCount} / 5 done</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[["💧", "water", "Water"], ["🥗", "healthy", "Eat"], ["🧘", "meditate", "Meditate"], ["😴", "sleep", "Sleep"], ["🚶", "walk", "Walk"]].map(([icon, k, lbl]) => (
              <div key={k} style={{ flex: 1, minWidth: 60, textAlign: "center", padding: "8px 4px", borderRadius: 8, background: jHabits[k] ? C.accentLight : "#F5F5F8", border: `1px solid ${jHabits[k] ? C.accent : "#EEE"}` }}>
                <div style={{ fontSize: 18 }}>{icon}</div>
                <div style={{ fontSize: 10, color: jHabits[k] ? C.accent : C.muted, fontWeight: 600, marginTop: 2 }}>{jHabits[k] ? "✓ " : ""}{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>😊 How are you feeling?</div>
          <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
            {MOOD_OPTIONS.map((m, i) => (
              <div key={i} onClick={() => isJournalEditable && setDayForDate(journalDate, "mood", m.label)} style={{ cursor: isJournalEditable ? "pointer" : "default", flex: 1, textAlign: "center", padding: 8, borderRadius: 10, background: jMood === m.label ? C.primaryLight : "transparent", border: `1.5px solid ${jMood === m.label ? C.primary : "transparent"}` }}>
                <div style={{ fontSize: 26 }}>{m.emoji}</div>
                <div style={{ fontSize: 10, color: jMood === m.label ? C.primary : C.muted, fontWeight: 600 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>📝 Daily Reflection</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>How did your day go? Wins, challenges, thoughts...</div>
          <textarea
            style={{ ...S.input, minHeight: 100, fontFamily: "inherit", resize: "vertical", marginTop: 0, background: isJournalEditable ? "#FAFAFE" : "#F5F5F5" }}
            placeholder="Today I felt... I'm grateful for... Tomorrow I want to..."
            value={jNotes}
            onChange={e => isJournalEditable && setDayForDate(journalDate, "notes", e.target.value)}
            readOnly={!isJournalEditable}
          />
          <div style={{ fontSize: 11, color: C.muted, marginTop: 6, textAlign: "right" }}>{jNotes.length} characters {isJournalEditable ? "· Auto-saved 💾" : "· read only"}</div>
        </div>

        <div style={{ ...S.card, background: C.accentLight, border: `1px solid ${C.accent}`, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#065F46", fontWeight: 600 }}>🌟 Day Score: {Math.round(((jHabitsCount * 20) + (jWater >= 8 ? 20 : jWater * 2.5) + (jExLog.length > 0 ? 20 : 0) + (jNotes.length > 20 ? 20 : 0) + (jMood ? 20 : 0)) / 5)}%</div>
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
          <div style={{ fontSize: 11, color: "#92400E", marginTop: 4, lineHeight: 1.5 }}>All data is stored privately on this device. Sign out below to keep it secure.</div>
        </div>

        <div style={{ ...S.card, border: `1.5px solid ${C.danger}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.danger, marginBottom: 6 }}>Sign Out</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>You'll need your 4-digit PIN to sign back in.</div>
          <button style={{ ...S.btn(C.danger) }} onClick={handleSignOut}>Sign Out of My Sadbani</button>
        </div>
      </>}

      <nav style={S.navBar}>
        {TABS.map(({ id, icon, label }) => (
          <div key={id} style={S.navItem(tab === id)} onClick={() => { setTab(id); if (id !== "journal") setJournalDate(today); }}>
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

      {quantityModal && (() => {
        const f = quantityModal.food;
        const isPer100g = f.per === "100g";
        const qty = parseFloat(quantityInput) || 0;
        const multiplier = isPer100g ? qty / 100 : qty;
        const previewCal = qty > 0 ? Math.round(f.cal * multiplier) : 0;
        return (
          <div style={S.modal} onClick={() => setQuantityModal(null)}>
            <div style={S.modalCard} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>How much did you eat?</div>
              <div style={{ fontSize: 13, color: C.primary, fontWeight: 600, marginBottom: 2 }}>{f.name}</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>Base: {f.cal} kcal {isPer100g ? "per 100g" : "per serving"}</div>
              <span style={{ ...S.label, marginTop: 0 }}>{isPer100g ? "Amount (grams)" : "Quantity (servings, e.g. 0.5, 1, 2)"}</span>
              <input
                style={S.input}
                type="number"
                inputMode="decimal"
                placeholder={isPer100g ? "e.g. 150" : "e.g. 0.5"}
                value={quantityInput}
                onChange={e => setQuantityInput(e.target.value)}
                autoFocus
              />
              {qty > 0 && (
                <div style={{ marginTop: 10, padding: "10px 12px", background: C.primaryLight, borderRadius: 10, fontSize: 13 }}>
                  <b style={{ color: C.primary }}>{previewCal} kcal</b>
                  <span style={{ color: C.muted }}> · P:{Math.round((f.protein || 0) * multiplier)}g C:{Math.round((f.carbs || 0) * multiplier)}g F:{Math.round((f.fat || 0) * multiplier)}g</span>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button style={{ ...S.btnOut, flex: 1, padding: "10px" }} onClick={() => setQuantityModal(null)}>Cancel</button>
                <button style={{ ...S.btn(), flex: 2 }} onClick={confirmQuantityLog} disabled={!quantityInput}>Log {qty > 0 ? previewCal + " kcal" : ""} ✓</button>
              </div>
            </div>
          </div>
        );
      })()}

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}
