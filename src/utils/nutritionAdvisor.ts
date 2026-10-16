import {
  UserPersonalProfile,
  BmiAnalysis,
  CalorieNeedsEstimate,
  ActivityLevel,
  NutritionGoal,
} from '../types';

/**
 * Tính toán và phân tích chỉ số BMI phù hợp với lứa tuổi:
 * Với học sinh và thanh thiếu niên (11 - 18 tuổi):
 * Áp dụng phân vị BMI theo tuổi (BMI-for-age percentiles) của Tổ chức Y tế Thế giới (WHO)
 * và Viện Dinh Dưỡng Quốc Gia Việt Nam.
 * Tuyệt đối không áp dụng tiêu chuẩn cứng nhắc của người lớn để chẩn đoán hay ép cân.
 */
export function calculateBmiAnalysis(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'unspecified' = 'unspecified'
): BmiAnalysis {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) {
    return {
      bmiValue: 0,
      category: 'normal',
      categoryLabel: 'Chưa có đủ dữ liệu',
      colorClass: 'text-slate-400 bg-slate-100 border-slate-200',
      percentileRange: 'Chưa tính',
      explanation: 'Vui lòng nhập chiều cao và cân nặng để tính toán.',
      educationalTip: 'Đo chiều cao bằng thước đứng và cân vào buổi sáng sau khi thức dậy để có số liệu chuẩn nhất.',
      isChildOrTeen: age < 19,
    };
  }

  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmiValue = Math.round(bmiRaw * 10) / 10;
  const isChildOrTeen = age < 19;

  // Thang phân tích BMI
  if (isChildOrTeen) {
    // Với học sinh THCS và thanh thiếu niên (WHO BMI-for-age z-score / percentiles tham khảo)
    // Ngưỡng tham chiếu xấp xỉ cho độ tuổi 11-18:
    let lowCutoff = 15.5;
    let highCutoff = 22.5;
    let obeseCutoff = 25.5;

    if (age <= 12) {
      lowCutoff = 14.8;
      highCutoff = 21.0;
      obeseCutoff = 24.0;
    } else if (age <= 14) {
      lowCutoff = 15.8;
      highCutoff = 22.5;
      obeseCutoff = 25.5;
    } else if (age <= 16) {
      lowCutoff = 16.5;
      highCutoff = 23.5;
      obeseCutoff = 26.5;
    } else {
      lowCutoff = 17.5;
      highCutoff = 24.5;
      obeseCutoff = 28.0;
    }

    if (bmiValue < lowCutoff) {
      return {
        bmiValue,
        category: 'underweight',
        categoryLabel: 'Thể trạng nhẹ cân (Dưới phân vị 5th)',
        colorClass: 'text-blue-800 bg-blue-50 border-blue-200',
        percentileRange: '< 5th percentile',
        explanation: `BMI = ${bmiValue}. Ở lứa tuổi ${age}, chỉ số này cho thấy em đang có thể trạng mảnh khảnh hoặc nhẹ cân so với biểu đồ tăng trưởng chuẩn của lứa tuổi.`,
        educationalTip:
          'Lứa tuổi học sinh đang phát triển chiều cao vượt bậc. Em cần ăn đủ 3 bữa chính, bổ sung các thực phẩm giàu đạm (thịt nạc, cá, trứng, đậu), uống 2-3 ly sữa mỗi ngày và ngủ đủ giấc từ 8-9 tiếng.',
        isChildOrTeen: true,
      };
    } else if (bmiValue <= highCutoff) {
      return {
        bmiValue,
        category: 'normal',
        categoryLabel: 'Thể trạng cân đối (Phân vị 5th - 85th)',
        colorClass: 'text-emerald-800 bg-emerald-50 border-emerald-200',
        percentileRange: '5th - 85th percentile (Lý tưởng)',
        explanation: `BMI = ${bmiValue}. Chúc mừng em! Chỉ số nằm trong khoảng tăng trưởng cân đối và khỏe mạnh của học sinh ${age} tuổi.`,
        educationalTip:
          'Hãy duy trì thói quen ăn uống đa dạng 4 nhóm chất (Tinh bột, Đạm, Béo, Vitamin/Khoáng chất), vận động thể thao tối thiểu 60 phút mỗi ngày và uống đủ nước.',
        isChildOrTeen: true,
      };
    } else if (bmiValue <= obeseCutoff) {
      return {
        bmiValue,
        category: 'overweight',
        categoryLabel: 'Nguy cơ thừa cân (Phân vị 85th - 95th)',
        colorClass: 'text-amber-800 bg-amber-50 border-amber-200',
        percentileRange: '85th - 95th percentile',
        explanation: `BMI = ${bmiValue}. Chỉ số nằm ở ngưỡng trên của mức chuẩn lứa tuổi ${age}.`,
        educationalTip:
          'Lưu ý an toàn: Không tự ý nhịn ăn hay cắt giảm bữa ăn! Thay vào đó, em hãy hạn chế nước ngọt, trà sữa, bánh snack nhiều đường muối; ăn nhiều rau xanh và tích cực tham gia các môn thể thao như bơi lội, cầu lông, bóng rổ.',
        isChildOrTeen: true,
      };
    } else {
      return {
        bmiValue,
        category: 'obesity_risk',
        categoryLabel: 'Nguy cơ béo phì (Trên phân vị 95th)',
        colorClass: 'text-rose-800 bg-rose-50 border-rose-200',
        percentileRange: '> 95th percentile',
        explanation: `BMI = ${bmiValue}. Ở lứa tuổi ${age}, chỉ số này cao hơn khuyến nghị tăng trưởng thông thường.`,
        educationalTip:
          'Nguyên tắc giáo dục y tế: Tuyệt đối không dùng các biện pháp ép cân cực đoan hay thuốc giảm cân. Em nên chia sẻ với phụ huynh, thầy cô y tế học đường hoặc chuyên gia dinh dưỡng để được hướng dẫn lối sống lành mạnh, tăng vận động và điều chỉnh chế độ ăn gia đình.',
        isChildOrTeen: true,
      };
    }
  } else {
    // Tiêu chuẩn người lớn (Châu Á - WPRO / Bộ Y Tế)
    if (bmiValue < 18.5) {
      return {
        bmiValue,
        category: 'underweight',
        categoryLabel: 'Gầy / Thiếu cân (BMI < 18.5)',
        colorClass: 'text-blue-800 bg-blue-50 border-blue-200',
        percentileRange: 'BMI < 18.5',
        explanation: `BMI = ${bmiValue}. Thể trạng hơi gầy so với mức chuẩn khuyến nghị.`,
        educationalTip: 'Tăng cường các bữa phụ bổ dưỡng như sữa chua, hạt ngũ cốc, sinh tố trái cây.',
        isChildOrTeen: false,
      };
    } else if (bmiValue <= 22.9) {
      return {
        bmiValue,
        category: 'normal',
        categoryLabel: 'Bình thường / Cân đối (18.5 - 22.9)',
        colorClass: 'text-emerald-800 bg-emerald-50 border-emerald-200',
        percentileRange: '18.5 - 22.9 (Chuẩn Châu Á)',
        explanation: `BMI = ${bmiValue}. Thể trạng lý tưởng và cân đối.`,
        educationalTip: 'Tiếp tục duy trì chế độ dinh dưỡng cân đối và tập thể dục đều đặn.',
        isChildOrTeen: false,
      };
    } else if (bmiValue <= 24.9) {
      return {
        bmiValue,
        category: 'overweight',
        categoryLabel: 'Tiền béo phì / Thừa cân (23.0 - 24.9)',
        colorClass: 'text-amber-800 bg-amber-50 border-amber-200',
        percentileRange: '23.0 - 24.9',
        explanation: `BMI = ${bmiValue}. Hơi thừa cân so với tiêu chuẩn người trưởng thành Châu Á.`,
        educationalTip: 'Hạn chế đồ chiên xào nhiều dầu mỡ và thực phẩm chế biến sẵn giàu natri.',
        isChildOrTeen: false,
      };
    } else {
      return {
        bmiValue,
        category: 'obesity_risk',
        categoryLabel: 'Béo phì (BMI ≥ 25.0)',
        colorClass: 'text-rose-800 bg-rose-50 border-rose-200',
        percentileRange: '≥ 25.0',
        explanation: `BMI = ${bmiValue}. Nằm trong ngưỡng béo phì theo chuẩn WPRO.`,
        educationalTip: 'Nên tham khảo ý kiến chuyên gia dinh dưỡng để có lộ trình rèn luyện sức khỏe phù hợp.',
        isChildOrTeen: false,
      };
    }
  }
}

/**
 * Ước tính nhu cầu calo tham khảo hàng ngày (BMR & TDEE)
 * Theo công thức Mifflin-St Jeor và hệ số vận động thể chất (PAL)
 */
export function estimateCalorieNeeds(profile: UserPersonalProfile): CalorieNeedsEstimate {
  const { weightKg, heightCm, age, gender, activityLevel, personalGoal } = profile;

  // Tính BMR (Tỷ lệ trao đổi chất cơ bản)
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else if (gender === 'female') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    // Không chọn hoặc trung tính
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
  }
  bmr = Math.round(bmr);

  // Hệ số mức độ vận động (PAL)
  let activityMultiplier = 1.25;
  if (activityLevel === 'light') activityMultiplier = 1.375;
  else if (activityLevel === 'moderate') activityMultiplier = 1.55;
  else if (activityLevel === 'very_active') activityMultiplier = 1.75;

  let tdee = Math.round(bmr * activityMultiplier);

  // Điều chỉnh nhẹ theo mục tiêu cá nhân (tuyệt đối không cắt giảm quá mức đối với học sinh)
  if (personalGoal === 'maintain') {
    // Giữ nguyên mức tiêu thụ năng lượng cân bằng
  } else if (personalGoal === 'healthy_change') {
    // Tùy theo chỉ số BMI, nếu nhẹ cân thì khuyến khích năng lượng dồi dào (+150 kcal), nếu thừa thì tăng vận động
  }

  // Phân bổ nhóm chất khuyến nghị theo Viện Dinh Dưỡng Quốc Gia (AMDR)
  // Carbs: 55% calo (4 kcal/g)
  // Protein: 17% calo (4 kcal/g) - rất quan trọng cho phát triển chiều cao học đường
  // Fat: 28% calo (9 kcal/g)
  const carbGramsTarget = Math.round((tdee * 0.55) / 4);
  const proteinGramsTarget = Math.round((tdee * 0.17) / 4);
  const fatGramsTarget = Math.round((tdee * 0.28) / 9);

  // Giới hạn an toàn theo WHO
  const sugarMaxGrams = 25; // 25g đường tự do / ngày
  const sodiumMaxMg = 2000; // 2000mg natri / ngày (~5g muối)

  const scientificNotes =
    age < 19
      ? `Theo Viện Dinh Dưỡng Quốc Gia, học sinh THCS (${age} tuổi) cần trung bình từ 2.000 – 2.400 kcal/ngày để học tập và phát triển chiều cao. Nhu cầu thực tế có thể thay đổi tùy thuộc vào cường độ học thể dục và thể thao.`
      : `Nhu cầu năng lượng tham khảo ước tính dựa trên công thức Mifflin-St Jeor và hệ số vận động thể chất ${activityMultiplier}.`;

  return {
    bmr,
    tdee,
    activityMultiplier,
    carbGramsTarget,
    proteinGramsTarget,
    fatGramsTarget,
    sugarMaxGrams,
    sodiumMaxMg,
    scientificNotes,
  };
}
