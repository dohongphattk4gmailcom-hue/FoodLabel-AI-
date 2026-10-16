import { FoodLabelData, RuleCheckResult } from '../types';

/**
 * Mã quy tắc (Rule-based engine):
 * Kiểm tra tính toán học, đơn vị đo lường và tính nhất quán dữ liệu mà không phụ thuộc vào suy diễn của AI.
 */
export function executeRuleChecks(
  label: FoodLabelData,
  amountConsumed: number
): RuleCheckResult {
  const servingSize = Math.max(0.1, Number(label.servingSize) || 30);
  const servingsCount = Math.max(0.1, Number(label.servingsPerContainer) || 1);
  const netWeight = Number(label.netWeight) || servingSize * servingsCount;
  const unit = label.servingUnit || 'g';

  // 1. Kiểm tra Khối lượng: Khẩu phần × Số khẩu phần vs Khối lượng tịnh
  const calculatedTotalWeight = Math.round(servingSize * servingsCount * 10) / 10;
  const weightDiff = Math.abs(calculatedTotalWeight - netWeight);
  const isServingMatch = weightDiff <= 2.5; // Cho phép sai số làm tròn nhỏ

  const servingFormula = `${servingSize} ${unit}/khẩu phần × ${servingsCount} khẩu phần = ${calculatedTotalWeight} ${unit}`;
  let servingExplanation = '';
  if (isServingMatch) {
    servingExplanation = `Dữ liệu khớp nhau: Tổng khối lượng tính từ ${servingsCount} khẩu phần (${calculatedTotalWeight} ${unit}) tương thích hoàn toàn với khối lượng tịnh ghi trên bao bì (${netWeight} ${unit}).`;
  } else {
    servingExplanation = `Có chênh lệch cần lưu ý: Tính toán (${servingFormula}) cho ra ${calculatedTotalWeight} ${unit}, trong khi khối lượng tịnh ghi là ${netWeight} ${unit} (lệch ${Math.round(weightDiff * 10) / 10} ${unit}). Có thể do làm tròn số khẩu phần hoặc bao bì bao gồm cả chất lỏng/phụ kiện.`;
  }

  // 2. Kiểm tra Năng lượng từ Macronutrients (Atwater System):
  // 1g Carbs/Đường ≈ 4 kcal, 1g Đạm ≈ 4 kcal, 1g Chất béo ≈ 9 kcal
  const reportedKcal = Number(label.caloriesPerServing) || 0;
  const carbGrams = Number(label.carbsPerServing ?? label.sugarsPerServing ?? 0);
  const proteinGrams = Number(label.proteinPerServing ?? 0);
  const fatGrams = Number(label.totalFatPerServing ?? 0);

  const estimatedFromMacros = Math.round(carbGrams * 4 + proteinGrams * 4 + fatGrams * 9);
  const macroFormula = `(Carb ${carbGrams}g × 4) + (Đạm ${proteinGrams}g × 4) + (Béo ${fatGrams}g × 9) = ${estimatedFromMacros} kcal`;
  
  let macroDiffPercent = 0;
  if (reportedKcal > 0 && estimatedFromMacros > 0) {
    macroDiffPercent = Math.round((Math.abs(estimatedFromMacros - reportedKcal) / reportedKcal) * 100);
  }
  const isMacroConsistent = reportedKcal === 0 || macroDiffPercent <= 25;

  let macroExplanation = '';
  if (reportedKcal === 0) {
    macroExplanation = 'Không có thông tin calo ghi nhận trên nhãn để đối chiếu với các chất đa lượng.';
  } else if (isMacroConsistent) {
    macroExplanation = `Năng lượng khai báo (${reportedKcal} kcal) nằm trong khoảng tính toán lý thuyết từ các chất sinh nhiệt (${estimatedFromMacros} kcal, sai lệch ${macroDiffPercent}%).`;
  } else {
    macroExplanation = `Có độ lệch đáng kể: Tính từ chất bột đường, đạm và béo ra xấp xỉ ${estimatedFromMacros} kcal nhưng nhãn ghi ${reportedKcal} kcal (lệch ${macroDiffPercent}%). Có thể sản phẩm có chất xơ không hấp thu, chất tạo ngọt ít calo (polyol), hoặc sai số in ấn.`;
  }

  // 3. Kiểm tra đơn vị đo (Unit Audit)
  const unitFindings: string[] = [];
  if (label.servingUnit && label.netWeightUnit && label.servingUnit !== label.netWeightUnit) {
    unitFindings.push(`Đơn vị khẩu phần (${label.servingUnit}) khác đơn vị khối lượng tịnh (${label.netWeightUnit}). Cần quy đổi cẩn thận.`);
  } else {
    unitFindings.push(`Đơn vị đo đồng nhất: ${unit}.`);
  }

  if (label.sodiumPerServing !== undefined) {
    if (label.sodiumPerServing > 2500) {
      unitFindings.push(`Cảnh báo đơn vị Natri: Nhãn ghi ${label.sodiumPerServing} mg Natri/khẩu phần (mức rất cao). Kiểm tra xem có bị nhầm giữa mg và g không.`);
    } else {
      unitFindings.push(`Đơn vị Natri được biểu thị đúng chuẩn miligam (mg).`);
    }
  }

  // 4. Phép tính tiêu thụ theo lượng sử dụng (Consumption Math)
  const consumed = Math.max(0, Number(amountConsumed) || servingSize);
  const ratio = Math.round((consumed / servingSize) * 100) / 100;
  const totalKcal = Math.round(reportedKcal * ratio * 10) / 10;

  const weightFormula = `${servingSize} ${unit} × ${ratio} = ${consumed} ${unit}`;
  const calorieFormula = `${reportedKcal} kcal × ${ratio} = ${totalKcal} kcal`;

  const isWholeBox = Math.abs(consumed - netWeight) < 1 || Math.abs(ratio - servingsCount) < 0.1;
  let stepExplanation = '';
  if (isWholeBox) {
    stepExplanation = `Giải thích phép tính (Dùng hết cả hộp ${netWeight} ${unit}):\n` +
      `• Bước 1: 1 khẩu phần chuẩn theo nhãn là ${servingSize} ${unit}, cung cấp ${reportedKcal} kcal.\n` +
      `• Bước 2: Hộp có ${servingsCount} khẩu phần (tương đương ${servingSize} × ${servingsCount} = ${calculatedTotalWeight} ${unit}).\n` +
      `• Bước 3: Nếu dùng hết cả hộp, ta nhân năng lượng của 1 khẩu phần với ${servingsCount}: ${reportedKcal} × ${servingsCount} = ${totalKcal} kcal.`;
  } else {
    stepExplanation = `Giải thích phép tính (Dùng ${consumed} ${unit}):\n` +
      `• Bước 1: Khẩu phần chuẩn trên bao bì là ${servingSize} ${unit} = ${reportedKcal} kcal.\n` +
      `• Bước 2: Tỉ lệ lượng ăn thực tế so với khẩu phần chuẩn: ${consumed} ÷ ${servingSize} = ${ratio} lần khẩu phần.\n` +
      `• Bước 3: Năng lượng nạp vào thực tế: ${reportedKcal} kcal × ${ratio} = ${totalKcal} kcal.`;
  }

  return {
    servingVsNetWeight: {
      isMatch: isServingMatch,
      calculatedTotal: calculatedTotalWeight,
      statedTotal: netWeight,
      unit,
      formula: servingFormula,
      explanation: servingExplanation,
    },
    macroCalorieCheck: {
      reportedKcal,
      estimatedFromMacrosKcal: estimatedFromMacros,
      differencePercent: macroDiffPercent,
      isConsistent: isMacroConsistent,
      formula: macroFormula,
      explanation: macroExplanation,
    },
    unitAudit: {
      isClean: unitFindings.length > 0 && !unitFindings.some(f => f.startsWith('Cảnh báo')),
      findings: unitFindings,
    },
    consumptionMath: {
      servingSize,
      servingsPerContainer: servingsCount,
      amountConsumed: consumed,
      unit,
      ratio,
      totalKcal,
      totalSugarGrams: label.sugarsPerServing !== null && label.sugarsPerServing !== undefined ? Math.round(label.sugarsPerServing * ratio * 10) / 10 : undefined,
      totalSodiumMg: label.sodiumPerServing !== null && label.sodiumPerServing !== undefined ? Math.round(label.sodiumPerServing * ratio) : undefined,
      weightFormula,
      calorieFormula,
      stepExplanation,
    },
  };
}
