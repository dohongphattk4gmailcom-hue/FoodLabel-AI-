export interface FoodLabelData {
  productName: string;
  brand?: string;
  servingSize: number; // e.g. 30
  servingUnit: string; // e.g. "g" or "ml"
  servingsPerContainer: number; // e.g. 2
  netWeight: number; // e.g. 60
  netWeightUnit: string; // e.g. "g" or "ml"

  // Dinh dưỡng mỗi khẩu phần (Nutrition per serving)
  caloriesPerServing: number; // kcal
  sugarsPerServing: number | null; // g (null if not available on label)
  totalFatPerServing: number; // g
  saturatedFatPerServing?: number; // g
  proteinPerServing: number; // g
  sodiumPerServing?: number | null; // mg
  carbsPerServing?: number; // g
  saltPerServing?: number | null; // g muối nếu ghi thay cho natri

  // Thành phần & Hạn dùng
  ingredientsText: string;
  ingredientList: string[];
  expirationDateText: string; // If none: "Không tìm thấy thông tin hạn dùng trên dữ liệu cung cấp"
  allergensWarning?: string;
  storageInstructions?: string;

  // Raw notes or extra info
  notes?: string;

  // Image clarity evaluation
  isImageClear?: boolean;
  unclearReason?: string; // e.g. "Ảnh mờ", "Chụp nghiêng", "Chữ quá nhỏ"
}

export interface FieldValidationStatus {
  productName: 'unconfirmed' | 'correct' | 'edited';
  servingSize: 'unconfirmed' | 'correct' | 'edited';
  servingsPerContainer: 'unconfirmed' | 'correct' | 'edited';
  caloriesPerServing: 'unconfirmed' | 'correct' | 'edited';
  sugarsPerServing: 'unconfirmed' | 'correct' | 'edited';
  sodiumPerServing: 'unconfirmed' | 'correct' | 'edited';
  expirationDateText: 'unconfirmed' | 'correct' | 'edited';
  ingredientsText: 'unconfirmed' | 'correct' | 'edited';
}

export interface FiveAnglesAnalysis {
  // 1. 🥣 Khẩu phần
  servingAngle: {
    title: string;
    servingText: string;
    servingsPerContainerText: string;
    containerTotalWeight: string;
    aiFinding: string;
    statedData?: string;
    calculatedData?: string;
  };

  // 2. 🧾 Thành phần
  ingredientsAngle: {
    title: string;
    rawText: string;
    parsedList: string[];
    topIngredients: string[];
    additivesOrSweeteners: string[];
    allergens: string[];
    aiFinding: string;
    allergenNotice: string;
  };

  // 3. 📊 Dinh dưỡng
  nutritionAngle: {
    title: string;
    caloriesPerServing: number;
    macronutrients: {
      name: string;
      value: number | null;
      unit: string;
      percentageDV?: string;
    }[];
    aiFinding: string;
    calculationNote?: string;
  };

  // 4. 📅 Hạn dùng
  expirationAngle: {
    title: string;
    rawText: string;
    status: 'found' | 'not_found';
    displayText: string; // MUST be "Không tìm thấy thông tin hạn dùng trên dữ liệu cung cấp" if not found
    aiFinding: string;
  };

  // 5. 🔎 Điều cần kiểm tra
  checkpointsAngle: {
    title: string;
    missingOrAmbiguousItems: string[];
    questionsForStudent: string[];
    verificationTips: string[];
  };
}

export interface RuleCheckResult {
  servingVsNetWeight: {
    isMatch: boolean;
    calculatedTotal: number;
    statedTotal: number;
    unit: string;
    formula: string;
    explanation: string;
  };
  macroCalorieCheck: {
    reportedKcal: number;
    estimatedFromMacrosKcal: number; // 4 * carbs + 4 * protein + 9 * fat
    differencePercent: number;
    isConsistent: boolean;
    formula: string;
    explanation: string;
  };
  unitAudit: {
    isClean: boolean;
    findings: string[];
  };
  consumptionMath: {
    servingSize: number;
    servingsPerContainer: number;
    amountConsumed: number;
    unit: string;
    ratio: number;
    totalKcal: number;
    totalSugarGrams?: number;
    totalSodiumMg?: number;
    weightFormula: string;
    calorieFormula: string;
    stepExplanation: string;
  };
}

export interface StudentObservation {
  predictedServings: string;
  predictedTotalCalories: string;
  notesToCheck: string;
  submittedAt?: string;
}

// Personal Nutrition & BMI Tracker Types (Theo dõi dinh dưỡng cá nhân)
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';
export type NutritionGoal = 'balanced' | 'maintain' | 'healthy_change';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface UserPersonalProfile {
  name: string;
  weightKg: number;
  heightCm: number;
  age: number;
  gender?: 'male' | 'female' | 'unspecified';
  activityLevel: ActivityLevel;
  personalGoal: NutritionGoal;
  isProfileSet: boolean;
}

export interface BmiAnalysis {
  bmiValue: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obesity_risk';
  categoryLabel: string;
  colorClass: string;
  percentileRange: string;
  explanation: string;
  educationalTip: string;
  isChildOrTeen: boolean;
}

export interface CalorieNeedsEstimate {
  bmr: number;
  tdee: number;
  activityMultiplier: number;
  carbGramsTarget: number;
  proteinGramsTarget: number;
  fatGramsTarget: number;
  sugarMaxGrams: number;
  sodiumMaxMg: number;
  scientificNotes: string;
}

// Daily Food Log (Hôm nay em đã ăn gì? & Theo dõi dinh dưỡng)
export interface DailyFoodLogItem {
  id: string;
  productName: string;
  servingSize: number;
  servingUnit: string;
  quantityServings: number; // e.g. 1 or 2
  consumedWeight: number; // e.g. 60g
  calories: number; // total kcal
  sugars: number; // total g
  sodium: number; // total mg
  saltGrams: number; // total g (sodium / 400 or salt direct)
  protein?: number; // total protein g
  fat?: number; // total fat g
  carbs?: number; // total carbs g
  mealType?: MealType;
  dateKey?: string; // e.g. "2026-10-15"
  loggedAt: string;
  notes?: string;
}

// 20 Testing Labels Suite (Mục 6)
export interface TestingLabelItem {
  id: string;
  name: string;
  category: 'clear' | 'blurry' | 'tilted' | 'tiny_text';
  categoryLabel: string;
  challengeNote: string;
  imageUrl: string;
  mimeType: string;
  groundTruth: {
    productName: string;
    servingSize: number;
    servingUnit: string;
    servingsPerContainer: number;
    caloriesPerServing: number;
    sugarsPerServing: number | null;
    sodiumPerServing: number | null;
    expirationDateText: string;
    hasExpiry: boolean;
    ingredientsKeyText: string;
    shouldReject: boolean;
    rejectionReason?: string;
  };
  testRunResult?: {
    testedAt: string;
    aiExtractedData: Partial<FoodLabelData>;
    isRejectedByAI: boolean;
    rejectionMessage?: string;
    correctFieldsCount: number;
    wrongFieldsCount: number;
    omittedFields: string[];
    fieldDiscrepancies: {
      fieldName: string;
      expected: string | number;
      actual: string | number;
      isMatch: boolean;
    }[];
  };
}

// User Feedback & Changelog (Mục 9)
export interface UserFeedbackItem {
  id: string;
  studentName: string;
  schoolGrade: string; // "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"
  easeOfUseScore: number; // 1 to 5
  comprehensionScore: number; // 1 to 5
  accuracyScore: number; // 1 to 5
  encounteredErrors: string;
  userComments: string;
  submittedAt: string;
}

export interface VersionChangelogItem {
  version: string;
  date: string;
  title: string;
  fixes: string[];
  improvements: string[];
}

export interface ScenarioQuestion {
  id: string;
  title: string;
  badge: string;
  situation: string;
  labelSnippet: {
    serving?: string;
    energy?: string;
    ingredients?: string;
    expiration?: string;
    notes?: string;
  };
  question: string;
  options: {
    id: string;
    actionText: string;
    isCorrectAction: boolean;
  }[];
  expectedRationaleKeywords: string[];
  explanation: string;
  lessonLearned: string;
}

export interface LabelComparisonItem {
  id: string;
  title: string;
  description: string;
  changedDetailSummary: string;
  labelA: FoodLabelData;
  labelB: FoodLabelData;
  comparisonPoints: {
    aspect: string;
    valueA: string;
    valueB: string;
    impactExplanation: string;
  }[];
  guidedPrompt: string;
  takeaway: string;
}
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: string;
  personalGoal?: string;
  calculatedBmi?: number;
  estimatedTdee?: number;
  createdAt?: string;
  updatedAt?: string;
}
