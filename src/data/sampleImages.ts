// Realistic SVG label images converted to data URLs for testing and demonstration

export interface SampleLabelImage {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  dataUrl: string;
  mimeType: string;
  knownDataHint?: {
    productName: string;
    servingSize: number;
    servingsPerContainer: number;
    caloriesPerServing: number;
    hasExpiry: boolean;
  };
}

// Helper to encode SVG to data URL
function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

// 1. Label SVG: Bánh quy ngũ cốc giòn (120 kcal / 30g, 2 khẩu phần = 60g)
const svgBiscuit = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 680" width="520" height="680" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffef9"/>
      <stop offset="100%" stop-color="#f5f0e6"/>
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.1"/>
    </filter>
  </defs>

  <!-- Border & Paper Background -->
  <rect x="10" y="10" width="500" height="660" rx="16" fill="url(#bgGrad)" stroke="#d6c7b0" stroke-width="3" filter="url(#cardShadow)"/>
  
  <!-- Header Banner -->
  <rect x="25" y="25" width="470" height="70" rx="10" fill="#1e3a8a"/>
  <text x="260" y="52" fill="#fef08a" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">NHÃN DINH DƯỠNG CHUẨN • NUTRITION FACTS</text>
  <text x="260" y="78" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">BÁNH QUY NGŨ CỐC OAT KRUNCH</text>

  <!-- Product Tagline -->
  <text x="260" y="116" fill="#475569" font-size="13" font-style="italic" text-anchor="middle">Thương hiệu NutriBite • Giòn tan bổ dưỡng</text>
  
  <!-- Top Spec Bar -->
  <rect x="35" y="130" width="450" height="42" rx="8" fill="#e0e7ff" stroke="#c7d2fe"/>
  <text x="50" y="156" fill="#312e81" font-size="13" font-weight="bold">🥣 Khẩu phần (Serving size):</text>
  <text x="235" y="156" fill="#1e1b4b" font-size="14" font-weight="900">30 g</text>
  <text x="290" y="156" fill="#475569" font-size="12">| Hộp gồm: </text>
  <text x="360" y="156" fill="#1e1b4b" font-size="14" font-weight="900">2 khẩu phần</text>
  <text x="445" y="156" fill="#475569" font-size="12">(60 g)</text>

  <!-- Nutrition Table Box -->
  <rect x="35" y="185" width="450" height="235" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
  
  <!-- Nutrition Header -->
  <rect x="37" y="187" width="446" height="38" fill="#0f172a"/>
  <text x="50" y="212" fill="#ffffff" font-size="15" font-weight="900">Giá trị dinh dưỡng trên 1 khẩu phần (30g)</text>
  <text x="465" y="212" fill="#94a3b8" font-size="12" text-anchor="end">% DV*</text>

  <!-- Row 1: Calories -->
  <rect x="37" y="225" width="446" height="36" fill="#fef2f2"/>
  <text x="50" y="249" fill="#991b1b" font-size="16" font-weight="900">Năng lượng / Calories</text>
  <text x="420" y="250" fill="#dc2626" font-size="20" font-weight="900" text-anchor="end">120 kcal</text>

  <!-- Line -->
  <line x1="37" y1="261" x2="483" y2="261" stroke="#cbd5e1" stroke-width="1.5"/>

  <!-- Row 2: Fat -->
  <text x="50" y="282" fill="#1e293b" font-size="13" font-weight="bold">Tổng chất béo (Total Fat)</text>
  <text x="260" y="282" fill="#0f172a" font-size="13" font-weight="bold">4 g</text>
  <text x="465" y="282" fill="#64748b" font-size="12" text-anchor="end">5 %</text>
  <text x="65" y="300" fill="#64748b" font-size="11">- Chất béo bão hòa (Saturated Fat): 1.5 g</text>

  <!-- Line -->
  <line x1="37" y1="309" x2="483" y2="309" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Row 3: Sugar & Carbs -->
  <text x="50" y="328" fill="#1e293b" font-size="13" font-weight="bold">Tổng Carbohydrate</text>
  <text x="260" y="328" fill="#0f172a" font-size="13" font-weight="bold">18 g</text>
  <text x="465" y="328" fill="#64748b" font-size="12" text-anchor="end">6 %</text>
  <text x="65" y="346" fill="#b45309" font-size="12" font-weight="bold">- Đường tổng số (Sugars): 6 g</text>

  <!-- Line -->
  <line x1="37" y1="355" x2="483" y2="355" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Row 4: Protein -->
  <text x="50" y="375" fill="#1e293b" font-size="13" font-weight="bold">Chất đạm (Protein)</text>
  <text x="260" y="375" fill="#0f172a" font-size="13" font-weight="bold">3 g</text>
  <text x="465" y="375" fill="#64748b" font-size="12" text-anchor="end">6 %</text>

  <!-- Line -->
  <line x1="37" y1="388" x2="483" y2="388" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Row 5: Sodium -->
  <text x="50" y="408" fill="#1e293b" font-size="13" font-weight="bold">Natri (Sodium)</text>
  <text x="260" y="408" fill="#0f172a" font-size="13" font-weight="bold">95 mg</text>
  <text x="465" y="408" fill="#64748b" font-size="12" text-anchor="end">4 %</text>

  <!-- Ingredients Section -->
  <rect x="35" y="432" width="450" height="92" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="48" y="452" fill="#0f172a" font-size="12" font-weight="bold">🧾 THÀNH PHẦN (Theo thứ tự giảm dần):</text>
  <text x="48" y="472" fill="#334155" font-size="11">Bột mì nguyên cám, yến mạch (22%), dầu thực vật tinh luyện, đường</text>
  <text x="48" y="490" fill="#334155" font-size="11">kính, mạch nha, sữa bột gầy, muối iot, chất tạo xốp (INS 500(ii)), vani.</text>
  <text x="48" y="512" fill="#b91c1c" font-size="11" font-weight="bold">⚠️ CẢNH BÁO DỊ ỨNG: Có chứa bột mì (gluten) và sữa.</text>

  <!-- Expiration Date Stamp -->
  <rect x="35" y="534" width="450" height="52" rx="8" fill="#fefce8" stroke="#facc15" stroke-width="1.5"/>
  <text x="50" y="555" fill="#854d0e" font-size="11" font-weight="bold">📅 THÔNG TIN HẠN SỬ DỤNG (IN MỰC ĐEN DẬP NỔI):</text>
  <text x="50" y="573" fill="#0f172a" font-size="13" font-weight="900" font-family="monospace">NSX: 12/02/2026   |   HSD: 12/08/2026</text>
  <text x="465" y="573" fill="#15803d" font-size="11" font-weight="bold" text-anchor="end">✓ CÒN HẠN</text>

  <!-- Barcode & Net Weight footer -->
  <rect x="35" y="596" width="450" height="55" rx="6" fill="#f1f5f9"/>
  <text x="50" y="626" fill="#0f172a" font-size="14" font-weight="900">Khối lượng tịnh: 60 g (2 x 30 g)</text>
  <text x="50" y="642" fill="#64748b" font-size="10">Sản xuất tại Việt Nam theo tiêu chuẩn TCVN</text>

  <!-- Barcode visual -->
  <g transform="translate(370, 604)">
    <rect x="0" y="0" width="3" height="34" fill="#0f172a"/>
    <rect x="6" y="0" width="2" height="34" fill="#0f172a"/>
    <rect x="11" y="0" width="4" height="34" fill="#0f172a"/>
    <rect x="18" y="0" width="1" height="34" fill="#0f172a"/>
    <rect x="22" y="0" width="5" height="34" fill="#0f172a"/>
    <rect x="30" y="0" width="2" height="34" fill="#0f172a"/>
    <rect x="35" y="0" width="3" height="34" fill="#0f172a"/>
    <rect x="42" y="0" width="4" height="34" fill="#0f172a"/>
    <rect x="49" y="0" width="2" height="34" fill="#0f172a"/>
    <rect x="54" y="0" width="5" height="34" fill="#0f172a"/>
    <rect x="62" y="0" width="1" height="34" fill="#0f172a"/>
    <rect x="66" y="0" width="3" height="34" fill="#0f172a"/>
    <text x="35" y="44" fill="#64748b" font-size="8" text-anchor="middle" font-family="monospace">8 936012 345678</text>
  </g>
</svg>`;

// 2. Label SVG: Sữa tiệt trùng vị dâu 180ml
const svgMilk = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 680" width="520" height="680" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="milkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff5f5"/>
      <stop offset="100%" stop-color="#ffe4e6"/>
    </linearGradient>
  </defs>

  <rect x="10" y="10" width="500" height="660" rx="16" fill="url(#milkGrad)" stroke="#fda4af" stroke-width="3"/>

  <rect x="25" y="25" width="470" height="70" rx="10" fill="#e11d48"/>
  <text x="260" y="52" fill="#ffffff" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">THÔNG TIN DINH DƯỠNG TRẺ EM</text>
  <text x="260" y="78" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">SỮA TIỆT TRÙNG VỊ DÂU NUTRIMILK</text>

  <text x="260" y="116" fill="#9f1239" font-size="13" font-style="italic" text-anchor="middle">Dung tích: 180 ml • 1 Hộp duy nhất</text>

  <rect x="35" y="130" width="450" height="42" rx="8" fill="#ffffff" stroke="#fecdd3"/>
  <text x="50" y="156" fill="#9f1239" font-size="13" font-weight="bold">Khẩu phần:</text>
  <text x="130" y="156" fill="#0f172a" font-size="14" font-weight="900">180 ml (1 hộp)</text>
  <text x="280" y="156" fill="#64748b" font-size="12">Số phần: </text>
  <text x="340" y="156" fill="#0f172a" font-size="14" font-weight="900">1 khẩu phần</text>

  <!-- Nutrition Table -->
  <rect x="35" y="185" width="450" height="235" rx="8" fill="#ffffff" stroke="#e11d48" stroke-width="2"/>
  <rect x="37" y="187" width="446" height="38" fill="#e11d48"/>
  <text x="50" y="212" fill="#ffffff" font-size="15" font-weight="900">Giá trị dinh dưỡng trong 1 hộp (180 ml)</text>

  <rect x="37" y="225" width="446" height="36" fill="#fff1f2"/>
  <text x="50" y="249" fill="#9f1239" font-size="16" font-weight="900">Năng lượng (Energy)</text>
  <text x="420" y="250" fill="#e11d48" font-size="20" font-weight="900" text-anchor="end">135 kcal</text>

  <line x1="37" y1="261" x2="483" y2="261" stroke="#fecdd3" stroke-width="1.5"/>

  <text x="50" y="282" fill="#1e293b" font-size="13" font-weight="bold">Chất đạm (Protein)</text>
  <text x="260" y="282" fill="#0f172a" font-size="13" font-weight="bold">5.4 g</text>
  <text x="465" y="282" fill="#64748b" font-size="12" text-anchor="end">11 %</text>

  <line x1="37" y1="309" x2="483" y2="309" stroke="#fecdd3" stroke-width="1"/>

  <text x="50" y="328" fill="#1e293b" font-size="13" font-weight="bold">Chất béo (Fat)</text>
  <text x="260" y="328" fill="#0f172a" font-size="13" font-weight="bold">4.5 g</text>
  <text x="465" y="328" fill="#64748b" font-size="12" text-anchor="end">7 %</text>

  <line x1="37" y1="355" x2="483" y2="355" stroke="#fecdd3" stroke-width="1"/>

  <text x="50" y="375" fill="#1e293b" font-size="13" font-weight="bold">Đường (Sugars)</text>
  <text x="260" y="375" fill="#b45309" font-size="14" font-weight="900">16.2 g</text>
  <text x="465" y="375" fill="#b45309" font-size="12" font-weight="bold" text-anchor="end">32 %</text>

  <line x1="37" y1="388" x2="483" y2="388" stroke="#fecdd3" stroke-width="1"/>

  <text x="50" y="408" fill="#1e293b" font-size="13" font-weight="bold">Natri (Sodium)</text>
  <text x="260" y="408" fill="#0f172a" font-size="13" font-weight="bold">80 mg</text>
  <text x="465" y="408" fill="#64748b" font-size="12" text-anchor="end">4 %</text>

  <!-- Ingredients -->
  <rect x="35" y="432" width="450" height="92" rx="8" fill="#ffffff" stroke="#fecdd3"/>
  <text x="48" y="452" fill="#0f172a" font-size="12" font-weight="bold">🧾 THÀNH PHẦN:</text>
  <text x="48" y="472" fill="#334155" font-size="11">Sữa bò tươi (90%), đường tinh luyện, nước cốt dâu (2%), hương dâu</text>
  <text x="48" y="490" fill="#334155" font-size="11">tự nhiên, chất ổn định (471, 407), màu tự nhiên carmine (120).</text>
  <text x="48" y="512" fill="#b91c1c" font-size="11" font-weight="bold">⚠️ CẢNH BÁO DỊ ỨNG: Chứa sữa.</text>

  <!-- Expiry -->
  <rect x="35" y="534" width="450" height="52" rx="8" fill="#ecfdf5" stroke="#6ee7b7" stroke-width="1.5"/>
  <text x="50" y="555" fill="#065f46" font-size="11" font-weight="bold">📅 HẠN SỬ DỤNG (In trên đỉnh hộp):</text>
  <text x="50" y="573" fill="#0f172a" font-size="13" font-weight="900" font-family="monospace">NSX: 15/03/2026   |   HSD: 15/09/2026</text>
  <text x="465" y="573" fill="#059669" font-size="11" font-weight="bold" text-anchor="end">✓ HẠN 6 THÁNG</text>

  <!-- Net weight -->
  <rect x="35" y="596" width="450" height="55" rx="6" fill="#ffffff" stroke="#fecdd3"/>
  <text x="50" y="626" fill="#0f172a" font-size="14" font-weight="900">Thể tích thực: 180 ml</text>
  <text x="50" y="642" fill="#64748b" font-size="10">Uống trực tiếp, lắc đều trước khi uống. Ngon hơn khi uống lạnh.</text>
</svg>`;

// 3. Label SVG: Snack rong biển giòn (CỐ TÌNH KHÔNG CÓ HẠN DÙNG để kiểm tra quy tắc an toàn)
const svgNoExpiry = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 680" width="520" height="680" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="snackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0fdf4"/>
      <stop offset="100%" stop-color="#dcfce7"/>
    </linearGradient>
  </defs>

  <rect x="10" y="10" width="500" height="660" rx="16" fill="url(#snackGrad)" stroke="#86efac" stroke-width="3"/>

  <rect x="25" y="25" width="470" height="70" rx="10" fill="#15803d"/>
  <text x="260" y="52" fill="#fef08a" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">THỰC PHẨM ĂN LIỀN • SNACK GIÒN</text>
  <text x="260" y="78" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle">SNACK RONG BIỂN MÈ SẤY GIÒN</text>

  <text x="260" y="116" fill="#166534" font-size="13" font-style="italic" text-anchor="middle">SeaCrisp Snack • Khối lượng tịnh: 50 g</text>

  <rect x="35" y="130" width="450" height="42" rx="8" fill="#ffffff" stroke="#bbf7d0"/>
  <text x="50" y="156" fill="#166534" font-size="13" font-weight="bold">Khẩu phần:</text>
  <text x="130" y="156" fill="#0f172a" font-size="14" font-weight="900">20 g</text>
  <text x="200" y="156" fill="#64748b" font-size="12">Số phần trong gói: </text>
  <text x="320" y="156" fill="#0f172a" font-size="14" font-weight="900">2.5 phần (50g)</text>

  <!-- Nutrition Table -->
  <rect x="35" y="185" width="450" height="235" rx="8" fill="#ffffff" stroke="#15803d" stroke-width="2"/>
  <rect x="37" y="187" width="446" height="38" fill="#15803d"/>
  <text x="50" y="212" fill="#ffffff" font-size="15" font-weight="900">Thông tin dinh dưỡng trên 1 khẩu phần (20g)</text>

  <rect x="37" y="225" width="446" height="36" fill="#fef2f2"/>
  <text x="50" y="249" fill="#991b1b" font-size="16" font-weight="900">Năng lượng (Energy)</text>
  <text x="420" y="250" fill="#dc2626" font-size="20" font-weight="900" text-anchor="end">90 kcal</text>

  <line x1="37" y1="261" x2="483" y2="261" stroke="#bbf7d0" stroke-width="1.5"/>

  <text x="50" y="282" fill="#1e293b" font-size="13" font-weight="bold">Chất béo (Total Fat)</text>
  <text x="260" y="282" fill="#0f172a" font-size="13" font-weight="bold">5 g</text>
  <text x="465" y="282" fill="#64748b" font-size="12" text-anchor="end">8 %</text>

  <line x1="37" y1="309" x2="483" y2="309" stroke="#bbf7d0" stroke-width="1"/>

  <text x="50" y="328" fill="#1e293b" font-size="13" font-weight="bold">Tổng Carbohydrate</text>
  <text x="260" y="328" fill="#0f172a" font-size="13" font-weight="bold">8 g</text>
  <text x="465" y="328" fill="#64748b" font-size="12" text-anchor="end">3 %</text>

  <line x1="37" y1="355" x2="483" y2="355" stroke="#bbf7d0" stroke-width="1"/>

  <text x="50" y="375" fill="#1e293b" font-size="13" font-weight="bold">Đường (Sugars)</text>
  <text x="260" y="375" fill="#0f172a" font-size="13" font-weight="bold">2 g</text>
  <text x="465" y="375" fill="#64748b" font-size="12" text-anchor="end">4 %</text>

  <line x1="37" y1="388" x2="483" y2="388" stroke="#bbf7d0" stroke-width="1"/>

  <text x="50" y="408" fill="#1e293b" font-size="13" font-weight="bold">Chất đạm (Protein)</text>
  <text x="260" y="408" fill="#0f172a" font-size="13" font-weight="bold">2 g</text>
  <text x="465" y="408" fill="#64748b" font-size="12" text-anchor="end">4 %</text>

  <!-- Ingredients -->
  <rect x="35" y="432" width="450" height="92" rx="8" fill="#ffffff" stroke="#bbf7d0"/>
  <text x="48" y="452" fill="#0f172a" font-size="12" font-weight="bold">🧾 THÀNH PHẦN:</text>
  <text x="48" y="472" fill="#334155" font-size="11">Rong biển Hàn Quốc (65%), hạt mè trắng rang (18%), dầu mè tinh luyện,</text>
  <text x="48" y="490" fill="#334155" font-size="11">đường, muối khoáng biển.</text>
  <text x="48" y="512" fill="#b91c1c" font-size="11" font-weight="bold">⚠️ CẢNH BÁO: Chứa hạt mè.</text>

  <!-- Expiration Area: Missing date! -->
  <rect x="35" y="534" width="450" height="52" rx="8" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>
  <text x="50" y="555" fill="#b91c1c" font-size="11" font-weight="bold">📅 THÔNG TIN HẠN SỬ DỤNG (KIỂM TRA BỀ MẶT):</text>
  <text x="50" y="573" fill="#dc2626" font-size="12" font-weight="bold">[Vị trí in date bị bỏ trống / không có thông tin NSX và HSD trên nhãn]</text>
  <text x="465" y="573" fill="#b91c1c" font-size="11" font-weight="bold" text-anchor="end">❌ THIẾU DATE</text>

  <!-- Footer -->
  <rect x="35" y="596" width="450" height="55" rx="6" fill="#ffffff" stroke="#bbf7d0"/>
  <text x="50" y="626" fill="#0f172a" font-size="14" font-weight="900">Khối lượng tịnh: 50 g</text>
  <text x="50" y="642" fill="#64748b" font-size="10">Bảo quản ở nhiệt độ phòng, tránh ẩm ướt.</text>
</svg>`;

export const SAMPLE_LABEL_IMAGES: SampleLabelImage[] = [
  {
    id: 'sample-img-biscuit',
    name: 'Bánh quy ngũ cốc Oat Krunch',
    subtitle: '120 kcal / 30g • 2 khẩu phần • Có hạn dùng rõ ràng',
    badge: 'Mẫu chuẩn SGK',
    dataUrl: svgToDataUrl(svgBiscuit),
    mimeType: 'image/svg+xml',
    knownDataHint: {
      productName: 'Bánh quy ngũ cốc Oat Krunch',
      servingSize: 30,
      servingsPerContainer: 2,
      caloriesPerServing: 120,
      hasExpiry: true,
    },
  },
  {
    id: 'sample-img-milk',
    name: 'Hộp sữa tiệt trùng vị dâu 180ml',
    subtitle: '135 kcal / 180ml • 1 khẩu phần • Lượng đường 16g',
    badge: 'Đồ uống 1 phần',
    dataUrl: svgToDataUrl(svgMilk),
    mimeType: 'image/svg+xml',
    knownDataHint: {
      productName: 'Sữa tiệt trùng vị dâu NutriMilk',
      servingSize: 180,
      servingsPerContainer: 1,
      caloriesPerServing: 135,
      hasExpiry: true,
    },
  },
  {
    id: 'sample-img-no-expiry',
    name: 'Snack rong biển mè (Không ghi date)',
    subtitle: '90 kcal / 20g • 2.5 phần • Thử thách kiểm tra hạn dùng',
    badge: 'Thử nghiệm an toàn',
    dataUrl: svgToDataUrl(svgNoExpiry),
    mimeType: 'image/svg+xml',
    knownDataHint: {
      productName: 'Snack rong biển mè sấy giòn',
      servingSize: 20,
      servingsPerContainer: 2.5,
      caloriesPerServing: 90,
      hasExpiry: false,
    },
  },
];
