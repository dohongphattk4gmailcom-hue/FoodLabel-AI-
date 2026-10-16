import { TestingLabelItem } from '../types';

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

// 1-8: Clear Labels
const svgClear1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#ffffff" stroke="#10b981" stroke-width="4" rx="12"/>
  <rect x="15" y="15" width="420" height="55" fill="#047857" rx="8"/>
  <text x="225" y="48" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">BÁNH QUY BƠ NUTRIBITE (RÕ NÉT)</text>
  <rect x="25" y="85" width="400" height="35" fill="#ecfdf5" rx="6"/>
  <text x="35" y="108" fill="#065f46" font-size="13" font-weight="bold">🥣 Khẩu phần: 30g | Hộp: 2 khẩu phần (60g)</text>
  <rect x="25" y="130" width="400" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="40" y="160" fill="#0f172a" font-size="14" font-weight="bold">Năng lượng: 120 kcal / khẩu phần</text>
  <text x="40" y="195" fill="#334155" font-size="13">Đường (Sugars): 6 g</text>
  <text x="40" y="230" fill="#334155" font-size="13">Chất béo (Total Fat): 4 g</text>
  <text x="40" y="265" fill="#334155" font-size="13">Chất đạm (Protein): 3 g</text>
  <text x="40" y="300" fill="#334155" font-size="13">Natri (Sodium): 95 mg</text>
  <rect x="25" y="335" width="400" height="110" fill="#f1f5f9" rx="8"/>
  <text x="35" y="360" fill="#0f172a" font-size="12" font-weight="bold">Thành phần:</text>
  <text x="35" y="385" fill="#475569" font-size="11">Bột mì (55%), bơ tươi (20%), đường tinh luyện, trứng gà,</text>
  <text x="35" y="405" fill="#475569" font-size="11">sữa bột nguyên kem, muối ăn, hương vani tự nhiên.</text>
  <text x="35" y="430" fill="#dc2626" font-size="11" font-weight="bold">Dị ứng: Chứa lúa mì, trứng, sữa.</text>
  <rect x="25" y="460" width="400" height="40" fill="#fef9c3" stroke="#facc15" rx="6"/>
  <text x="35" y="485" fill="#854d0e" font-size="12" font-weight="bold">📅 NSX: 10/01/2026 - HSD: 10/07/2026 (In trên mép hộp)</text>
  <text x="225" y="530" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">✓ Ảnh đạt chuẩn chất lượng cao (Kiểm thử 1)</text>
</svg>`;

const svgClear2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#ffffff" stroke="#0284c7" stroke-width="4" rx="12"/>
  <rect x="15" y="15" width="420" height="55" fill="#0369a1" rx="8"/>
  <text x="225" y="48" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">SỮA TIỆT TRÙNG VỊ DÂU 180ML</text>
  <rect x="25" y="85" width="400" height="35" fill="#e0f2fe" rx="6"/>
  <text x="35" y="108" fill="#0369a1" font-size="13" font-weight="bold">🥣 Khẩu phần: 180ml | Hộp: 1 khẩu phần (180ml)</text>
  <rect x="25" y="130" width="400" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="40" y="160" fill="#0f172a" font-size="14" font-weight="bold">Năng lượng: 135 kcal / khẩu phần</text>
  <text x="40" y="195" fill="#334155" font-size="13">Đường: 16.2 g (Lượng đường cao)</text>
  <text x="40" y="230" fill="#334155" font-size="13">Chất béo: 4.5 g</text>
  <text x="40" y="265" fill="#334155" font-size="13">Chất đạm: 5.4 g</text>
  <text x="40" y="300" fill="#334155" font-size="13">Natri: 80 mg</text>
  <rect x="25" y="335" width="400" height="110" fill="#f1f5f9" rx="8"/>
  <text x="35" y="360" fill="#0f172a" font-size="12" font-weight="bold">Thành phần:</text>
  <text x="35" y="385" fill="#475569" font-size="11">Sữa bò tươi (90%), đường tinh luyện (7%), nước cốt dâu (2%),</text>
  <text x="35" y="405" fill="#475569" font-size="11">hương dâu tự nhiên, chất ổn định (471, 407).</text>
  <text x="35" y="430" fill="#dc2626" font-size="11" font-weight="bold">Cảnh báo: Có chứa sữa bò.</text>
  <rect x="25" y="460" width="400" height="40" fill="#fef9c3" stroke="#facc15" rx="6"/>
  <text x="35" y="485" fill="#854d0e" font-size="12" font-weight="bold">📅 NSX: 15/03/2026 - HSD: 15/09/2026 (In trên đỉnh nắp)</text>
  <text x="225" y="530" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">✓ Ảnh rõ ràng 1 khẩu phần (Kiểm thử 2)</text>
</svg>`;

const svgClear3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#ffffff" stroke="#16a34a" stroke-width="4" rx="12"/>
  <rect x="15" y="15" width="420" height="55" fill="#15803d" rx="8"/>
  <text x="225" y="48" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">NƯỚC CHANH ZERO CALORIE 330ML</text>
  <rect x="25" y="85" width="400" height="35" fill="#dcfce7" rx="6"/>
  <text x="35" y="108" fill="#15803d" font-size="13" font-weight="bold">🥣 Khẩu phần: 330ml | Lon: 1 khẩu phần (330ml)</text>
  <rect x="25" y="130" width="400" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="40" y="160" fill="#0f172a" font-size="14" font-weight="bold">Năng lượng: 0 kcal / khẩu phần</text>
  <text x="40" y="195" fill="#334155" font-size="13">Đường: 0 g</text>
  <text x="40" y="230" fill="#334155" font-size="13">Chất béo: 0 g</text>
  <text x="40" y="265" fill="#334155" font-size="13">Chất đạm: 0 g</text>
  <text x="40" y="300" fill="#334155" font-size="13">Natri: 40 mg</text>
  <rect x="25" y="335" width="400" height="110" fill="#f1f5f9" rx="8"/>
  <text x="35" y="360" fill="#0f172a" font-size="12" font-weight="bold">Thành phần:</text>
  <text x="35" y="385" fill="#475569" font-size="11">Nước bão hòa CO2, chất điều chỉnh độ acid (INS 330),</text>
  <text x="35" y="405" fill="#475569" font-size="11">chất tạo ngọt nhân tạo (Sucralose, Acesulfame K), hương chanh tự nhiên.</text>
  <text x="35" y="430" fill="#64748b" font-size="11">Không chứa đường tự nhiên.</text>
  <rect x="25" y="460" width="400" height="40" fill="#fef9c3" stroke="#facc15" rx="6"/>
  <text x="35" y="485" fill="#854d0e" font-size="12" font-weight="bold">📅 HSD: 12 tháng kể từ NSX (Xem đáy lon)</text>
  <text x="225" y="530" fill="#16a34a" font-size="12" font-weight="bold" text-anchor="middle">✓ Đọc đúng 0 kcal & chất tạo ngọt (Kiểm thử 3)</text>
</svg>`;

const svgClear4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#ffffff" stroke="#ea580c" stroke-width="4" rx="12"/>
  <rect x="15" y="15" width="420" height="55" fill="#c2410c" rx="8"/>
  <text x="225" y="48" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">MÌ ĂN LIỀN TÔM CHUA CAY 75G</text>
  <rect x="25" y="85" width="400" height="35" fill="#ffedd5" rx="6"/>
  <text x="35" y="108" fill="#c2410c" font-size="13" font-weight="bold">🥣 Khẩu phần: 75g | Gói: 1 khẩu phần (75g)</text>
  <rect x="25" y="130" width="400" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="40" y="160" fill="#0f172a" font-size="14" font-weight="bold">Năng lượng: 345 kcal / khẩu phần</text>
  <text x="40" y="195" fill="#334155" font-size="13">Đường: 4 g</text>
  <text x="40" y="230" fill="#334155" font-size="13">Chất béo: 14 g</text>
  <text x="40" y="265" fill="#334155" font-size="13">Chất đạm: 6.8 g</text>
  <text x="40" y="300" fill="#dc2626" font-size="13" font-weight="bold">Natri: 1480 mg (Lượng muối rất cao!)</text>
  <rect x="25" y="335" width="400" height="110" fill="#f1f5f9" rx="8"/>
  <text x="35" y="360" fill="#0f172a" font-size="12" font-weight="bold">Thành phần:</text>
  <text x="35" y="385" fill="#475569" font-size="11">Vắt mì: Bột mì, shortening, tinh bột sắn, muối iot.</text>
  <text x="35" y="405" fill="#475569" font-size="11">Gói súp: Dầu cọ, muối, đường, tôm sấy (2%), bột ớt, chất điều vị (621).</text>
  <text x="35" y="430" fill="#dc2626" font-size="11" font-weight="bold">Dị ứng: Có chứa tôm, bột mì, đậu nành.</text>
  <rect x="25" y="460" width="400" height="40" fill="#fef9c3" stroke="#facc15" rx="6"/>
  <text x="35" y="485" fill="#854d0e" font-size="12" font-weight="bold">📅 NSX: 01/02/2026 - HSD: 01/07/2026</text>
  <text x="225" y="530" fill="#ea580c" font-size="12" font-weight="bold" text-anchor="middle">✓ Bóc tách đúng Natri 1480mg (Kiểm thử 4)</text>
</svg>`;

const svgClear5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#ffffff" stroke="#9333ea" stroke-width="4" rx="12"/>
  <rect x="15" y="15" width="420" height="55" fill="#7e22ce" rx="8"/>
  <text x="225" y="48" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">SỮA CHUA LÊN MEN NHA ĐAM 100G</text>
  <rect x="25" y="85" width="400" height="35" fill="#f3e8ff" rx="6"/>
  <text x="35" y="108" fill="#7e22ce" font-size="13" font-weight="bold">🥣 Khẩu phần: 100g | Hũ: 1 khẩu phần (100g)</text>
  <rect x="25" y="130" width="400" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="40" y="160" fill="#0f172a" font-size="14" font-weight="bold">Năng lượng: 102 kcal / khẩu phần</text>
  <text x="40" y="195" fill="#334155" font-size="13">Đường: 14 g</text>
  <text x="40" y="230" fill="#334155" font-size="13">Chất béo: 2.8 g</text>
  <text x="40" y="265" fill="#334155" font-size="13">Chất đạm: 3.1 g</text>
  <text x="40" y="300" fill="#334155" font-size="13">Natri: 45 mg</text>
  <rect x="25" y="335" width="400" height="110" fill="#f1f5f9" rx="8"/>
  <text x="35" y="360" fill="#0f172a" font-size="12" font-weight="bold">Thành phần:</text>
  <text x="35" y="385" fill="#475569" font-size="11">Sữa chua lên men tự nhiên (85%), nha đam giòn (10%), đường kính,</text>
  <text x="35" y="405" fill="#475569" font-size="11">men vi sinh sống Lactobacillus bulgaricus.</text>
  <text x="35" y="430" fill="#dc2626" font-size="11" font-weight="bold">Dị ứng: Chế phẩm từ sữa bò.</text>
  <rect x="25" y="460" width="400" height="40" fill="#fef9c3" stroke="#facc15" rx="6"/>
  <text x="35" y="485" fill="#854d0e" font-size="12" font-weight="bold">📅 NSX: 18/03/2026 - HSD: 18/04/2026 (Bảo quản 4-8°C)</text>
  <text x="225" y="530" fill="#9333ea" font-size="12" font-weight="bold" text-anchor="middle">✓ Rõ ràng hạn dùng lạnh 30 ngày (Kiểm thử 5)</text>
</svg>`;

const svgClear6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#ffffff" stroke="#d97706" stroke-width="4" rx="12"/>
  <rect x="15" y="15" width="420" height="55" fill="#b45309" rx="8"/>
  <text x="225" y="48" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">BỘT YẾN MẠCH TRÁI CÂY 40G</text>
  <rect x="25" y="85" width="400" height="35" fill="#fef3c7" rx="6"/>
  <text x="35" y="108" fill="#b45309" font-size="13" font-weight="bold">🥣 Khẩu phần: 40g | Gói: 1 khẩu phần (40g)</text>
  <rect x="25" y="130" width="400" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="40" y="160" fill="#0f172a" font-size="14" font-weight="bold">Năng lượng: 155 kcal / khẩu phần</text>
  <text x="40" y="195" fill="#334155" font-size="13">Đường: 5 g</text>
  <text x="40" y="230" fill="#334155" font-size="13">Chất béo: 2.5 g</text>
  <text x="40" y="265" fill="#334155" font-size="13">Chất đạm: 5.0 g</text>
  <text x="40" y="300" fill="#334155" font-size="13">Natri: 25 mg</text>
  <rect x="25" y="335" width="400" height="110" fill="#f1f5f9" rx="8"/>
  <text x="35" y="360" fill="#0f172a" font-size="12" font-weight="bold">Thành phần:</text>
  <text x="35" y="385" fill="#475569" font-size="11">Yến mạch Úc cán dẹt (75%), táo đỏ khô (10%), chuối sấy,</text>
  <text x="35" y="405" fill="#475569" font-size="11">hạt chia (5%), bột quế tự nhiên.</text>
  <text x="35" y="430" fill="#64748b" font-size="11">Giàu chất xơ hòa tan beta-glucan.</text>
  <rect x="25" y="460" width="400" height="40" fill="#fef9c3" stroke="#facc15" rx="6"/>
  <text x="35" y="485" fill="#854d0e" font-size="12" font-weight="bold">📅 NSX: 01/01/2026 - HSD: 01/01/2027</text>
  <text x="225" y="530" fill="#d97706" font-size="12" font-weight="bold" text-anchor="middle">✓ Bóc tách thành phần tỷ lệ chuẩn (Kiểm thử 6)</text>
</svg>`;

const svgClear7 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#ffffff" stroke="#4f46e5" stroke-width="4" rx="12"/>
  <rect x="15" y="15" width="420" height="55" fill="#3730a3" rx="8"/>
  <text x="225" y="48" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">SOCOLA ĐEN HẠT PHỈ 50G</text>
  <rect x="25" y="85" width="400" height="35" fill="#e0e7ff" rx="6"/>
  <text x="35" y="108" fill="#3730a3" font-size="13" font-weight="bold">🥣 Khẩu phần: 25g | Thanh: 2 khẩu phần (50g)</text>
  <rect x="25" y="130" width="400" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="40" y="160" fill="#0f172a" font-size="14" font-weight="bold">Năng lượng: 140 kcal / khẩu phần (25g)</text>
  <text x="40" y="195" fill="#334155" font-size="13">Đường: 8 g</text>
  <text x="40" y="230" fill="#334155" font-size="13">Chất béo: 9.5 g</text>
  <text x="40" y="265" fill="#334155" font-size="13">Chất đạm: 2.2 g</text>
  <text x="40" y="300" fill="#334155" font-size="13">Natri: 15 mg</text>
  <rect x="25" y="335" width="400" height="110" fill="#f1f5f9" rx="8"/>
  <text x="35" y="360" fill="#0f172a" font-size="12" font-weight="bold">Thành phần:</text>
  <text x="35" y="385" fill="#475569" font-size="11">Khối cacao (60%), bơ cacao, hạt phỉ rang (18%), đường mía,</text>
  <text x="35" y="405" fill="#475569" font-size="11">chất nhũ hóa (lecithin đậu nành INS 322).</text>
  <text x="35" y="430" fill="#dc2626" font-size="11" font-weight="bold">Dị ứng: Chứa hạt phỉ, đậu nành.</text>
  <rect x="25" y="460" width="400" height="40" fill="#fef9c3" stroke="#facc15" rx="6"/>
  <text x="35" y="485" fill="#854d0e" font-size="12" font-weight="bold">📅 NSX: 12/02/2026 - HSD: 12/02/2027</text>
  <text x="225" y="530" fill="#4f46e5" font-size="12" font-weight="bold" text-anchor="middle">✓ Bóc tách đúng 2 khẩu phần x 140 = 280 kcal (Kiểm thử 7)</text>
</svg>`;

const svgClear8 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#ffffff" stroke="#059669" stroke-width="4" rx="12"/>
  <rect x="15" y="15" width="420" height="55" fill="#047857" rx="8"/>
  <text x="225" y="48" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle">NƯỚC ÉP CAM NGUYÊN CHẤT 250ML</text>
  <rect x="25" y="85" width="400" height="35" fill="#d1fae5" rx="6"/>
  <text x="35" y="108" fill="#065f46" font-size="13" font-weight="bold">🥣 Khẩu phần: 250ml | Chai: 1 khẩu phần (250ml)</text>
  <rect x="25" y="130" width="400" height="190" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="40" y="160" fill="#0f172a" font-size="14" font-weight="bold">Năng lượng: 110 kcal / khẩu phần</text>
  <text x="40" y="195" fill="#334155" font-size="13">Đường: 22 g (Đường tự nhiên từ quả cam)</text>
  <text x="40" y="230" fill="#334155" font-size="13">Chất béo: 0.2 g</text>
  <text x="40" y="265" fill="#334155" font-size="13">Chất đạm: 1.5 g</text>
  <text x="40" y="300" fill="#334155" font-size="13">Natri: 10 mg</text>
  <rect x="25" y="335" width="400" height="110" fill="#f1f5f9" rx="8"/>
  <text x="35" y="360" fill="#0f172a" font-size="12" font-weight="bold">Thành phần:</text>
  <text x="35" y="385" fill="#475569" font-size="11">Nước ép cam nguyên chất 100%, tép cam tươi, vitamin C.</text>
  <text x="35" y="405" fill="#475569" font-size="11">Không thêm đường tinh luyện, không chất bảo quản.</text>
  <text x="35" y="430" fill="#64748b" font-size="11">Lắc đều trước khi uống.</text>
  <rect x="25" y="460" width="400" height="40" fill="#fef9c3" stroke="#facc15" rx="6"/>
  <text x="35" y="485" fill="#854d0e" font-size="12" font-weight="bold">📅 NSX: 05/03/2026 - HSD: 05/05/2026</text>
  <text x="225" y="530" fill="#059669" font-size="12" font-weight="bold" text-anchor="middle">✓ Bóc tách đúng đường tự nhiên 22g (Kiểm thử 8)</text>
</svg>`;

// 9-12: Blurry Labels (Chất lượng mờ / nhòe số)
const svgBlurry1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <defs>
    <filter id="blurFilter" x="0" y="0">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#fef2f2" stroke="#ef4444" stroke-width="4" rx="12"/>
  <g filter="url(#blurFilter)">
    <rect x="20" y="20" width="410" height="50" fill="#b91c1c" rx="6"/>
    <text x="225" y="52" fill="#ffffff" font-size="18" text-anchor="middle">SNACK KHOAI TÂY CAY (ẢNH MỜ RUNG TAY)</text>
    <text x="40" y="110" fill="#1e293b" font-size="14">Khẩu phần: ???g | Năng lượng: ??? kcal</text>
    <text x="40" y="160" fill="#334155" font-size="13">Đường: ?? g | Natri: ???? mg</text>
    <text x="40" y="210" fill="#475569" font-size="12">Thành phần: Khoai tây, dầu cọ, gia vị bột ớt...</text>
    <text x="40" y="260" fill="#991b1b" font-size="12">HSD: ??/??/2026 (Chữ số bị nhòe vệt)</text>
  </g>
  <rect x="25" y="320" width="400" height="150" fill="#ffffff" stroke="#ef4444" stroke-width="2" rx="8"/>
  <text x="225" y="360" fill="#b91c1c" font-size="16" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: ẢNH BỊ MỜ DO RUNG TAY</text>
  <text x="225" y="390" fill="#7f1d1d" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="420" fill="#475569" font-size="11" text-anchor="middle">Nguyên tắc: AI không được đoán mò số liệu khi ảnh mờ nét.</text>
  <text x="225" y="445" fill="#475569" font-size="11" text-anchor="middle">Học sinh cần kiểm tra nhãn gốc trên tay.</text>
  <text x="225" y="520" fill="#dc2626" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 9 (Ảnh mờ)</text>
</svg>`;

const svgBlurry2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <defs>
    <filter id="blurMotion" x="0" y="0">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6.0" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#fff7ed" stroke="#f97316" stroke-width="4" rx="12"/>
  <g filter="url(#blurMotion)">
    <rect x="20" y="20" width="410" height="50" fill="#c2410c" rx="6"/>
    <text x="225" y="52" fill="#ffffff" font-size="18" text-anchor="middle">TRÀ SỮA ĐÓNG CHAI (MỜ CHỮ CALO)</text>
    <text x="40" y="110" fill="#1e293b" font-size="14">Serving: 200ml | Calories: ???</text>
    <text x="40" y="160" fill="#334155" font-size="13">Sugars: ??? g</text>
    <text x="40" y="210" fill="#475569" font-size="12">Ingredients: Trà đen, bột kem không sữa...</text>
  </g>
  <rect x="25" y="320" width="400" height="150" fill="#ffffff" stroke="#ea580c" stroke-width="2" rx="8"/>
  <text x="225" y="360" fill="#c2410c" font-size="15" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: ẢNH MỜ THIẾU NÉT</text>
  <text x="225" y="390" fill="#9a3412" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="420" fill="#475569" font-size="11" text-anchor="middle">Mục đích: Đảm bảo AI từ chối suy diễn khi số liệu đường/calo bị nhòe.</text>
  <text x="225" y="520" fill="#ea580c" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 10 (Ảnh mờ)</text>
</svg>`;

const svgBlurry3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <defs>
    <filter id="blurOutFocus" x="0" y="0">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5.0" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#fef2f2" stroke="#dc2626" stroke-width="4" rx="12"/>
  <g filter="url(#blurOutFocus)">
    <rect x="20" y="20" width="410" height="50" fill="#991b1b" rx="6"/>
    <text x="225" y="52" fill="#ffffff" font-size="18" text-anchor="middle">BÁNH MÌ GỐI LÚA MẠCH (MỜ DATE)</text>
    <text x="40" y="110" fill="#1e293b" font-size="14">Khẩu phần: 2 lát (50g) | Calo: ???</text>
    <text x="40" y="160" fill="#334155" font-size="13">HSD: [BỊ MỜ VẾT MỰC KHÔNG THẤY DATE]</text>
  </g>
  <rect x="25" y="320" width="400" height="150" fill="#ffffff" stroke="#dc2626" stroke-width="2" rx="8"/>
  <text x="225" y="360" fill="#991b1b" font-size="15" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: MỰC IN HSD BỊ MỜ</text>
  <text x="225" y="390" fill="#7f1d1d" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="420" fill="#475569" font-size="11" text-anchor="middle">Không đoán mò ngày hết hạn để bảo vệ an toàn vệ sinh thực phẩm.</text>
  <text x="225" y="520" fill="#dc2626" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 11 (Ảnh mờ)</text>
</svg>`;

const svgBlurry4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <defs>
    <filter id="blurExtreme" x="0" y="0">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#faf5ff" stroke="#a855f7" stroke-width="4" rx="12"/>
  <g filter="url(#blurExtreme)">
    <rect x="20" y="20" width="410" height="50" fill="#7e22ce" rx="6"/>
    <text x="225" y="52" fill="#ffffff" font-size="18" text-anchor="middle">SỮA HẠT DINH DƯỠNG (NHOÈ HÌNH)</text>
    <text x="40" y="110" fill="#1e293b" font-size="14">Khẩu phần: ??? | Calo: ???</text>
  </g>
  <rect x="25" y="320" width="400" height="150" fill="#ffffff" stroke="#9333ea" stroke-width="2" rx="8"/>
  <text x="225" y="360" fill="#7e22ce" font-size="15" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: ẢNH MỜ TOÀN PHẦN</text>
  <text x="225" y="390" fill="#581c87" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="420" fill="#475569" font-size="11" text-anchor="middle">Yêu cầu chụp lại nơi có đủ ánh sáng và lấy nét camera.</text>
  <text x="225" y="520" fill="#9333ea" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 12 (Ảnh mờ)</text>
</svg>`;

// 13-16: Tilted Labels (Chụp góc nghiêng / méo chữ)
const svgTilted1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#fefce8" stroke="#ca8a04" stroke-width="4" rx="12"/>
  <g transform="rotate(22 225 280) skewX(-15)">
    <rect x="40" y="80" width="370" height="200" fill="#0f172a" rx="8"/>
    <text x="225" y="120" fill="#facc15" font-size="15" font-weight="bold" text-anchor="middle">HỘP BÁNH QUẾ (CHỤP NGHIÊNG 45 ĐỘ)</text>
    <text x="60" y="160" fill="#ffffff" font-size="12">Khẩu phần: 25g | Calo: 110 kcal</text>
    <text x="60" y="190" fill="#ffffff" font-size="12">Đường: 8g | Natri: 45mg</text>
    <text x="60" y="220" fill="#94a3b8" font-size="10">Thành phần bị méo lệch góc chụp...</text>
  </g>
  <rect x="25" y="360" width="400" height="130" fill="#ffffff" stroke="#eab308" stroke-width="2" rx="8"/>
  <text x="225" y="395" fill="#a16207" font-size="15" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: ẢNH CHỤP GÓC NGHIÊNG</text>
  <text x="225" y="425" fill="#854d0e" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="455" fill="#475569" font-size="11" text-anchor="middle">Góc nghiêng gây sai lệch tỷ lệ OCR và nguy cơ đọc nhầm số liệu.</text>
  <text x="225" y="525" fill="#ca8a04" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 13 (Chụp nghiêng)</text>
</svg>`;

const svgTilted2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#fefce8" stroke="#eab308" stroke-width="4" rx="12"/>
  <g transform="rotate(-25 225 260) skewY(12)">
    <rect x="40" y="70" width="370" height="210" fill="#1e3a8a" rx="8"/>
    <text x="225" y="110" fill="#93c5fd" font-size="15" font-weight="bold" text-anchor="middle">LON NƯỚC NGỌT (CHỤP VÁT CONG THÂN LON)</text>
    <text x="60" y="150" fill="#ffffff" font-size="12">Dung tích: 330ml | Năng lượng: ???</text>
    <text x="60" y="180" fill="#ffffff" font-size="12">Chữ số bị uốn cong theo bề mặt lon</text>
  </g>
  <rect x="25" y="360" width="400" height="130" fill="#ffffff" stroke="#eab308" stroke-width="2" rx="8"/>
  <text x="225" y="395" fill="#a16207" font-size="15" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: BỀ MẶT CONG &amp; NGHIÊNG</text>
  <text x="225" y="425" fill="#854d0e" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="455" fill="#475569" font-size="11" text-anchor="middle">Hướng dẫn: Đặt lon thẳng đứng và chụp đối diện bảng nhãn.</text>
  <text x="225" y="525" fill="#ca8a04" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 14 (Chụp nghiêng)</text>
</svg>`;

const svgTilted3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#fefce8" stroke="#ca8a04" stroke-width="4" rx="12"/>
  <g transform="rotate(28 225 250) scale(0.9 0.7)">
    <rect x="30" y="60" width="390" height="230" fill="#78350f" rx="8"/>
    <text x="225" y="100" fill="#fde68a" font-size="16" font-weight="bold" text-anchor="middle">GÓI PHÔ MAI QUE (CHỤP VÁT CẠNH MÉO)</text>
    <text x="60" y="140" fill="#ffffff" font-size="12">Khẩu phần: 28g | Calo: ???</text>
    <text x="60" y="180" fill="#ffffff" font-size="12">Bao bì bị nhăn nếp gấp mép</text>
  </g>
  <rect x="25" y="360" width="400" height="130" fill="#ffffff" stroke="#eab308" stroke-width="2" rx="8"/>
  <text x="225" y="395" fill="#a16207" font-size="15" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: BAO BÌ NHĂN &amp; NGHIÊNG</text>
  <text x="225" y="425" fill="#854d0e" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="455" fill="#475569" font-size="11" text-anchor="middle">Cần vuốt phẳng bao bì trước khi chụp camera.</text>
  <text x="225" y="525" fill="#ca8a04" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 15 (Chụp nghiêng)</text>
</svg>`;

const svgTilted4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#fefce8" stroke="#ca8a04" stroke-width="4" rx="12"/>
  <g transform="rotate(-30 225 240) skewX(20)">
    <rect x="30" y="50" width="390" height="220" fill="#14532d" rx="8"/>
    <text x="225" y="90" fill="#86efac" font-size="16" font-weight="bold" text-anchor="middle">RONG BIỂN TẨM GIA VỊ (GẬP MÉP 45°)</text>
    <text x="60" y="130" fill="#ffffff" font-size="12">Khẩu phần: ??? | Calo: ???</text>
  </g>
  <rect x="25" y="360" width="400" height="130" fill="#ffffff" stroke="#eab308" stroke-width="2" rx="8"/>
  <text x="225" y="395" fill="#a16207" font-size="15" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: GÓC NGHIÊNG GẬP MÉP</text>
  <text x="225" y="425" fill="#854d0e" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="455" fill="#475569" font-size="11" text-anchor="middle">AI từ chối nhận diện để học sinh chụp lại ảnh phẳng.</text>
  <text x="225" y="525" fill="#ca8a04" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 16 (Chụp nghiêng)</text>
</svg>`;

// 17-20: Tiny Text / Low Contrast Labels (Chữ siêu nhỏ li ti)
const svgTiny1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#f8fafc" stroke="#64748b" stroke-width="4" rx="12"/>
  <rect x="20" y="20" width="410" height="50" fill="#334155" rx="6"/>
  <text x="225" y="52" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">KẸO CAO SU BẠC HÀ (CHỮ SIÊU NHỎ 4PT)</text>
  <rect x="25" y="80" width="400" height="180" fill="#f1f5f9" stroke="#94a3b8" rx="6"/>
  <!-- Extremely small dense text -->
  <text x="35" y="105" fill="#475569" font-size="6">Khau phan: 1 vien (2.5g) | Nang luong: 5 kcal | Duong: 0g | Chat beo: 0g | Chat dam: 0g | Natri: 0mg</text>
  <text x="35" y="125" fill="#64748b" font-size="5">Thanh phan: Xylitol, sorbitol, gum base, huong bac ha tu nhien, aspartame, acesulfame k, bht, mau thuc pham ins 133</text>
  <text x="35" y="145" fill="#64748b" font-size="5">Chung nhan an toan va tieu chuan dong goi quy cach bo y te viet nam so 2819/2024</text>
  <text x="35" y="165" fill="#64748b" font-size="4.5">Canh bao: Chua Phenylalanine. Khong dung cho benh nhan phenylketonuria. HSD xem duoi day vi vo hop giay.</text>
  <rect x="25" y="300" width="400" height="160" fill="#ffffff" stroke="#64748b" stroke-width="2" rx="8"/>
  <text x="225" y="340" fill="#1e293b" font-size="15" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: CHỮ IN SIÊU NHỎ LI TI</text>
  <text x="225" y="375" fill="#334155" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="410" fill="#475569" font-size="11" text-anchor="middle">Cỡ chữ dưới 6pt dễ làm OCR đọc nhầm '0g' thành '8g' hoặc '6g'.</text>
  <text x="225" y="435" fill="#475569" font-size="11" text-anchor="middle">Khuyên học sinh: Dùng chế độ chụp cận cảnh Macro hoặc phóng to.</text>
  <text x="225" y="520" fill="#475569" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 17 (Chữ siêu nhỏ)</text>
</svg>`;

const svgTiny2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#f8fafc" stroke="#64748b" stroke-width="4" rx="12"/>
  <rect x="20" y="20" width="410" height="50" fill="#334155" rx="6"/>
  <text x="225" y="52" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">GÓI VIÊN SÚP GIA VỊ (CHỮ QUÁ NHỎ &amp; DÀY)</text>
  <rect x="25" y="80" width="400" height="180" fill="#f1f5f9" stroke="#94a3b8" rx="6"/>
  <text x="35" y="105" fill="#475569" font-size="5.5">1 vien 10g cho 500ml nuoc | Nang luong 22 kcal | Muoi an Natri 1850mg (92.5% DV)</text>
  <text x="35" y="125" fill="#64748b" font-size="4.8">Thanh phan: Muoi, duong, mo bo tinh luyen, chiet xuat nam men, bot hanh, bot toi, ins 621, 627, 631, caramel</text>
  <text x="35" y="145" fill="#64748b" font-size="4.5">Bao quan noi kho rao. NSX: In tren vien hop nho ben trong vi.</text>
  <rect x="25" y="300" width="400" height="160" fill="#ffffff" stroke="#64748b" stroke-width="2" rx="8"/>
  <text x="225" y="340" fill="#1e293b" font-size="15" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: BẢNG DÀY ĐẶC CHỮ NHỎ</text>
  <text x="225" y="375" fill="#334155" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="410" fill="#475569" font-size="11" text-anchor="middle">Đảm bảo AI không đoán mò lượng muối natri cực lớn 1850mg.</text>
  <text x="225" y="520" fill="#475569" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 18 (Chữ siêu nhỏ)</text>
</svg>`;

const svgTiny3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#f8fafc" stroke="#64748b" stroke-width="4" rx="12"/>
  <rect x="20" y="20" width="410" height="50" fill="#334155" rx="6"/>
  <text x="225" y="52" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">THANH PROTEIN BAR MINI (CHỮ SIÊU MỊN)</text>
  <rect x="25" y="80" width="400" height="180" fill="#f1f5f9" stroke="#94a3b8" rx="6"/>
  <text x="35" y="105" fill="#475569" font-size="5">Serving size 35g: Energy 130kcal, Protein 10g, Carbs 12g, Polyols 4g, Fiber 5g, Fat 4.5g, Sodium 65mg</text>
  <text x="35" y="125" fill="#64748b" font-size="4.5">Whey protein isolate, soy protein crisps, chicory root fiber, almond paste, cocoa powder, stevia</text>
  <rect x="25" y="300" width="400" height="160" fill="#ffffff" stroke="#64748b" stroke-width="2" rx="8"/>
  <text x="225" y="340" fill="#1e293b" font-size="15" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: DÒNG THÔNG SỐ SIÊU NHỎ</text>
  <text x="225" y="375" fill="#334155" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="410" fill="#475569" font-size="11" text-anchor="middle">Không đoán mò tỷ lệ đạm hay chất xơ khi độ phân giải không đủ.</text>
  <text x="225" y="520" fill="#475569" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 19 (Chữ siêu nhỏ)</text>
</svg>`;

const svgTiny4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 560" width="450" height="560" font-family="'Segoe UI', Roboto, sans-serif">
  <rect width="100%" height="100%" fill="#f8fafc" stroke="#64748b" stroke-width="4" rx="12"/>
  <rect x="20" y="20" width="410" height="50" fill="#334155" rx="6"/>
  <text x="225" y="52" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle">KẸO NGẬM THẢO DƯỢC (CHỮ VÒNG CUNG LI TI)</text>
  <rect x="25" y="80" width="400" height="180" fill="#f1f5f9" stroke="#94a3b8" rx="6"/>
  <text x="35" y="110" fill="#475569" font-size="5.2">1 vien 2g | Nang luong 8 kcal | Isomalt 1.9g | Tinh dau bac ha, cam thao, khuynh diep | HSD 2027</text>
  <rect x="25" y="300" width="400" height="160" fill="#ffffff" stroke="#64748b" stroke-width="2" rx="8"/>
  <text x="225" y="340" fill="#1e293b" font-size="15" font-weight="900" text-anchor="middle">⚠️ MẪU KIỂM THỬ: CHỮ VIỀN TRÒN SIÊU NHỎ</text>
  <text x="225" y="375" fill="#334155" font-size="13" font-weight="bold" text-anchor="middle">Kết quả AI yêu cầu: "Chưa đọc rõ, vui lòng chụp lại"</text>
  <text x="225" y="410" fill="#475569" font-size="11" text-anchor="middle">Mẫu hoàn thiện danh sách 20 nhãn kiểm thử thực tế.</text>
  <text x="225" y="520" fill="#475569" font-size="12" font-weight="bold" text-anchor="middle">Mẫu kiểm thử số 20 (Chữ siêu nhỏ)</text>
</svg>`;

export const TWENTY_TEST_LABELS: TestingLabelItem[] = [
  // 1-8: Clear
  {
    id: 'test-01-biscuit',
    name: '1. Bánh quy bơ NutriBite (Ảnh chuẩn)',
    category: 'clear',
    categoryLabel: 'Ảnh rõ nét',
    challengeNote: 'Bảng Nutrition Facts vuông vắn, chữ sắc nét, đầy đủ 7 trường thông tin.',
    imageUrl: svgToDataUrl(svgClear1),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Bánh quy bơ NutriBite',
      servingSize: 30,
      servingUnit: 'g',
      servingsPerContainer: 2,
      caloriesPerServing: 120,
      sugarsPerServing: 6,
      sodiumPerServing: 95,
      expirationDateText: 'NSX: 10/01/2026 - HSD: 10/07/2026',
      hasExpiry: true,
      ingredientsKeyText: 'Bột mì, bơ tươi, đường, trứng, sữa, vani',
      shouldReject: false,
    },
  },
  {
    id: 'test-02-milk',
    name: '2. Sữa tiệt trùng dâu 180ml',
    category: 'clear',
    categoryLabel: 'Ảnh rõ nét',
    challengeNote: 'Quy cách 1 khẩu phần = 1 hộp (180ml). Lượng đường 16.2g.',
    imageUrl: svgToDataUrl(svgClear2),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Sữa tiệt trùng vị dâu 180ml',
      servingSize: 180,
      servingUnit: 'ml',
      servingsPerContainer: 1,
      caloriesPerServing: 135,
      sugarsPerServing: 16.2,
      sodiumPerServing: 80,
      expirationDateText: 'NSX: 15/03/2026 - HSD: 15/09/2026',
      hasExpiry: true,
      ingredientsKeyText: 'Sữa bò tươi (90%), đường, nước cốt dâu',
      shouldReject: false,
    },
  },
  {
    id: 'test-03-soda-zero',
    name: '3. Nước chanh Zero Calorie 330ml',
    category: 'clear',
    categoryLabel: 'Ảnh rõ nét',
    challengeNote: 'Đọc đúng 0 kcal, 0g đường, có chất tạo ngọt nhân tạo Sucralose.',
    imageUrl: svgToDataUrl(svgClear3),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Nước chanh Zero Calorie 330ml',
      servingSize: 330,
      servingUnit: 'ml',
      servingsPerContainer: 1,
      caloriesPerServing: 0,
      sugarsPerServing: 0,
      sodiumPerServing: 40,
      expirationDateText: 'HSD: 12 tháng kể từ NSX (Xem đáy lon)',
      hasExpiry: true,
      ingredientsKeyText: 'Nước bão hòa CO2, Sucralose, Acesulfame K',
      shouldReject: false,
    },
  },
  {
    id: 'test-04-noodles',
    name: '4. Mì ăn liền tôm chua cay 75g',
    category: 'clear',
    categoryLabel: 'Ảnh rõ nét',
    challengeNote: 'Natri cao 1480 mg (chiếm hơn 70% nhu cầu khuyến nghị cả ngày của HS THCS).',
    imageUrl: svgToDataUrl(svgClear4),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Mì ăn liền tôm chua cay 75g',
      servingSize: 75,
      servingUnit: 'g',
      servingsPerContainer: 1,
      caloriesPerServing: 345,
      sugarsPerServing: 4,
      sodiumPerServing: 1480,
      expirationDateText: 'NSX: 01/02/2026 - HSD: 01/07/2026',
      hasExpiry: true,
      ingredientsKeyText: 'Bột mì, shortening, tinh bột sắn, muối, tôm sấy',
      shouldReject: false,
    },
  },
  {
    id: 'test-05-yogurt',
    name: '5. Sữa chua nha đam 100g',
    category: 'clear',
    categoryLabel: 'Ảnh rõ nét',
    challengeNote: 'Hạn dùng ngắn hạn lạnh 30 ngày, men sống Lactobacillus.',
    imageUrl: svgToDataUrl(svgClear5),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Sữa chua lên men nha đam 100g',
      servingSize: 100,
      servingUnit: 'g',
      servingsPerContainer: 1,
      caloriesPerServing: 102,
      sugarsPerServing: 14,
      sodiumPerServing: 45,
      expirationDateText: 'NSX: 18/03/2026 - HSD: 18/04/2026',
      hasExpiry: true,
      ingredientsKeyText: 'Sữa chua lên men (85%), nha đam (10%), đường',
      shouldReject: false,
    },
  },
  {
    id: 'test-06-oatmeal',
    name: '6. Bột yến mạch trái cây 40g',
    category: 'clear',
    categoryLabel: 'Ảnh rõ nét',
    challengeNote: 'Tỷ lệ thành phần có % rõ ràng: Yến mạch 75%, táo đỏ 10%, hạt chia 5%.',
    imageUrl: svgToDataUrl(svgClear6),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Bột yến mạch trái cây 40g',
      servingSize: 40,
      servingUnit: 'g',
      servingsPerContainer: 1,
      caloriesPerServing: 155,
      sugarsPerServing: 5,
      sodiumPerServing: 25,
      expirationDateText: 'NSX: 01/01/2026 - HSD: 01/01/2027',
      hasExpiry: true,
      ingredientsKeyText: 'Yến mạch Úc (75%), táo đỏ khô (10%), chuối, chia',
      shouldReject: false,
    },
  },
  {
    id: 'test-07-chocolate',
    name: '7. Socola đen hạt phỉ 50g',
    category: 'clear',
    categoryLabel: 'Ảnh rõ nét',
    challengeNote: 'Thanh 50g chia làm 2 khẩu phần (25g). Năng lượng 140 kcal/khẩu phần.',
    imageUrl: svgToDataUrl(svgClear7),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Socola đen hạt phỉ 50g',
      servingSize: 25,
      servingUnit: 'g',
      servingsPerContainer: 2,
      caloriesPerServing: 140,
      sugarsPerServing: 8,
      sodiumPerServing: 15,
      expirationDateText: 'NSX: 12/02/2026 - HSD: 12/02/2027',
      hasExpiry: true,
      ingredientsKeyText: 'Khối cacao (60%), bơ cacao, hạt phỉ rang (18%), đường',
      shouldReject: false,
    },
  },
  {
    id: 'test-08-orange-juice',
    name: '8. Nước ép cam nguyên chất 250ml',
    category: 'clear',
    categoryLabel: 'Ảnh rõ nét',
    challengeNote: 'Đường tự nhiên từ quả cam 22g, không thêm đường tinh luyện.',
    imageUrl: svgToDataUrl(svgClear8),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Nước ép cam nguyên chất 250ml',
      servingSize: 250,
      servingUnit: 'ml',
      servingsPerContainer: 1,
      caloriesPerServing: 110,
      sugarsPerServing: 22,
      sodiumPerServing: 10,
      expirationDateText: 'NSX: 05/03/2026 - HSD: 05/05/2026',
      hasExpiry: true,
      ingredientsKeyText: 'Nước ép cam nguyên chất 100%, tép cam, vitamin C',
      shouldReject: false,
    },
  },

  // 9-12: Blurry
  {
    id: 'test-09-blurry-snack',
    name: '9. Snack khoai tây cay (Ảnh mờ rung tay)',
    category: 'blurry',
    categoryLabel: 'Ảnh mờ',
    challengeNote: 'Ảnh chụp khi tay chuyển động, toàn bộ số calo và natri bị nhòe vệt ngang.',
    imageUrl: svgToDataUrl(svgBlurry1),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Snack khoai tây cay',
      servingSize: 30,
      servingUnit: 'g',
      servingsPerContainer: 2,
      caloriesPerServing: 150,
      sugarsPerServing: 2,
      sodiumPerServing: 210,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Khoai tây, dầu cọ, bột ớt',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Ảnh bị mờ do rung tay)',
    },
  },
  {
    id: 'test-10-blurry-milktea',
    name: '10. Trà sữa đóng chai (Mờ số calo)',
    category: 'blurry',
    categoryLabel: 'Ảnh mờ',
    challengeNote: 'Mất nét ống kính (Out of focus), dòng calo và lượng đường không đọc được.',
    imageUrl: svgToDataUrl(svgBlurry2),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Trà sữa đóng chai',
      servingSize: 200,
      servingUnit: 'ml',
      servingsPerContainer: 1,
      caloriesPerServing: 180,
      sugarsPerServing: 24,
      sodiumPerServing: 60,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Trà đen, bột kem không sữa',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Ảnh mờ thiếu nét)',
    },
  },
  {
    id: 'test-11-blurry-bread',
    name: '11. Bánh mì gối (Mực in HSD bị nhòe)',
    category: 'blurry',
    categoryLabel: 'Ảnh mờ',
    challengeNote: 'Hạn sử dụng bị lem mực đen hoàn toàn không phân biệt được ngày.',
    imageUrl: svgToDataUrl(svgBlurry3),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Bánh mì gối lúa mạch',
      servingSize: 50,
      servingUnit: 'g',
      servingsPerContainer: 4,
      caloriesPerServing: 130,
      sugarsPerServing: 3,
      sodiumPerServing: 120,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Bột mì, men bánh mì',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Mực in HSD bị nhòe vệt)',
    },
  },
  {
    id: 'test-12-blurry-soy',
    name: '12. Sữa hạt dinh dưỡng (Nhòe hình)',
    category: 'blurry',
    categoryLabel: 'Ảnh mờ',
    challengeNote: 'Độ mờ quang học vượt ngưỡng 6.5px, không phân biệt được các ký tự.',
    imageUrl: svgToDataUrl(svgBlurry4),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Sữa hạt dinh dưỡng',
      servingSize: 180,
      servingUnit: 'ml',
      servingsPerContainer: 1,
      caloriesPerServing: 110,
      sugarsPerServing: 9,
      sodiumPerServing: 50,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Hạt óc chó, hạnh nhân, đậu nành',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Ảnh nhòe toàn phần)',
    },
  },

  // 13-16: Tilted
  {
    id: 'test-13-tilted-wafer',
    name: '13. Hộp bánh quế (Chụp nghiêng 45°)',
    category: 'tilted',
    categoryLabel: 'Ảnh chụp nghiêng',
    challengeNote: 'Chụp xiên góc méo mó, dòng chữ bị biến dạng hình học.',
    imageUrl: svgToDataUrl(svgTilted1),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Hộp bánh quế',
      servingSize: 25,
      servingUnit: 'g',
      servingsPerContainer: 4,
      caloriesPerServing: 110,
      sugarsPerServing: 8,
      sodiumPerServing: 45,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Bột mì, đường, dầu thực vật',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Ảnh chụp góc nghiêng 45°)',
    },
  },
  {
    id: 'test-14-tilted-can',
    name: '14. Lon nước ngọt (Chụp vát cong thân lon)',
    category: 'tilted',
    categoryLabel: 'Ảnh chụp nghiêng',
    challengeNote: 'Mặt cong kim loại phản chiếu ánh sáng và biến dạng dòng chữ.',
    imageUrl: svgToDataUrl(svgTilted2),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Lon nước ngọt',
      servingSize: 330,
      servingUnit: 'ml',
      servingsPerContainer: 1,
      caloriesPerServing: 140,
      sugarsPerServing: 35,
      sodiumPerServing: 30,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Nước bão hòa CO2, đường mía',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Bề mặt lon cong và nghiêng)',
    },
  },
  {
    id: 'test-15-tilted-cheese',
    name: '15. Gói phô mai que (Góc vát cạnh méo)',
    category: 'tilted',
    categoryLabel: 'Ảnh chụp nghiêng',
    challengeNote: 'Bao bì bị nhăn nếp gấp, dòng thành phần bị chia cắt gập góc.',
    imageUrl: svgToDataUrl(svgTilted3),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Gói phô mai que',
      servingSize: 28,
      servingUnit: 'g',
      servingsPerContainer: 2,
      caloriesPerServing: 90,
      sugarsPerServing: 1,
      sodiumPerServing: 190,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Sữa bò, men phô mai',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Bao bì nhăn và chụp vát cạnh)',
    },
  },
  {
    id: 'test-16-tilted-seaweed',
    name: '16. Rong biển tẩm gia vị (Gập mép 45°)',
    category: 'tilted',
    categoryLabel: 'Ảnh chụp nghiêng',
    challengeNote: 'Mép túi bị gập che mất một nửa bảng dinh dưỡng.',
    imageUrl: svgToDataUrl(svgTilted4),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Rong biển tẩm gia vị',
      servingSize: 20,
      servingUnit: 'g',
      servingsPerContainer: 2,
      caloriesPerServing: 85,
      sugarsPerServing: 2,
      sodiumPerServing: 160,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Rong biển, dầu mè, muối',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Bị gập mép che khuất chữ)',
    },
  },

  // 17-20: Tiny Text
  {
    id: 'test-17-tiny-gum',
    name: '17. Kẹo cao su bạc hà (Chữ siêu nhỏ 4pt)',
    category: 'tiny_text',
    categoryLabel: 'Chữ siêu nhỏ',
    challengeNote: 'Chữ in dày đặc cỡ 4-5pt trên vỉ nhỏ, mắt thường cũng khó đọc.',
    imageUrl: svgToDataUrl(svgTiny1),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Kẹo cao su bạc hà',
      servingSize: 2.5,
      servingUnit: 'g',
      servingsPerContainer: 10,
      caloriesPerServing: 5,
      sugarsPerServing: 0,
      sodiumPerServing: 0,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Xylitol, sorbitol, gum base, hương bạc hà',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Chữ in siêu nhỏ li ti dưới 5pt)',
    },
  },
  {
    id: 'test-18-tiny-soup',
    name: '18. Gói viên súp gia vị (Chữ dày đặc)',
    category: 'tiny_text',
    categoryLabel: 'Chữ siêu nhỏ',
    challengeNote: 'Mật độ chữ quá dày đặc và kích thước siêu nhỏ, natri 1850mg.',
    imageUrl: svgToDataUrl(svgTiny2),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Viên súp gia vị',
      servingSize: 10,
      servingUnit: 'g',
      servingsPerContainer: 4,
      caloriesPerServing: 22,
      sugarsPerServing: 1,
      sodiumPerServing: 1850,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Muối, mỡ bò, chiết xuất nấm men',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Chữ in quá nhỏ và dày đặc)',
    },
  },
  {
    id: 'test-19-tiny-protein',
    name: '19. Thanh protein bar mini (Chữ siêu mịn)',
    category: 'tiny_text',
    categoryLabel: 'Chữ siêu nhỏ',
    challengeNote: 'Dòng thông số dinh dưỡng in chữ siêu mịn không đủ điểm ảnh pixel để bóc tách an toàn.',
    imageUrl: svgToDataUrl(svgTiny3),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Thanh protein bar mini',
      servingSize: 35,
      servingUnit: 'g',
      servingsPerContainer: 1,
      caloriesPerServing: 130,
      sugarsPerServing: 2,
      sodiumPerServing: 65,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Whey protein, soy protein, almond',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Dòng thông số chữ siêu mịn)',
    },
  },
  {
    id: 'test-20-tiny-herbal',
    name: '20. Kẹo ngậm thảo dược (Chữ vòng cung li ti)',
    category: 'tiny_text',
    categoryLabel: 'Chữ siêu nhỏ',
    challengeNote: 'Chữ uốn cong vòng tròn theo nắp hộp thiếc tròn nhỏ.',
    imageUrl: svgToDataUrl(svgTiny4),
    mimeType: 'image/svg+xml',
    groundTruth: {
      productName: 'Kẹo ngậm thảo dược',
      servingSize: 2,
      servingUnit: 'g',
      servingsPerContainer: 15,
      caloriesPerServing: 8,
      sugarsPerServing: 0,
      sodiumPerServing: 0,
      expirationDateText: 'Không đọc được',
      hasExpiry: false,
      ingredientsKeyText: 'Isomalt, tinh dầu bạc hà, cam thảo',
      shouldReject: true,
      rejectionReason: 'Chưa đọc rõ, vui lòng chụp lại (Chữ in vòng cung siêu nhỏ)',
    },
  },
];
