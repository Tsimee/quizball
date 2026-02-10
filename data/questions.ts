export type Sport = "football" | "basket";

export type Category =
  | "Geography"
  | "History"
  | "Top5"
  | "PlayerID"
  | "Logo"
  | "ClubCombo"
  | "GeorgesQuestion"
  | "PhotoQuiz"
  | "FiftyFifty";

export type Question = {
  id: string;
  sport: Sport;
  category: Category;
  difficulty: 1 | 2 | 3;

  // ✅ νέο: τι τύπος ερώτησης είναι
  kind?: "mcq" | "top5";

  question: string;

  // για mcq (όπως έχεις ήδη)
  answers?: string[];
  correctIndex?: number;
  acceptedAnswers?: string[];

  // ✅ για top5
  top5?: string[]; // ΠΡΕΠΕΙ να είναι 5 στοιχεία, με σωστή σειρά
  acceptedTop5?: Record<number, string[]>; // έξτρα δεκτές απαντήσεις ανά θέση (0..4)
};


export const QUESTIONS: Question[] = [

  {
    id: "geo_1",
    sport: "football",
    category: "Geography",
    difficulty: 1,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "geo_2",
    sport: "football",
    category: "Geography",
    difficulty: 2,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "geo_3",
    sport: "football",
    category: "Geography",
    difficulty: 3,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },

  {
    id: "hist_1",
    sport: "football",
    category: "History",
    difficulty: 1,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "hist_2",
    sport: "football",
    category: "History",
    difficulty: 2,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "hist_3",
    sport: "football",
    category: "History",
    difficulty: 3,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },

  {
  id: "f_top5_3_1",
  sport: "football",
  category: "Top5",
  difficulty: 3,
  kind: "top5",
  question: "ΕΔΩ ΓΡΑΨΕ TOP5 ΕΡΩΤΗΣΗ (πχ 5 πρωτοι σκορερ UCL)",
  top5: [
    "ΕΔΩ ΘΕΣΗ 1",
    "ΕΔΩ ΘΕΣΗ 2",
    "ΕΔΩ ΘΕΣΗ 3",
    "ΕΔΩ ΘΕΣΗ 4",
    "ΕΔΩ ΘΕΣΗ 5",
  ],
  acceptedTop5: {
    0: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 1"],
    1: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 2"],
    2: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 3"],
    3: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 4"],
    4: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 5"],
  },
},

{
  id: "f_top5_3_2",
  sport: "football",
  category: "Top5",
  difficulty: 3,
  kind: "top5",
  question: "ΕΔΩ ΓΡΑΨΕ TOP5 ΕΡΩΤΗΣΗ (πχ 5 ομαδες με τα περισσοτερα UCL)",
  top5: [
    "ΕΔΩ ΘΕΣΗ 1",
    "ΕΔΩ ΘΕΣΗ 2",
    "ΕΔΩ ΘΕΣΗ 3",
    "ΕΔΩ ΘΕΣΗ 4",
    "ΕΔΩ ΘΕΣΗ 5",
  ],
  acceptedTop5: {
    0: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 1"],
    1: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 2"],
    2: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 3"],
    3: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 4"],
    4: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 5"],
  },
},

{
  id: "f_top5_3_3",
  sport: "football",
  category: "Top5",
  difficulty: 3,
  kind: "top5",
  question: "ΕΔΩ ΓΡΑΨΕ TOP5 ΕΡΩΤΗΣΗ (πχ 5 παικτες με τις περισσοτερες Χρυσες Μπαλες)",
  top5: [
    "ΕΔΩ ΘΕΣΗ 1",
    "ΕΔΩ ΘΕΣΗ 2",
    "ΕΔΩ ΘΕΣΗ 3",
    "ΕΔΩ ΘΕΣΗ 4",
    "ΕΔΩ ΘΕΣΗ 5",
  ],
  acceptedTop5: {
    0: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 1"],
    1: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 2"],
    2: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 3"],
    3: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 4"],
    4: ["ΕΔΩ ΔΕΚΤΕΣ ΓΙΑ ΘΕΣΗ 5"],
  },
},


  {
    id: "playerid_1",
    sport: "football",
    category: "PlayerID",
    difficulty: 2,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "playerid_2",
    sport: "football",
    category: "PlayerID",
    difficulty: 3,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "playerid_3",
    sport: "football",
    category: "PlayerID",
    difficulty: 3,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },

  {
    id: "logo_1",
    sport: "football",
    category: "Logo",
    difficulty: 1,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "logo_2",
    sport: "football",
    category: "Logo",
    difficulty: 2,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "logo_3",
    sport: "football",
    category: "Logo",
    difficulty: 3,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },

  {
    id: "clubcombo_1",
    sport: "football",
    category: "ClubCombo",
    difficulty: 1,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "clubcombo_2",
    sport: "football",
    category: "ClubCombo",
    difficulty: 2,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "clubcombo_3",
    sport: "football",
    category: "ClubCombo",
    difficulty: 3,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },

  {
    id: "georgeq_1",
    sport: "football",
    category: "GeorgesQuestion",
    difficulty: 1,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "georgeq_2",
    sport: "football",
    category: "GeorgesQuestion",
    difficulty: 2,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "georgeq_3",
    sport: "football",
    category: "GeorgesQuestion",
    difficulty: 3,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },

  {
    id: "photo_1",
    sport: "football",
    category: "PhotoQuiz",
    difficulty: 2,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },
  {
    id: "photo_2",
    sport: "football",
    category: "PhotoQuiz",
    difficulty: 3,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
    acceptedAnswers: ["ΕΔΩ ΒΑΛΕ ΚΑΙ ΑΛΛΕΣ ΔΕΚΤΕΣ ΑΠΑΝΤΗΣΕΙΣ"],
  },

  {
    id: "5050_1",
    sport: "football",
    category: "FiftyFifty",
    difficulty: 1,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ (ΤΥΠΟΥ ΝΑΙ/ΟΧΙ)",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
  },
  {
    id: "5050_2",
    sport: "football",
    category: "FiftyFifty",
    difficulty: 1,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ (ΤΥΠΟΥ ΝΑΙ/ΟΧΙ)",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
  },
  {
    id: "5050_3",
    sport: "football",
    category: "FiftyFifty",
    difficulty: 1,
    question: "ΕΔΩ ΓΡΑΨΕ ΕΡΩΤΗΣΗ (ΤΥΠΟΥ ΝΑΙ/ΟΧΙ)",
    answers: ["ΕΔΩ ΓΡΑΨΕ ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ"],
    correctIndex: 0,
  },

];

