import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, CheckSquare, Trophy, BookOpen, BarChart2, 
  Play, Pause, RotateCcw, HelpCircle, Layout, Globe, 
  CloudLightning, Link, Loader, Save, CheckCircle, AlertCircle, Calendar,
  UserCircle, ExchangeAlt, UsersCog, ChalkboardTeacher, Info, FileSpreadsheet
} from 'lucide-react';

// --- Components ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, variant = "primary", className = "", disabled = false }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50",
    success: "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    outline: "border-2 border-gray-200 text-gray-600 hover:border-gray-300 bg-transparent"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- DỮ LIỆU 12 BUỔI HỌC (TỪ ĐỀ CƯƠNG) ---
const courseSessions = [
  {
    id: 1, title: "Buổi 1: Giới thiệu ĐCĐT & Vỏ phong hóa", duration: 150,
    stages: [
      { id: 1, title: "Ổn định & Giới thiệu", time: 45, content: "Giới thiệu GV, Quy chế điểm (60/40), Chia nhóm." },
      { id: 2, title: "Khái niệm (Chương 1)", time: 30, content: "Định nghĩa ĐCĐT, VPH, Mối quan hệ nguồn vật liệu." },
      { id: 3, title: "VPH là thể địa chất", time: 60, content: "4 Quá trình phong hóa, Yếu tố ảnh hưởng, Phân đới." },
      { id: 4, title: "Tổng kết & Đánh giá", time: 15, content: "Kiểm tra từ vựng (CHP7), Kahoot, Dặn dò." }
    ]
  },
  {
    id: 2, title: "Buổi 2: Các yếu tố ảnh hưởng & Phân đới", duration: 150,
    stages: [
      { id: 1, title: "Khởi động: Nhìn hình đoán đới", time: 20, content: "Phân biệt Saprolit (giữ cấu trúc) và Litoma (sét)." },
      { id: 2, title: "Sự biến hình khoáng vật", time: 50, content: "Jigsaw: Felspat -> Kaolinit, Olivin -> Goethit." },
      { id: 3, title: "Truy tìm nguyên tố", time: 50, content: "Phân tích bảng số liệu hóa học (Si giảm, Al/Fe tăng)." },
      { id: 4, title: "Đấu trường Kahoot", time: 30, content: "Trắc nghiệm tương tác các phản ứng hóa học." }
    ]
  },
  {
    id: 3, title: "Buổi 3: Phân loại & Phương pháp nghiên cứu VPH", duration: 150,
    stages: [
      { id: 1, title: "Phân loại VPH", time: 40, content: "Theo địa hóa: Sialit, Feralit, Alferit dựa trên tỷ lệ oxit." },
      { id: 2, title: "Phương pháp nghiên cứu", time: 40, content: "Thực địa: Lập mặt cắt chuẩn. Trong phòng: Rơnghen, Nhiệt." },
      { id: 3, title: "Trạm thực hành giả lập", time: 45, content: "Seminar: Thiết kế mặt cắt hiện trường, chọn vị trí lấy mẫu." },
      { id: 4, title: "Thử thách Tam giác", time: 25, content: "Chấm thử điểm Si-Al-Fe lên biểu đồ tam giác." }
    ]
  },
  {
    id: 4, title: "Buổi 4: Thực hành VPH (Bài tập bộ phận)", duration: 150,
    stages: [
      { id: 1, title: "Hướng dẫn kỹ thuật", time: 30, content: "Cung cấp số liệu mặt cắt Trại Mát/Măng Đen, chuẩn hóa 100%." },
      { id: 2, title: "Vẽ mặt cắt VPH", time: 45, content: "Dựng cột địa tầng, vẽ đường cong biến thiên Si, Al, Fe." },
      { id: 3, title: "Định danh VPH", time: 40, content: "Sử dụng biểu đồ tam giác để gọi tên kiểu vỏ phong hóa." },
      { id: 4, title: "Thu bài & Đánh giá", time: 35, content: "Chấm chéo (Peer Review), thu bài lấy điểm Thực hành." }
    ]
  },
  {
    id: 5, title: "Buổi 5: Các loại VPH chính (Magma/Trầm tích)", duration: 150,
    stages: [
      { id: 1, title: "Truy tìm kho báu", time: 20, content: "Matching Game: Đá gốc -> Khoáng sản (Bazan->Bauxit, Granit->Kaolin)." },
      { id: 2, title: "Trạm chuyên gia (Jigsaw)", time: 60, content: "Phân tích VPH Siêu mafic, Mafic và Axit." },
      { id: 3, title: "Case Study thực tế", time: 40, content: "Bí ẩn Bauxit Tây Nguyên vs Kaolin Trại Mát." },
      { id: 4, title: "Tổng kết Phiếu 1 phút", time: 30, content: "Chuẩn bị cho bài Kiểm tra thường xuyên tuần sau." }
    ]
  },
  {
    id: 6, title: "Buổi 6: VPH Quặng hóa & Kiểm tra", duration: 150,
    stages: [
      { id: 1, title: "Data Mining Bauxit", time: 20, content: "Phân tích biểu đồ Alferit (Bauxit) và Feralit (Sắt Laterit)." },
      { id: 2, title: "Mini-Project Bauxit", time: 40, content: "Tính Modul Silic (Msi), đánh giá hiệu quả kinh tế mỏ." },
      { id: 3, title: "Hệ thống kiến thức", time: 30, content: "Mindmap tổng kết Phần 1: Vỏ phong hóa." },
      { id: 4, title: "Kiểm tra Thường xuyên", time: 60, content: "Thi trắc nghiệm/Tự luận Phần Vỏ phong hóa (Hệ số 10%)." }
    ]
  },
  {
    id: 7, title: "Buổi 7: Đại cương Trầm tích Đệ tứ", duration: 150,
    stages: [
      { id: 1, title: "Truy tìm sự khác biệt", time: 20, content: "Phân biệt Trầm tích Đệ tứ (bở rời) và Đá trầm tích (gắn kết)." },
      { id: 2, title: "Chu kỳ Băng hà", time: 40, content: "Mối quan hệ: Băng hà -> Biển lùi (thô); Gian băng -> Biển tiến (mịn)." },
      { id: 3, title: "Trạm Quan sát Cấu tạo", time: 60, content: "Đánh giá độ hạt, mài tròn (Q), chọn lọc (So) và phân lớp xiên." },
      { id: 4, title: "Giải mã viên đá", time: 30, content: "Kahoot: Nhận diện môi trường qua hình dáng hạt." }
    ]
  },
  {
    id: 8, title: "Buổi 8: Phân loại & PP Nghiên cứu TTĐT", duration: 150,
    stages: [
      { id: 1, title: "Đấu trường Định danh", time: 20, content: "Hô nhanh kích thước hạt -> Phân loại Psephit, Psamit, Aleurit, Pelit." },
      { id: 2, title: "Thực hành Biểu đồ Folk", time: 50, content: "Dùng biểu đồ G-S-M và S-Z-C gọi tên trầm tích (Cát pha bột, Bùn sét)." },
      { id: 3, title: "Role-play Thực địa-Lab", time: 50, content: "Quy trình lấy mẫu rãnh -> Phân tích rây/tỷ trọng kế -> Tính So, Md." },
      { id: 4, title: "Chuyên gia xử lý số liệu", time: 30, content: "Tính nhanh hệ số So và biện luận môi trường." }
    ]
  },
  {
    id: 9, title: "Buổi 9: Thực hành Xử lý số liệu TTĐT", duration: 150,
    stages: [
      { id: 1, title: "Nhìn số đoán hình", time: 20, content: "Đọc đường cong tích lũy (Dốc: Gió/Biển, Thoải: Lũ tích)." },
      { id: 2, title: "Công nghệ hóa địa chất", time: 40, content: "Hướng dẫn dùng Excel vẽ Histogram và đường cong tích lũy." },
      { id: 3, title: "Thực hành cá nhân", time: 60, content: "Tính Q25, Q50(Md), Q75 và So. Đưa lên tam giác gọi tên." },
      { id: 4, title: "Thu bài Bài tập", time: 30, content: "Chấm chéo kết quả, nộp file Excel/Giấy (Điều kiện thi)." }
    ]
  },
  {
    id: 10, title: "Buổi 10: Trầm tích Lục địa & Biển (Seminar)", duration: 150,
    stages: [
      { id: 1, title: "Nhà địa mạo tài ba", time: 20, content: "Phân tích địa mạo sông: Lòng sông (thô) -> Bãi bồi -> Đồng lụt (mịn)." },
      { id: 2, title: "Seminar Nhóm (Trọng tâm)", time: 70, content: "Trình bày: Sông Ba, Lũ tích Ia Rsuom, Biển Phan Thiết, Holocen Nha Trang." },
      { id: 3, title: "So sánh đối sánh", time: 30, content: "Trạm thực hành: Đoán nguồn gốc qua mẫu câm." },
      { id: 4, title: "Tổng kết từ khóa", time: 30, content: "Finning-upward (Sông) vs Độ chọn lọc tốt (Gió/Biển)." }
    ]
  },
  {
    id: 11, title: "Buổi 11: TT Hỗn hợp/Gió & Báo cáo Poster", duration: 150,
    stages: [
      { id: 1, title: "Trầm tích Delta & Vũng vịnh", time: 30, content: "Sự tranh chấp Sông-Biển. Hóa thạch chỉ thị (Trùng lỗ, Diatom)." },
      { id: 2, title: "Trầm tích Gió", time: 30, content: "Đặc điểm Cát đỏ Phan Thiết (So ~ 1.2, thạch anh mờ đục)." },
      { id: 3, title: "Hội thảo Poster", time: 60, content: "Các nhóm trưng bày và thuyết trình Seminar lấy điểm 10% Báo cáo." },
      { id: 4, title: "Phản biện & Chấm điểm", time: 30, content: "Giảng viên và nhóm bạn đặt câu hỏi chất vấn." }
    ]
  },
  {
    id: 12, title: "Buổi 12: Tổng kết & Ôn tập", duration: 150,
    stages: [
      { id: 1, title: "Khởi động: Từ khóa vàng", time: 20, content: "Thu thập các khái niệm khó hiểu qua Slido/Mentimeter." },
      { id: 2, title: "Game: Đấu trường Địa chất", time: 50, content: "3 Vòng thi tổng hợp kiến thức VPH và TTĐT." },
      { id: 3, title: "Trạm Giải mã đề thi", time: 40, content: "Luyện kỹ năng vẽ mặt cắt, tính toán và biện luận." },
      { id: 4, title: "Công bố điểm Quá trình", time: 40, content: "Minh bạch điểm số (60%), xử lý khiếu nại, hướng dẫn thi cuối kỳ." }
    ]
  }
];

// --- Rubric Data cho phần Đánh giá chéo ---
const memberCriteriaData = [
  { title: "1. THAM DỰ & PHỐI HỢP TRONG NHÓM", desc: "Mức 1: Vắng >20% (0.5đ) | Mức 2: Vắng 10-20% (1.5đ) | Mức 3: Vắng <10% (2.5đ)" },
  { title: "2. QUẢN LÝ CÔNG VIỆC", desc: "Mức 1: Trễ hạn (0.5đ) | Mức 2: Đúng hạn (1.5đ) | Mức 3: Chủ động, sớm hạn (2.5đ)" },
  { title: "3. GIAO TIẾP", desc: "Mức 1: Kém (0.5đ) | Mức 2: Khá (1.5đ) | Mức 3: Tốt, rõ ràng (2.5đ)" },
  { title: "4. KỸ NĂNG GIẢI QUYẾT VẤN ĐỀ", desc: "Mức 1: Kém (0.5đ) | Mức 2: Khá (1.5đ) | Mức 3: Tốt, logic (2.5đ)" }
];
const leaderCriteria = ["1. THAM DỰ & PHỐI HỢP", "2. QUẢN LÝ CÔNG VIỆC", "3. GIAO TIẾP", "4. GIẢI QUYẾT VẤN ĐỀ"];
const lecturerCriteria = ["1. CHUYÊN CẦN", "2. NGHIÊM TÚC", "3. THẢO LUẬN/BÁO CÁO", "4. BÀI TẬP/THỰC HÀNH", "5. NHÓM TRƯỞNG"];


// --- Main Application ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, attendance, scoring, peerReview
  
  // Trạng thái buổi học hiện tại (Menu Dropdown)
  const [currentSessionIdx, setCurrentSessionIdx] = useState(0);
  const currentSession = courseSessions[currentSessionIdx];

  // Trạng thái Timeline của buổi đang chọn
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(courseSessions[0].stages[0].time * 60);
  const [timerActive, setTimerActive] = useState(false);

  // Google Sheet Integration
  const [scriptUrl, setScriptUrl] = useState(() => localStorage.getItem('GEO_CLASS_SCRIPT_URL') || '');
  const [lastSyncStatus, setLastSyncStatus] = useState(null); 
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  useEffect(() => {
    localStorage.setItem('GEO_CLASS_SCRIPT_URL', scriptUrl);
  }, [scriptUrl]);

  // Cập nhật lại Timer mỗi khi đổi buổi học hoặc đổi Stage
  useEffect(() => {
    setTimeLeft(currentSession.stages[currentStage].time * 60);
    setTimerActive(false);
  }, [currentSessionIdx, currentStage]);

  // Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) setTimerActive(false);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // --- STUDENT DATA (Tích hợp 5 cột điểm Quá trình) ---
  const [students, setStudents] = useState([
    { id: 1, name: "TRẦN THỊ NHƯ HẢO", code: "23160002", group: 1, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 2, name: "ĐỖ NGUYỄN XUÂN THANH", code: "23160004", group: 2, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 3, name: "LÝ NGỌC TƯỜNG VÂN", code: "23160006", group: 3, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 4, name: "NGUYỄN LÊ THẢO TIÊN", code: "23160007", group: 4, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 5, name: "DƯƠNG QUỲNH ANH", code: "23160008", group: 1, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 6, name: "NGUYỄN MINH CHÍ", code: "23160009", group: 2, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 7, name: "PHÙNG THỊ TRÚC ĐÀO", code: "23160011", group: 3, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 8, name: "NGUYỄN HỮU HOÀN", code: "23160012", group: 4, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 9, name: "VÕ TRẦN TIẾN HUY", code: "23160015", group: 1, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 10, name: "VŨ ĐÌNH KHOA", code: "23160016", group: 2, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 11, name: "LÂM YẾN NHI", code: "23160019", group: 3, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 12, name: "PHẠM GIA PHONG", code: "23160020", group: 4, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 13, name: "NGUYỄN THỊ THANH THẢO", code: "23160022", group: 1, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 14, name: "VŨ HOÀNG ANH THƯ", code: "23160024", group: 2, attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
  ]);

  const [groupReportInputs, setGroupReportInputs] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [pickedStudent, setPickedStudent] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  // --- TRẠNG THÁI CHO TÍNH NĂNG ĐÁNH GIÁ CHÉO ---
  const [evaluator, setEvaluator] = useState("");
  const [peerRole, setPeerRole] = useState('member'); // member, peer, leader, lecturer
  const [peerWeek, setPeerWeek] = useState("1");
  const [showRubricModal, setShowRubricModal] = useState(false);
  
  // Lưu trữ dữ liệu điểm đánh giá chéo. 
  // Cấu trúc: { member: { crit_0: val, crit_1: val }, peer: { m_0_c_0: val, ... }, leader: {...}, lecturer: {...} }
  const [evaluationScores, setEvaluationScores] = useState({
    member: {},
    peer: {},
    leader: {},
    lecturer: {}
  });


  // --- TÍNH ĐIỂM QUÁ TRÌNH ---
  // Đề cương: CC(10%), TL(10%), BC(10%), TX(10%), GK(20%) -> Tổng 60%
  // Quy đổi hệ 10 Điểm Quá Trình = (CC + TL + BC + TX + GK*2) / 6
  const calculateProcessScore = (s) => {
    return ((s.attendance + s.discussion + s.groupReport + s.regular + (s.midterm * 2)) / 6).toFixed(1);
  };

  // --- HÀM GỬI DỮ LIỆU ĐƠN LẺ LÊN GOOGLE SHEET (Tự động lưu) ---
  const sendStudentData = useCallback(async (student) => {
    if (!scriptUrl) return;

    const payload = {
      role: "Cập nhật Điểm Quá trình",
      evaluator: "ThS. Đinh Quốc Tuấn",
      groupName: `${student.name} (${student.code})`,
      comment: "Cập nhật từ App Hệ thống",
      headers: ["MSSV", "Nhóm", "Chuyên cần (10%)", "Thảo luận (10%)", "Báo cáo (10%)", "Thường xuyên (10%)", "Giữa kỳ (20%)", "Điểm Quá Trình (Hệ 10)"],
      scores: [
        student.code, 
        `Nhóm ${student.group}`, 
        student.attendance, 
        student.discussion, 
        student.groupReport, 
        student.regular, 
        student.midterm,
        calculateProcessScore(student)
      ]
    };

    try {
      await fetch(scriptUrl, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setLastSyncStatus(`Đã lưu: ${student.name}`);
      setTimeout(() => setLastSyncStatus(null), 3000);
    } catch (error) {
      setLastSyncStatus("Lỗi kết nối!");
    }
  }, [scriptUrl]);

  // --- HÀM ĐỒNG BỘ TOÀN BỘ (Thủ công) ---
  const handleSyncAll = async () => {
    if (!scriptUrl) {
      setLastSyncStatus("Vui lòng nhập URL Web App (Script) trước!");
      setTimeout(() => setLastSyncStatus(null), 3000);
      return;
    }

    setIsSyncingAll(true);
    setLastSyncStatus("Đang đồng bộ toàn bộ lớp học...");

    try {
      const promises = students.map(student => {
        const payload = {
          role: "Đồng bộ Toàn lớp",
          evaluator: "ThS. Đinh Quốc Tuấn",
          groupName: `${student.name} (${student.code})`,
          comment: "Cập nhật đồng loạt",
          headers: ["MSSV", "Nhóm", "Chuyên cần (10%)", "Thảo luận (10%)", "Báo cáo (10%)", "Thường xuyên (10%)", "Giữa kỳ (20%)", "Điểm Quá Trình (Hệ 10)"],
          scores: [
            student.code, 
            `Nhóm ${student.group}`, 
            student.attendance, 
            student.discussion, 
            student.groupReport, 
            student.regular, 
            student.midterm,
            calculateProcessScore(student)
          ]
        };

        return fetch(scriptUrl, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      });

      await Promise.all(promises);
      setLastSyncStatus(`Đã đồng bộ thành công ${students.length} sinh viên!`);
    } catch (error) {
      console.error(error);
      setLastSyncStatus("Có lỗi xảy ra khi đồng bộ!");
    } finally {
      setIsSyncingAll(false);
      setTimeout(() => setLastSyncStatus(null), 4000);
    }
  };

  // --- HÀM SUBMIT DỮ LIỆU ĐÁNH GIÁ CHÉO ---
  const submitPeerEvaluation = async () => {
      if (!scriptUrl) {
          alert("Vui lòng nhập URL Web App (Script) ở thanh Header trước khi gửi!");
          return;
      }
      if (!evaluator) {
          alert("Vui lòng chọn Tên người đánh giá!");
          return;
      }

      setIsSyncingAll(true);
      
      let payload = {
          role: peerRole === 'member' ? 'Tự Đánh Giá' : peerRole === 'peer' ? 'Đánh Giá Chéo' : peerRole === 'leader' ? 'Nhóm Trưởng' : 'Giảng Viên',
          groupName: "Lớp ĐCĐT (14 SV)",
          evaluator: evaluator,
          comment: `Đánh giá tuần ${peerWeek}`,
          headers: [],
          scores: []
      };

      if (peerRole === 'member') {
          payload.headers = memberCriteriaData.map(c => c.title);
          payload.scores = memberCriteriaData.map((_, idx) => evaluationScores.member[`crit_${idx}`] || 0);
      } else {
          const criteriaList = peerRole === 'lecturer' ? lecturerCriteria : leaderCriteria;
          payload.headers = students.map(s => s.name);
          
          // Gửi từng tiêu chí thành các mảng hoặc tính tổng.
          // Ở đây tôi chọn gửi Tổng điểm để cho gọn.
          payload.headers.unshift("Tiêu chí");
          payload.scores.push("Tổng điểm"); // row title
          
          for(let i=0; i<students.length; i++) {
              payload.scores.push(calculatePeerTotal(peerRole, i));
          }
      }

      try {
          await fetch(scriptUrl, {
              method: 'POST', mode: 'no-cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          alert("Đã gửi dữ liệu đánh giá thành công!");
      } catch (error) {
          alert("Lỗi kết nối khi gửi dữ liệu đánh giá!");
      } finally {
          setIsSyncingAll(false);
      }
  };

  const handleClearPeerData = () => {
      if(window.confirm("Thầy/Cô/Bạn có chắc chắn muốn xóa toàn bộ dữ liệu đánh giá nháp hiện tại?")) {
          setEvaluationScores({ member: {}, peer: {}, leader: {}, lecturer: {} });
          setEvaluator("");
      }
  }


  // --- ACTIONS LỚP HỌC ---

  // Hàm chuyển đổi điểm danh (10đ <-> 0đ)
  const toggleAttendance = (id) => {
    const updatedStudents = students.map(s => {
      if (s.id === id) {
        return { ...s, attendance: s.attendance > 0 ? 0 : 10 };
      }
      return s;
    });
    setStudents(updatedStudents);
    
    // Gửi dữ liệu đồng bộ
    const changedStudent = updatedStudents.find(s => s.id === id);
    if (changedStudent) sendStudentData(changedStudent);
  };

  const updateStudentScore = (id, type, value) => {
    const newValue = parseFloat(value) || 0;
    const updatedStudents = students.map(s => s.id === id ? { ...s, [type]: newValue } : s);
    setStudents(updatedStudents);
    
    const changedStudent = updatedStudents.find(s => s.id === id);
    if (changedStudent) sendStudentData(changedStudent);
  };

  const updateGroupReportScore = (groupId, score) => {
    const numScore = parseFloat(score) || 0;
    setGroupReportInputs(prev => ({ ...prev, [groupId]: numScore }));
    
    const updatedStudents = students.map(s => s.group === parseInt(groupId) ? { ...s, groupReport: numScore } : s);
    setStudents(updatedStudents);
    
    updatedStudents.filter(s => s.group === parseInt(groupId)).forEach(s => sendStudentData(s));
  };

  const pickRandomStudent = () => {
    setIsRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * students.length);
      setPickedStudent(students[randomIdx]);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- ACTIONS ĐÁNH GIÁ CHÉO ---
  const handleScoreChange = (tab, key, val) => {
      let numVal = parseFloat(val);
      if(isNaN(numVal)) numVal = 0;
      if(numVal > 2.5) numVal = 2.5;
      if(numVal < 0) numVal = 0;

      setEvaluationScores(prev => ({
          ...prev,
          [tab]: {
              ...prev[tab],
              [key]: numVal
          }
      }));
  };

  const calculatePeerTotal = (tab, studentIdx) => {
      const criteriaList = tab === 'lecturer' ? lecturerCriteria : leaderCriteria;
      let total = 0;
      for (let c = 0; c < criteriaList.length; c++) {
          total += (evaluationScores[tab]?.[`m_${studentIdx}_c_${c}`] || 0);
      }
      return total.toFixed(1);
  };


  // --- VIEWS ---
  const renderStatusToast = () => {
    if (!lastSyncStatus) return null;
    return (
      <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in z-50 border border-gray-700">
        <CloudLightning size={20} className="text-yellow-400"/>
        <span className="font-medium">{lastSyncStatus}</span>
      </div>
    );
  };

  // View: Bảng Đánh Giá Chéo Modal (Rubric)
  const renderRubricModal = () => {
      if (!showRubricModal) return null;
      return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                  <div className="p-4 border-b flex justify-between items-center bg-blue-50 rounded-t-lg">
                      <h3 className="text-xl font-bold text-blue-900 flex items-center"><BookOpen className="mr-2"/>Bảng Tiêu Chí Đánh Giá (Rubric)</h3>
                      <button onClick={() => setShowRubricModal(false)} className="text-gray-500 hover:text-red-600 font-bold text-xl">&times;</button>
                  </div>
                  <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-700">
                      <h2 className="text-center font-bold text-xl mb-6 text-gray-800 uppercase">RUBRIC ĐÁNH GIÁ KỸ NĂNG LÀM VIỆC NHÓM</h2>
                      <table className="w-full border-collapse">
                          <thead>
                              <tr className="bg-blue-700 text-white text-left">
                                  <th className="p-3 border border-blue-800">Tiêu chí</th>
                                  <th className="p-3 border border-blue-800">Mức 1 [0 – 1.0)</th>
                                  <th className="p-3 border border-blue-800">Mức 2 [1.0 – 2.0)</th>
                                  <th className="p-3 border border-blue-800">Mức 3 [2.0 – 2.5]</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr className="bg-blue-50/50">
                                  <td className="p-3 border font-bold text-blue-900">1. Tham dự & phối hợp</td>
                                  <td className="p-3 border">• Vắng họp/vắng mặt &gt; 20%<br/>• Không quan tâm công việc<br/>• Tương tác/buổi: 0</td>
                                  <td className="p-3 border">• Vắng họp/vắng mặt 10–20%<br/>• Tham gia trao đổi 1–2 lần/buổi</td>
                                  <td className="p-3 border">• Vắng họp/vắng mặt &lt; 10%<br/>• Tương tác trao đổi ≥ 3/buổi</td>
                              </tr>
                              <tr>
                                  <td className="p-3 border font-bold text-blue-900">2. Quản lý công việc</td>
                                  <td className="p-3 border">• Hoàn thành đúng hạn &lt; 70%<br/>• Trễ hạn ≥ 2 nhiệm vụ/buổi</td>
                                  <td className="p-3 border">• Hoàn thành đúng hạn 70–90%<br/>• Trễ hạn 0–1 nhiệm vụ/buổi</td>
                                  <td className="p-3 border">• Hoàn thành đúng hạn ≥ 90%<br/>• Hoàn thành sớm ≥ 30% nhiệm vụ</td>
                              </tr>
                              <tr className="bg-blue-50/50">
                                  <td className="p-3 border font-bold text-blue-900">3. Giao tiếp</td>
                                  <td className="p-3 border">• Phản hồi email/tin nhắn &lt; 50%<br/>• Thời gian phản hồi &gt; 24h</td>
                                  <td className="p-3 border">• Phản hồi 50–80%<br/>• Thời gian phản hồi 8–24h</td>
                                  <td className="p-3 border">• Phản hồi ≥ 80%<br/>• Phản hồi &lt; 8h</td>
                              </tr>
                              <tr>
                                  <td className="p-3 border font-bold text-blue-900">4. Giải quyết vấn đề</td>
                                  <td className="p-3 border">• Không phân tích được nguyên nhân<br/>• Số giải pháp khả thi: 0</td>
                                  <td className="p-3 border">• Đề xuất 1–2 giải pháp/buổi<br/>• Tỷ lệ chấp nhận ≤ 40%</td>
                                  <td className="p-3 border">• Đề xuất ≥ 2–3 giải pháp/buổi<br/>• Tỷ lệ chấp nhận ≥ 60%</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                  <div className="p-4 border-t bg-gray-50 text-right">
                      <Button variant="secondary" onClick={() => setShowRubricModal(false)}>Đóng</Button>
                  </div>
              </div>
          </div>
      );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="text-sm text-purple-600 font-semibold mb-1">Hoạt động hiện tại</div>
          <div className="text-xl font-bold text-purple-900 truncate">
            {currentSession.stages[currentStage].title}
          </div>
        </Card>
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="text-sm text-orange-600 font-semibold mb-1">Đếm ngược (Phút)</div>
          <div className="text-3xl font-bold font-mono text-orange-900">{formatTime(timeLeft)}</div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setTimerActive(!timerActive)} className="p-1 rounded hover:bg-orange-200">
              {timerActive ? <Pause size={16}/> : <Play size={16}/>}
            </button>
            <button onClick={() => setTimeLeft(currentSession.stages[currentStage].time * 60)} className="p-1 rounded hover:bg-orange-200">
              <RotateCcw size={16}/>
            </button>
          </div>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-sm text-blue-600 font-semibold mb-1">Sĩ số (Điểm danh 10%)</div>
          <div className="text-3xl font-bold text-blue-900">
             {students.filter(s => s.attendance > 0).length} / {students.length}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><BookOpen size={20} /> Tiến trình {currentSession.title}</h3>
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          {currentSession.stages.map((stage, index) => (
            <button key={stage.id} onClick={() => setCurrentStage(index)}
              className={`flex-1 p-3 rounded-lg border text-left transition-all ${currentStage === index ? 'bg-blue-600 text-white shadow-md' : 'bg-white hover:bg-gray-50'}`}>
              <div className="text-xs opacity-75">{stage.time} Phút</div>
              <div className="font-semibold text-sm line-clamp-2">{stage.title}</div>
            </button>
          ))}
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-gray-800 font-medium">
          👉 {currentSession.stages[currentStage].content}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><HelpCircle size={20}/> Q&A: Gọi ngẫu nhiên</h3>
          <div className="text-center py-4">
             <div className="text-2xl font-bold text-blue-800 mb-4 h-12 flex items-center justify-center bg-blue-50 rounded-lg border border-blue-100">
               {pickedStudent ? `${pickedStudent.name} (N${pickedStudent.group})` : "..."}
             </div>
             <div className="flex justify-center gap-3">
               <Button onClick={pickRandomStudent} disabled={isRolling}>Quay ngẫu nhiên</Button>
               {pickedStudent && (
                 <Button variant="success" onClick={() => updateStudentScore(pickedStudent.id, 'discussion', pickedStudent.discussion + 1)}>
                   +1đ Thảo luận
                 </Button>
               )}
             </div>
          </div>
        </Card>
        <Card className="p-6">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Users size={20}/> Chấm điểm Nhóm Nhanh</h3>
             <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(g => (
                <div key={g} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                  <span className="font-bold text-gray-700">Nhóm {g}</span>
                  <div className="flex items-center gap-1">
                    <input type="number" max="10" className="w-14 border rounded p-1 text-center font-bold text-green-700"
                      value={groupReportInputs[g]} onChange={(e) => updateGroupReportScore(g, e.target.value)} />
                    <span className="text-xs text-gray-400">/10</span>
                  </div>
                </div>
              ))}
            </div>
        </Card>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><CheckSquare/> Điểm danh Nhanh (10%)</h2>
        <div className="flex gap-2">
          <Button onClick={() => {
            const updated = students.map(s => ({...s, attendance: 10}));
            setStudents(updated);
            setLastSyncStatus("Đã đánh dấu Có mặt tất cả (Nhớ bấm nút Đồng bộ)");
            setTimeout(() => setLastSyncStatus(null), 3000);
          }}>
            Có mặt tất cả
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">MSSV</th>
              <th className="p-3">Họ và tên</th>
              <th className="p-3">Nhóm</th>
              <th className="p-3 text-center">Trạng thái (10đ)</th>
              <th className="p-3 text-center">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-gray-600">{student.code}</td>
                <td className="p-3 font-medium">{student.name}</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Nhóm {student.group}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-sm ${student.attendance > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {student.attendance > 0 ? 'Có mặt (10đ)' : 'Vắng (0đ)'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => toggleAttendance(student.id)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${student.attendance > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${student.attendance > 0 ? 'left-5' : 'left-1'}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderScoring = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><Trophy/> Bảng Điểm Quá Trình (60%)</h2>
        <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">
          Dữ liệu sẽ được tự động lưu khi chỉnh sửa
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-800 text-white text-sm">
              <th className="p-3 rounded-tl-lg">Sinh viên</th>
              <th className="p-3 text-center w-20">CC (10%)</th>
              <th className="p-3 text-center w-20">TL (10%)</th>
              <th className="p-3 text-center w-20">BC (10%)</th>
              <th className="p-3 text-center w-20">TX (10%)</th>
              <th className="p-3 text-center w-20 text-yellow-300">GK (20%)</th>
              <th className="p-3 text-center rounded-tr-lg">ĐQT (Hệ 10)</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="font-medium text-sm">{student.name}</div>
                  <div className="text-xs text-gray-500">MSSV: {student.code} | Nhóm {student.group}</div>
                </td>
                <td className="p-3 text-center">
                  <input type="number" max="10" className="w-12 border rounded p-1 text-center"
                    value={student.attendance} onChange={(e) => updateStudentScore(student.id, 'attendance', e.target.value)} />
                </td>
                <td className="p-3 text-center">
                  <input type="number" max="10" className="w-12 border rounded p-1 text-center"
                    value={student.discussion} onChange={(e) => updateStudentScore(student.id, 'discussion', e.target.value)} />
                </td>
                <td className="p-3 text-center">
                  <input type="number" max="10" className="w-12 border rounded p-1 text-center bg-gray-100" readOnly
                    value={student.groupReport} />
                </td>
                <td className="p-3 text-center">
                  <input type="number" max="10" className="w-12 border rounded p-1 text-center"
                    value={student.regular} onChange={(e) => updateStudentScore(student.id, 'regular', e.target.value)} />
                </td>
                <td className="p-3 text-center">
                  <input type="number" max="10" className="w-12 border-2 border-yellow-300 rounded p-1 text-center font-bold"
                    value={student.midterm} onChange={(e) => updateStudentScore(student.id, 'midterm', e.target.value)} />
                </td>
                 <td className="p-3 text-center font-bold text-lg text-blue-700 bg-blue-50">
                    {calculateProcessScore(student)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-gray-500 italic">
        * Công thức: Điểm Quá Trình = (Chuyên cần + Thảo luận + Báo cáo + Thường xuyên + Giữa kỳ * 2) / 6
      </div>
    </Card>
  );

  // View: Tab Đánh Giá Chéo (Mới)
  const renderPeerReview = () => {
    return (
        <Card className="overflow-hidden">
            {/* Common Header Info for Peer Review */}
            <div className="p-6 bg-blue-50 border-b border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-1/2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Người đánh giá (Chọn tên bạn) <span className="text-red-500">*</span></label>
                    <select 
                        value={evaluator} 
                        onChange={(e) => setEvaluator(e.target.value)} 
                        className="w-full py-2 px-3 border border-gray-300 rounded focus:border-blue-500 outline-none shadow-sm"
                    >
                        <option value="">-- Chọn thành viên --</option>
                        {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.code})</option>)}
                        <option value="Giảng Viên">Giảng Viên / Khác</option>
                    </select>
                </div>
                <Button variant="outline" className="bg-white border-blue-500 text-blue-700 hover:bg-blue-100 mt-5 md:mt-0" onClick={() => setShowRubricModal(true)}>
                    <Info size={16}/> Xem Bảng Điểm (Rubric)
                </Button>
            </div>

            {/* Peer Review Navigation Tabs */}
            <div className="flex border-b text-sm md:text-base font-medium overflow-x-auto">
                <button onClick={() => setPeerRole('member')} className={`flex-1 py-3 px-4 text-center whitespace-nowrap border-b-2 flex items-center justify-center gap-2 ${peerRole === 'member' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-gray-100'}`}>
                    <UserCircle size={18}/> Tự Đánh Giá
                </button>
                <button onClick={() => setPeerRole('peer')} className={`flex-1 py-3 px-4 text-center whitespace-nowrap border-b-2 flex items-center justify-center gap-2 ${peerRole === 'peer' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-gray-100'}`}>
                    <ExchangeAlt size={18}/> Đánh Giá Chéo
                </button>
                <button onClick={() => setPeerRole('leader')} className={`flex-1 py-3 px-4 text-center whitespace-nowrap border-b-2 flex items-center justify-center gap-2 ${peerRole === 'leader' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-gray-100'}`}>
                    <UsersCog size={18}/> Nhóm Trưởng
                </button>
                <button onClick={() => setPeerRole('lecturer')} className={`flex-1 py-3 px-4 text-center whitespace-nowrap border-b-2 flex items-center justify-center gap-2 ${peerRole === 'lecturer' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 bg-gray-50 hover:bg-gray-100'}`}>
                    <ChalkboardTeacher size={18}/> Giảng Viên
                </button>
            </div>

            {/* Forms */}
            <div className="p-6">
                {/* Form 1: Member Self Eval */}
                {peerRole === 'member' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-blue-900">Tự Đánh Giá Cá Nhân (Theo Buổi Học)</h3>
                            <select value={peerWeek} onChange={(e) => setPeerWeek(e.target.value)} className="py-1.5 px-3 border border-gray-300 rounded text-sm font-bold text-gray-700 bg-white">
                                {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>Buổi {i+1}</option>)}
                            </select>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm mb-4 text-yellow-800">
                            <strong>Lưu ý:</strong> Điểm từ 0 - 2.5 cho mỗi tiêu chí (Tổng 10đ).
                        </div>
                        
                        {memberCriteriaData.map((crit, index) => (
                            <div key={index} className="border border-gray-200 p-4 rounded bg-white shadow-sm flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800">{crit.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{crit.desc}</p>
                                </div>
                                <div className="flex items-center bg-gray-50 p-2 rounded border">
                                    <label className="text-xs font-bold text-blue-800 uppercase mr-3">Điểm:</label>
                                    <input 
                                        type="number" step="0.5" min="0" max="2.5" 
                                        value={evaluationScores.member[`crit_${index}`] || ''}
                                        onChange={(e) => handleScoreChange('member', `crit_${index}`, e.target.value)}
                                        className="w-20 p-2 border rounded focus:border-blue-500 outline-none text-center font-bold text-lg text-blue-900 bg-white" 
                                        placeholder="0.0"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Form 2,3,4: Table Based (Peer, Leader, Lecturer) */}
                {peerRole !== 'member' && (
                    <div className="animate-fade-in">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-blue-900">
                                {peerRole === 'peer' ? 'Đánh Giá Chéo Sinh Viên' : peerRole === 'leader' ? 'Nhóm Trưởng Tổng Hợp' : 'Giảng Viên Đánh Giá'}
                            </h3>
                        </div>
                        
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 text-gray-700 font-bold text-xs">
                                    <tr>
                                        <th className="p-3 text-left min-w-[200px] border-b border-r bg-gray-100 sticky left-0 z-10">Tiêu chí \ Sinh viên</th>
                                        {students.map(s => {
                                            const parts = s.name.split(' ');
                                            const shortName = parts.length > 1 ? parts.slice(-2).join(' ') : s.name;
                                            return <th key={s.id} className="p-2 text-center w-28 min-w-[100px] border-b border-l border-gray-200">{shortName} <br/><span className="text-[10px] font-normal text-gray-500">N{s.group}</span></th>
                                        })}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {(peerRole === 'lecturer' ? lecturerCriteria : leaderCriteria).map((criteria, cIdx) => (
                                        <tr key={cIdx} className="hover:bg-gray-50 transition">
                                            <td className="p-3 text-sm text-gray-800 sticky left-0 bg-white border-r font-medium z-10">{criteria}</td>
                                            {students.map((s, sIdx) => (
                                                <td key={sIdx} className="p-1 text-center border-l border-gray-100">
                                                    <input 
                                                        type="number" step="0.5" min="0" max="2.5" 
                                                        value={evaluationScores[peerRole]?.[`m_${sIdx}_c_${cIdx}`] || ''}
                                                        onChange={(e) => handleScoreChange(peerRole, `m_${sIdx}_c_${cIdx}`, e.target.value)}
                                                        className="w-full p-2 text-center text-sm rounded bg-gray-50 hover:bg-blue-50 focus:bg-white border border-transparent focus:border-blue-300 outline-none font-bold text-gray-700" 
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-blue-50 font-bold text-blue-900 border-t-2 border-blue-200">
                                    <tr>
                                        <td className="p-3 text-right sticky left-0 bg-blue-50 border-r z-10">TỔNG CỘNG (10đ):</td>
                                        {students.map((s, sIdx) => {
                                            const total = calculatePeerTotal(peerRole, sIdx);
                                            return (
                                                <td key={sIdx} className={`p-2 text-center border-l border-blue-200 text-lg ${total > 10 ? 'text-red-600' : ''}`}>
                                                    {total}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {/* Bottom Actions for Peer Review */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center pt-6 mt-6 border-t border-gray-100">
                    <button onClick={handleClearPeerData} className="text-gray-400 hover:text-red-500 text-sm font-medium transition">
                        Xóa làm lại form này
                    </button>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button onClick={submitPeerEvaluation} disabled={isSyncingAll} className="w-full md:w-auto">
                            {isSyncingAll ? <Loader className="animate-spin" size={16}/> : <Save size={16}/>}
                            Gửi Phiếu Đánh Giá
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 pb-10">
      {renderStatusToast()}
      {renderRubricModal()}
      
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg"><Layout size={24} /></div>
            <div>
              <h1 className="font-bold text-xl leading-tight text-gray-900 hidden md:block">Hệ thống Quản lý GEO10065</h1>
              <h1 className="font-bold text-lg leading-tight text-gray-900 md:hidden">GEO10065</h1>
              <p className="text-xs text-gray-500">ThS. Đinh Quốc Tuấn</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Dropdown Chọn Buổi Học */}
             <div className="hidden sm:flex items-center bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
                <Calendar size={16} className="text-blue-600 mr-2"/>
                <select 
                  className="bg-transparent font-bold text-blue-800 text-sm outline-none cursor-pointer"
                  value={currentSessionIdx}
                  onChange={(e) => {
                    setCurrentSessionIdx(parseInt(e.target.value));
                    setCurrentStage(0);
                  }}
                >
                  {courseSessions.map((s, idx) => (
                    <option key={s.id} value={idx}>Buổi {s.id}</option>
                  ))}
                </select>
             </div>

             <div className="flex items-center gap-2">
               <input type="text" placeholder="Dán URL Web App (Script)..." 
                 className="text-xs border border-gray-300 rounded px-2 py-1.5 w-32 md:w-48 focus:outline-blue-500"
                 value={scriptUrl} onChange={(e) => setScriptUrl(e.target.value)}
               />
               <Button 
                  variant="success" 
                  onClick={handleSyncAll} 
                  disabled={isSyncingAll || !scriptUrl}
                  className="py-1.5 px-3 text-xs md:text-sm whitespace-nowrap"
                >
                  {isSyncingAll ? <Loader className="animate-spin" size={14}/> : <Save size={14}/>}
                  <span className="hidden md:inline">Đồng bộ</span>
               </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>
            <Layout size={16}/> Điều khiển
          </button>
          
          <button onClick={() => setActiveTab('attendance')} className={`px-4 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'attendance' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>
            <CheckSquare size={16}/> Điểm danh
          </button>

          <button onClick={() => setActiveTab('scoring')} className={`px-4 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'scoring' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>
            <Trophy size={16}/> Bảng Điểm (60%)
          </button>

          <button onClick={() => setActiveTab('peerReview')} className={`px-4 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'peerReview' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>
            <FileSpreadsheet size={16}/> Đánh Giá Chéo
          </button>
        </div>

        {/* CONTENT */}
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'attendance' && renderAttendance()}
          {activeTab === 'scoring' && renderScoring()}
          {activeTab === 'peerReview' && renderPeerReview()}
        </div>
      </main>
    </div>
  );
}
