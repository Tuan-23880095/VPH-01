import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, CheckSquare, Trophy, BookOpen, 
  Play, Pause, RotateCcw, HelpCircle, Layout, 
  CloudLightning, Loader, Save, CheckCircle, Calendar, Info,
  User, Repeat, Monitor, FileText
} from 'lucide-react';

// --- Link Google Script cố định cho phần Đánh giá chéo (Sinh viên) ---
const PEER_REVIEW_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwKeTMSqe5fDYbjPS5JkhAaiHkwWYGDoOkCmvQXxp5LkInboOgZt4S7lXh_40D7VEl8wg/exec';

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

// --- DỮ LIỆU 12 BUỔI HỌC ---
const courseSessions = [
  { id: 1, title: "Buổi 1: Giới thiệu ĐCĐT & Vỏ phong hóa", duration: 150, stages: [{ id: 1, title: "Ổn định & Giới thiệu", time: 45, content: "Giới thiệu GV, Quy chế điểm (60/40), Chia nhóm." }, { id: 2, title: "Khái niệm (Chương 1)", time: 30, content: "Định nghĩa ĐCĐT, VPH, Mối quan hệ nguồn vật liệu." }, { id: 3, title: "VPH là thể địa chất", time: 60, content: "4 Quá trình phong hóa, Yếu tố ảnh hưởng, Phân đới." }, { id: 4, title: "Tổng kết & Đánh giá", time: 15, content: "Kiểm tra từ vựng (CHP7), Kahoot, Dặn dò." }] },
  { id: 2, title: "Buổi 2: Các yếu tố ảnh hưởng & Phân đới", duration: 150, stages: [{ id: 1, title: "Khởi động", time: 20, content: "Phân biệt Saprolit và Litoma." }, { id: 2, title: "Sự biến hình khoáng vật", time: 50, content: "Jigsaw: Felspat -> Kaolinit, Olivin -> Goethit." }, { id: 3, title: "Truy tìm nguyên tố", time: 50, content: "Phân tích bảng số liệu hóa học." }, { id: 4, title: "Đấu trường Kahoot", time: 30, content: "Trắc nghiệm các phản ứng hóa học." }] },
  { id: 3, title: "Buổi 3: Phân loại & Phương pháp nghiên cứu VPH", duration: 150, stages: [{ id: 1, title: "Phân loại VPH", time: 40, content: "Theo địa hóa: Sialit, Feralit, Alferit." }, { id: 2, title: "Phương pháp nghiên cứu", time: 40, content: "Thực địa: Lập mặt cắt chuẩn." }, { id: 3, title: "Trạm thực hành", time: 45, content: "Seminar: Thiết kế mặt cắt." }, { id: 4, title: "Thử thách Tam giác", time: 25, content: "Chấm thử điểm Si-Al-Fe." }] },
  { id: 4, title: "Buổi 4: Thực hành VPH", duration: 150, stages: [{ id: 1, title: "Hướng dẫn", time: 30, content: "Cung cấp số liệu." }, { id: 2, title: "Vẽ mặt cắt", time: 45, content: "Dựng cột địa tầng." }, { id: 3, title: "Định danh", time: 40, content: "Sử dụng biểu đồ tam giác." }, { id: 4, title: "Thu bài", time: 35, content: "Chấm chéo, thu bài." }] },
  { id: 5, title: "Buổi 5: Các loại VPH chính", duration: 150, stages: [{ id: 1, title: "Truy tìm", time: 20, content: "Matching Game." }, { id: 2, title: "Trạm chuyên gia", time: 60, content: "Phân tích VPH." }, { id: 3, title: "Case Study", time: 40, content: "Bí ẩn Bauxit." }, { id: 4, title: "Tổng kết", time: 30, content: "Chuẩn bị KT." }] },
  { id: 6, title: "Buổi 6: VPH Quặng hóa & Kiểm tra", duration: 150, stages: [{ id: 1, title: "Data Mining", time: 20, content: "Phân tích biểu đồ." }, { id: 2, title: "Mini-Project", time: 40, content: "Tính Msi." }, { id: 3, title: "Hệ thống", time: 30, content: "Mindmap." }, { id: 4, title: "Kiểm tra", time: 60, content: "Thi trắc nghiệm/Tự luận." }] },
  { id: 7, title: "Buổi 7: Đại cương Trầm tích Đệ tứ", duration: 150, stages: [{ id: 1, title: "Khởi động", time: 20, content: "Phân biệt TTĐT." }, { id: 2, title: "Chu kỳ Băng hà", time: 40, content: "Mối quan hệ." }, { id: 3, title: "Quan sát", time: 60, content: "Đánh giá độ hạt." }, { id: 4, title: "Giải mã", time: 30, content: "Kahoot." }] },
  { id: 8, title: "Buổi 8: Phân loại & PP Nghiên cứu TTĐT", duration: 150, stages: [{ id: 1, title: "Định danh", time: 20, content: "Kích thước hạt." }, { id: 2, title: "Biểu đồ Folk", time: 50, content: "G-S-M và S-Z-C." }, { id: 3, title: "Thực địa-Lab", time: 50, content: "Lấy mẫu." }, { id: 4, title: "Xử lý", time: 30, content: "Tính So." }] },
  { id: 9, title: "Buổi 9: Thực hành Xử lý số liệu TTĐT", duration: 150, stages: [{ id: 1, title: "Đoán hình", time: 20, content: "Đường cong." }, { id: 2, title: "Công nghệ", time: 40, content: "Excel." }, { id: 3, title: "Thực hành", time: 60, content: "Tính Q, Md." }, { id: 4, title: "Thu bài", time: 30, content: "Nộp file." }] },
  { id: 10, title: "Buổi 10: Trầm tích Lục địa & Biển", duration: 150, stages: [{ id: 1, title: "Địa mạo", time: 20, content: "Phân tích." }, { id: 2, title: "Seminar", time: 70, content: "Trình bày nhóm." }, { id: 3, title: "Đối sánh", time: 30, content: "Mẫu câm." }, { id: 4, title: "Tổng kết", time: 30, content: "Từ khóa." }] },
  { id: 11, title: "Buổi 11: TT Hỗn hợp/Gió & Báo cáo", duration: 150, stages: [{ id: 1, title: "Delta & Vịnh", time: 30, content: "Tranh chấp." }, { id: 2, title: "TT Gió", time: 30, content: "Cát đỏ." }, { id: 3, title: "Poster", time: 60, content: "Hội thảo." }, { id: 4, title: "Phản biện", time: 30, content: "Chấm điểm." }] },
  { id: 12, title: "Buổi 12: Tổng kết & Ôn tập", duration: 150, stages: [{ id: 1, title: "Từ khóa", time: 20, content: "Slido." }, { id: 2, title: "Game", time: 50, content: "Đấu trường." }, { id: 3, title: "Giải mã", time: 40, content: "Luyện kỹ năng." }, { id: 4, title: "Công bố", time: 40, content: "Minh bạch điểm." }] }
];

// --- TIÊU CHÍ ĐÁNH GIÁ CHÉO ---
const criteriaTeamwork = [
  "1. THAM DỰ & PHỐI HỢP (0-2.5đ)",
  "2. QUẢN LÝ CÔNG VIỆC (0-2.5đ)",
  "3. GIAO TIẾP & HỖ TRỢ (0-2.5đ)",
  "4. ĐÓNG GÓP NỘI DUNG (0-2.5đ)"
];

const criteriaDiscussion = [
  "1. TÍCH CỰC PHÁT BIỂU (0-2.5đ)",
  "2. CHẤT LƯỢNG Ý KIẾN (0-2.5đ)",
  "3. TƯƠNG TÁC PHẢN BIỆN (0-2.5đ)",
  "4. THÁI ĐỘ LẮNG NGHE (0-2.5đ)"
];

// --- Main Application ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  // Trạng thái buổi học hiện tại
  const [currentSessionIdx, setCurrentSessionIdx] = useState(0);
  const currentSession = courseSessions[currentSessionIdx];
  const [currentStage, setCurrentStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(courseSessions[0].stages[0].time * 60);
  const [timerActive, setTimerActive] = useState(false);

  // Google Sheet Integration (Dành cho Giảng Viên)
  const [scriptUrl, setScriptUrl] = useState(() => localStorage.getItem('GEO_CLASS_SCRIPT_URL') || '');
  const [lastSyncStatus, setLastSyncStatus] = useState(null); 
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  useEffect(() => {
    localStorage.setItem('GEO_CLASS_SCRIPT_URL', scriptUrl);
  }, [scriptUrl]);

  useEffect(() => {
    setTimeLeft(currentSession.stages[currentStage].time * 60);
    setTimerActive(false);
  }, [currentSessionIdx, currentStage]);

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) setTimerActive(false);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // --- DỮ LIỆU SINH VIÊN (Cập nhật theo bảng mới nhất) ---
  const [students, setStudents] = useState([
    { id: 1, name: "LÂM YẾN NHI", code: "23160019", group: 1, role: "NT", groupName: "1 Cá Vàng", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 2, name: "NGUYỄN LÊ THẢO TIÊN", code: "23160007", group: 1, role: "", groupName: "1 Cá Vàng", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 3, name: "PHÙNG THỊ TRÚC ĐÀO", code: "23160011", group: 1, role: "", groupName: "1 Cá Vàng", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 4, name: "TRẦN THỊ NHƯ HẢO", code: "23160002", group: 1, role: "", groupName: "1 Cá Vàng", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 5, name: "ĐỖ NGUYỄN XUÂN THANH", code: "23160004", group: 2, role: "", groupName: "Trà Tam Hảo", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 6, name: "LÝ NGỌC TƯỜNG VÂN", code: "23160006", group: 2, role: "", groupName: "Trà Tam Hảo", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 7, name: "NGUYỄN THỊ THANH THẢO", code: "23160022", group: 2, role: "NT", groupName: "Trà Tam Hảo", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 8, name: "NGUYỄN MINH CHÍ", code: "23160009", group: 3, role: "", groupName: "Trai Đẹp", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 9, name: "PHẠM GIA PHONG", code: "23160020", group: 3, role: "", groupName: "Trai Đẹp", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 10, name: "VÕ TRẦN TIẾN HUY", code: "23160015", group: 3, role: "", groupName: "Trai Đẹp", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 11, name: "VŨ ĐÌNH KHOA", code: "23160016", group: 3, role: "NT", groupName: "Trai Đẹp", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 12, name: "DƯƠNG QUỲNH ANH", code: "23160008", group: 4, role: "NT", groupName: "Phúc Lộc Thọ", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 13, name: "NGUYỄN HỮU HOÀN", code: "23160012", group: 4, role: "", groupName: "Phúc Lộc Thọ", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
    { id: 14, name: "VŨ HOÀNG ANH THƯ", code: "23160024", group: 4, role: "", groupName: "Phúc Lộc Thọ", attendance: 10, discussion: 0, groupReport: 0, regular: 0, midterm: 0 },
  ]);

  // Các state tiện ích lớp học
  const [groupReportInputs, setGroupReportInputs] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [pickedStudent, setPickedStudent] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
// === BẮT ĐẦU: ĐOẠN CODE BỔ SUNG CÁC HÀM BỊ THIẾU ===

  // 1. Hàm format thời gian đếm ngược
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 2. Hàm gọi ngẫu nhiên sinh viên
  const pickRandomStudent = () => {
    if (isRolling) return;
    setIsRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * students.length);
      setPickedStudent(students[randomIdx]);
      counter++;
      if (counter > 15) { // Quay 15 lần rồi dừng
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 100);
  };

  // 3. Hàm cập nhật điểm cá nhân (Chuyên cần, Thảo luận, GK...)
  const updateStudentScore = (id, field, val) => {
    let numVal = parseFloat(val);
    if (isNaN(numVal)) numVal = 0;
    if (numVal > 10) numVal = 10;
    if (numVal < 0) numVal = 0;

    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: numVal } : s
    ));
  };

  // 4. Hàm chấm điểm nhóm nhanh (Cập nhật cho tất cả SV trong nhóm)
  const updateGroupReportScore = (groupId, val) => {
    let numVal = parseFloat(val);
    if (isNaN(numVal)) numVal = 0;
    if (numVal > 10) numVal = 10;
    if (numVal < 0) numVal = 0;

    setGroupReportInputs(prev => ({ ...prev, [groupId]: numVal }));
    setStudents(prev => prev.map(s => 
      s.group === parseInt(groupId) ? { ...s, groupReport: numVal } : s
    ));
  };

  // 5. Hàm điểm danh nhanh bằng nút gạt
  const toggleAttendance = (id) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, attendance: s.attendance > 0 ? 0 : 10 } : s
    ));
  };

  // === KẾT THÚC: ĐOẠN CODE BỔ SUNG ===
  // --- STATE CHO ĐÁNH GIÁ CHÉO (MỚI) ---
  const [evaluator, setEvaluator] = useState("");
  const [evalType, setEvalType] = useState('teamwork'); // 'teamwork' | 'discussion'
  const [targetGroup, setTargetGroup] = useState(1); // 1, 2, 3, 4
  const [showRubricModal, setShowRubricModal] = useState(false);
  
  // Lưu điểm dưới dạng dictionary: key = `${evalType}_${studentCode}_${criteriaIndex}`
  const [peerScores, setPeerScores] = useState({});

  // Lọc sinh viên thuộc nhóm đang được chọn để đánh giá
  const targetStudents = students.filter(s => s.group === targetGroup);
  const currentCriteria = evalType === 'teamwork' ? criteriaTeamwork : criteriaDiscussion;

  // --- TÍNH ĐIỂM QUÁ TRÌNH LỚP HỌC ---
  const calculateProcessScore = (s) => {
    return ((s.attendance + s.discussion + s.groupReport + s.regular + (s.midterm * 2)) / 6).toFixed(1);
  };

  // --- HÀM GỬI LÊN SHEET GIẢNG VIÊN ---
  const sendStudentData = useCallback(async (student) => {
    if (!scriptUrl) return;
    const payload = {
      role: "Cập nhật Điểm Quá trình", evaluator: "ThS. Đinh Quốc Tuấn",
      groupName: `${student.name} (${student.code})`, comment: "Cập nhật từ App Hệ thống",
      headers: ["MSSV", "Nhóm", "Chuyên cần (10%)", "Thảo luận (10%)", "Báo cáo (10%)", "Thường xuyên (10%)", "Giữa kỳ (20%)", "Điểm Quá Trình (Hệ 10)"],
      scores: [student.code, `Nhóm ${student.group}`, student.attendance, student.discussion, student.groupReport, student.regular, student.midterm, calculateProcessScore(student)]
    };
    try {
      await fetch(scriptUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setLastSyncStatus(`Đã lưu: ${student.name}`);
      setTimeout(() => setLastSyncStatus(null), 3000);
    } catch (error) { setLastSyncStatus("Lỗi kết nối!"); }
  }, [scriptUrl]);

  const handleSyncAll = async () => {
    if (!scriptUrl) { setLastSyncStatus("Vui lòng nhập URL Web App GV trước!"); setTimeout(() => setLastSyncStatus(null), 3000); return; }
    setIsSyncingAll(true); setLastSyncStatus("Đang đồng bộ toàn bộ lớp học...");
    try {
      const promises = students.map(student => {
        const payload = {
          role: "Đồng bộ Toàn lớp", evaluator: "ThS. Đinh Quốc Tuấn", groupName: `${student.name} (${student.code})`, comment: "Cập nhật đồng loạt",
          headers: ["MSSV", "Nhóm", "Chuyên cần (10%)", "Thảo luận (10%)", "Báo cáo (10%)", "Thường xuyên (10%)", "Giữa kỳ (20%)", "Điểm Quá Trình (Hệ 10)"],
          scores: [student.code, `Nhóm ${student.group}`, student.attendance, student.discussion, student.groupReport, student.regular, student.midterm, calculateProcessScore(student)]
        };
        return fetch(scriptUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      });
      await Promise.all(promises);
      setLastSyncStatus(`Đã đồng bộ thành công ${students.length} sinh viên!`);
    } catch (error) { setLastSyncStatus("Có lỗi xảy ra khi đồng bộ!"); } 
    finally { setIsSyncingAll(false); setTimeout(() => setLastSyncStatus(null), 4000); }
  };


  // --- HÀM CHO ĐÁNH GIÁ CHÉO ---
  const handlePeerScoreChange = (studentCode, cIdx, val) => {
    const key = `${evalType}_${studentCode}_${cIdx}`;
    if (val === '') {
        setPeerScores(prev => ({ ...prev, [key]: '' }));
        return;
    }
    let numVal = parseFloat(val);
    if(isNaN(numVal)) numVal = 0;
    if(numVal > 2.5) numVal = 2.5;
    if(numVal < 0) numVal = 0;

    setPeerScores(prev => ({ ...prev, [key]: numVal }));
  };

  const getPeerTotal = (studentCode) => {
    let total = 0;
    for (let i = 0; i < currentCriteria.length; i++) {
        total += (parseFloat(peerScores[`${evalType}_${studentCode}_${i}`]) || 0);
    }
    return total.toFixed(1);
  };

  const submitPeerEvaluation = async () => {
    if (!evaluator) {
        alert("Vui lòng chọn Tên của bạn ở mục 'Người đánh giá' trước khi gửi!");
        return;
    }

    setIsSyncingAll(true);
    
    // Tìm thông tin nhóm đang đánh giá
    const tGroupInfo = targetStudents[0];
    const groupLabel = tGroupInfo ? `Nhóm ${targetGroup} - ${tGroupInfo.groupName}` : `Nhóm ${targetGroup}`;
    const evalLabel = evalType === 'teamwork' ? 'Đánh Giá Làm Việc Nhóm' : 'Đánh Giá Thảo Luận Lớp';

    let payload = {
        role: "Sinh Viên Đánh Giá Chéo",
        groupName: groupLabel,
        evaluator: evaluator,
        comment: evalLabel,
        headers: ["Tiêu chí", ...targetStudents.map(s => s.name)],
        scores: []
    };

    // Gửi Tổng điểm thay vì từng tiêu chí chi tiết cho gọn file CSV của GV
    payload.scores.push("Tổng điểm");
    for(let i=0; i < targetStudents.length; i++) {
        payload.scores.push(getPeerTotal(targetStudents[i].code));
    }

    try {
        await fetch(PEER_REVIEW_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        alert(`Đã gửi phiếu Đánh giá ${groupLabel} thành công!`);
    } catch (error) {
        alert("Lỗi kết nối mạng khi gửi dữ liệu đánh giá!");
    } finally {
        setIsSyncingAll(false);
    }
  };

  const handleClearPeerData = () => {
    if(window.confirm("Bạn có chắc chắn muốn xóa nháp của trang đánh giá hiện tại?")) {
        const newScores = { ...peerScores };
        // Chỉ xóa dữ liệu của loại đánh giá và nhóm đang hiển thị
        targetStudents.forEach(s => {
            currentCriteria.forEach((_, cIdx) => {
                delete newScores[`${evalType}_${s.code}_${cIdx}`];
            });
        });
        setPeerScores(newScores);
    }
  }


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

  const renderRubricModal = () => {
      if (!showRubricModal) return null;
      return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                  <div className="p-4 border-b flex justify-between items-center bg-blue-50 rounded-t-lg">
                      <h3 className="text-xl font-bold text-blue-900 flex items-center"><BookOpen className="mr-2"/>Hướng dẫn Đánh giá & Tiêu chí</h3>
                      <button onClick={() => setShowRubricModal(false)} className="text-gray-500 hover:text-red-600 font-bold text-xl">&times;</button>
                  </div>
                  <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-700 space-y-6">
                      
                      <div>
                          <h2 className="font-bold text-lg text-purple-800 mb-2 border-b border-purple-200 pb-2">1. TIÊU CHÍ LÀM VIỆC NHÓM (Dành cho thành viên cùng nhóm/nhóm khác)</h2>
                          <table className="w-full border-collapse">
                              <thead>
                                  <tr className="bg-purple-100 text-purple-900 text-left">
                                      <th className="p-2 border border-purple-200 w-1/4">Tiêu chí (Max 2.5đ)</th>
                                      <th className="p-2 border border-purple-200">Mô tả (Mức 1 -> Mức 3)</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr><td className="p-2 border font-medium">Tham dự & Phối hợp</td><td className="p-2 border">Vắng/Không tương tác (0-1đ) -> Tham gia đầy đủ, nhiệt tình (2-2.5đ)</td></tr>
                                  <tr><td className="p-2 border font-medium">Quản lý công việc</td><td className="p-2 border">Hay trễ hạn (0-1đ) -> Đúng hạn, hỗ trợ người khác (2-2.5đ)</td></tr>
                                  <tr><td className="p-2 border font-medium">Giao tiếp & Hỗ trợ</td><td className="p-2 border">Phản hồi chậm, gây rối (0-1đ) -> Giao tiếp tích cực, đoàn kết (2-2.5đ)</td></tr>
                                  <tr><td className="p-2 border font-medium">Đóng góp nội dung</td><td className="p-2 border">Nội dung sơ sài, copy (0-1đ) -> Đóng góp chất lượng cao (2-2.5đ)</td></tr>
                              </tbody>
                          </table>
                      </div>

                      <div>
                          <h2 className="font-bold text-lg text-blue-800 mb-2 border-b border-blue-200 pb-2">2. TIÊU CHÍ THẢO LUẬN TRÊN LỚP (Dành cho Seminar/Hỏi đáp)</h2>
                          <table className="w-full border-collapse">
                              <thead>
                                  <tr className="bg-blue-100 text-blue-900 text-left">
                                      <th className="p-2 border border-blue-200 w-1/4">Tiêu chí (Max 2.5đ)</th>
                                      <th className="p-2 border border-blue-200">Mô tả (Mức 1 -> Mức 3)</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr><td className="p-2 border font-medium">Tích cực phát biểu</td><td className="p-2 border">Ít nói, thụ động (0-1đ) -> Chủ động giơ tay nhiều lần (2-2.5đ)</td></tr>
                                  <tr><td className="p-2 border font-medium">Chất lượng ý kiến</td><td className="p-2 border">Hỏi/đáp lạc đề (0-1đ) -> Ý kiến sâu sắc, liên hệ thực tế (2-2.5đ)</td></tr>
                                  <tr><td className="p-2 border font-medium">Tương tác phản biện</td><td className="p-2 border">Chỉ đọc tài liệu (0-1đ) -> Đặt câu hỏi hay, phản biện logic (2-2.5đ)</td></tr>
                                  <tr><td className="p-2 border font-medium">Thái độ lắng nghe</td><td className="p-2 border">Làm việc riêng (0-1đ) -> Tôn trọng, ghi chép cẩn thận (2-2.5đ)</td></tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
                  <div className="p-4 border-t bg-gray-50 text-right">
                      <Button variant="secondary" onClick={() => setShowRubricModal(false)}>Đã hiểu & Đóng</Button>
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
          <div className="text-xl font-bold text-purple-900 truncate">{currentSession.stages[currentStage].title}</div>
        </Card>
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="text-sm text-orange-600 font-semibold mb-1">Đếm ngược (Phút)</div>
          <div className="text-3xl font-bold font-mono text-orange-900">{formatTime(timeLeft)}</div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setTimerActive(!timerActive)} className="p-1 rounded hover:bg-orange-200">{timerActive ? <Pause size={16}/> : <Play size={16}/>}</button>
            <button onClick={() => setTimeLeft(currentSession.stages[currentStage].time * 60)} className="p-1 rounded hover:bg-orange-200"><RotateCcw size={16}/></button>
          </div>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-sm text-blue-600 font-semibold mb-1">Sĩ số (Điểm danh 10%)</div>
          <div className="text-3xl font-bold text-blue-900">{students.filter(s => s.attendance > 0).length} / {students.length}</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><BookOpen size={20} /> Tiến trình {currentSession.title}</h3>
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          {currentSession.stages.map((stage, index) => (
            <button key={stage.id} onClick={() => setCurrentStage(index)} className={`flex-1 p-3 rounded-lg border text-left transition-all ${currentStage === index ? 'bg-blue-600 text-white shadow-md' : 'bg-white hover:bg-gray-50'}`}>
              <div className="text-xs opacity-75">{stage.time} Phút</div>
              <div className="font-semibold text-sm line-clamp-2">{stage.title}</div>
            </button>
          ))}
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-gray-800 font-medium">👉 {currentSession.stages[currentStage].content}</div>
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
               {pickedStudent && (<Button variant="success" onClick={() => updateStudentScore(pickedStudent.id, 'discussion', pickedStudent.discussion + 1)}>+1đ Thảo luận</Button>)}
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
                    <input type="number" max="10" className="w-14 border rounded p-1 text-center font-bold text-green-700" value={groupReportInputs[g]} onChange={(e) => updateGroupReportScore(g, e.target.value)} />
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
        <Button onClick={() => {
            const updated = students.map(s => ({...s, attendance: 10}));
            setStudents(updated);
            setLastSyncStatus("Đã đánh dấu Có mặt tất cả (Nhớ bấm nút Đồng bộ)");
            setTimeout(() => setLastSyncStatus(null), 3000);
        }}>Có mặt tất cả</Button>
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
                <td className="p-3 font-medium">{student.name} {student.role === 'NT' && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded ml-1 border border-yellow-300">NT</span>}</td>
                <td className="p-3"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Nhóm {student.group}</span></td>
                <td className="p-3 text-center"><span className={`px-2 py-1 rounded text-sm ${student.attendance > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{student.attendance > 0 ? 'Có mặt (10đ)' : 'Vắng (0đ)'}</span></td>
                <td className="p-3 text-center">
                  <button onClick={() => toggleAttendance(student.id)} className={`w-10 h-6 rounded-full transition-colors relative ${student.attendance > 0 ? 'bg-green-500' : 'bg-gray-300'}`}>
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
        <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">Dữ liệu sẽ được tự động lưu khi chỉnh sửa</div>
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
                  <div className="text-xs text-gray-500">N{student.group} | {student.code}</div>
                </td>
                <td className="p-3 text-center"><input type="number" max="10" className="w-12 border rounded p-1 text-center" value={student.attendance} onChange={(e) => updateStudentScore(student.id, 'attendance', e.target.value)} /></td>
                <td className="p-3 text-center"><input type="number" max="10" className="w-12 border rounded p-1 text-center" value={student.discussion} onChange={(e) => updateStudentScore(student.id, 'discussion', e.target.value)} /></td>
                <td className="p-3 text-center"><input type="number" max="10" className="w-12 border rounded p-1 text-center bg-gray-100" readOnly value={student.groupReport} /></td>
                <td className="p-3 text-center"><input type="number" max="10" className="w-12 border rounded p-1 text-center" value={student.regular} onChange={(e) => updateStudentScore(student.id, 'regular', e.target.value)} /></td>
                <td className="p-3 text-center"><input type="number" max="10" className="w-12 border-2 border-yellow-300 rounded p-1 text-center font-bold" value={student.midterm} onChange={(e) => updateStudentScore(student.id, 'midterm', e.target.value)} /></td>
                 <td className="p-3 text-center font-bold text-lg text-blue-700 bg-blue-50">{calculateProcessScore(student)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // View: Tab Đánh Giá Chéo (LÀM LẠI THEO YÊU CẦU MỚI)
  const renderPeerReview = () => {
    return (
        <Card className="overflow-hidden border-2 border-purple-300 shadow-lg">
            {/* Header Form */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-white border-b border-purple-100 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-purple-900 flex items-center"><Users className="mr-2"/> Form Đánh Giá Sinh Viên</h2>
                    <Button variant="outline" className="bg-white border-purple-500 text-purple-700 hover:bg-purple-100 text-xs py-1" onClick={() => setShowRubricModal(true)}>
                        <Info size={14}/> Tiêu chí
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* B1. Chọn người đánh giá */}
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">1. Tên của bạn <span className="text-red-500">*</span></label>
                        <select value={evaluator} onChange={(e) => setEvaluator(e.target.value)} className="w-full py-1.5 px-2 border-b-2 border-purple-400 outline-none text-purple-900 font-bold bg-transparent">
                            <option value="">-- Click chọn --</option>
                            {students.map(s => <option key={s.id} value={`${s.name} (${s.code})`}>{s.name}</option>)}
                            <option value="Giảng Viên / Khách">Giảng Viên / Khác</option>
                        </select>
                    </div>

                    {/* B2. Chọn loại đánh giá */}
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">2. Loại đánh giá <span className="text-red-500">*</span></label>
                        <select value={evalType} onChange={(e) => setEvalType(e.target.value)} className="w-full py-1.5 px-2 border-b-2 border-blue-400 outline-none text-blue-900 font-bold bg-transparent">
                            <option value="teamwork">Làm Việc Nhóm (Quá trình)</option>
                            <option value="discussion">Thảo Luận Lớp (Seminar/Hỏi đáp)</option>
                        </select>
                    </div>

                    {/* B3. Chọn nhóm để đánh giá */}
                    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">3. Nhóm được đánh giá <span className="text-red-500">*</span></label>
                        <select value={targetGroup} onChange={(e) => setTargetGroup(parseInt(e.target.value))} className="w-full py-1.5 px-2 border-b-2 border-green-400 outline-none text-green-900 font-bold bg-transparent">
                            <option value={1}>Nhóm 1 - 1 Cá Vàng (4 SV)</option>
                            <option value={2}>Nhóm 2 - Trà Tam Hảo (3 SV)</option>
                            <option value={3}>Nhóm 3 - Trai Đẹp (4 SV)</option>
                            <option value={4}>Nhóm 4 - Phúc Lộc Thọ (3 SV)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bảng chấm điểm động */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4 bg-blue-50 p-3 rounded text-blue-800 text-sm border border-blue-100">
                    <CheckCircle size={16} className="text-green-600"/>
                    <span>Đang hiển thị bảng điểm <strong>{evalType === 'teamwork' ? 'Làm Việc Nhóm' : 'Thảo Luận Trên Lớp'}</strong> cho <strong>Nhóm {targetGroup}</strong>. Điểm tối đa mỗi ô: <strong>2.5đ</strong></span>
                </div>
                
                <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-800 text-white font-bold text-xs">
                            <tr>
                                <th className="p-3 text-left min-w-[200px] border-r border-gray-600">TIÊU CHÍ \ SINH VIÊN</th>
                                {targetStudents.map(s => {
                                    const parts = s.name.split(' ');
                                    const shortName = parts.length > 1 ? parts.slice(-2).join(' ') : s.name;
                                    return (
                                        <th key={s.id} className="p-2 text-center w-28 min-w-[100px] border-l border-gray-600">
                                            <div className="text-sm">{shortName}</div>
                                            <div className="text-[10px] text-gray-300 font-normal mt-0.5">{s.code} {s.role === 'NT' && <span className="bg-yellow-400 text-yellow-900 px-1 rounded ml-1">NT</span>}</div>
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentCriteria.map((criteria, cIdx) => (
                                <tr key={cIdx} className="hover:bg-purple-50 transition">
                                    <td className="p-3 text-xs md:text-sm text-gray-800 bg-gray-50 border-r font-medium">{criteria}</td>
                                    {targetStudents.map(s => (
                                        <td key={s.id} className="p-1.5 text-center border-l border-gray-100">
                                            <input 
                                                type="number" step="0.5" min="0" max="2.5" 
                                                value={peerScores[`${evalType}_${s.code}_${cIdx}`] ?? ''}
                                                onChange={(e) => handlePeerScoreChange(s.code, cIdx, e.target.value)}
                                                className="w-full p-2 text-center text-sm md:text-base rounded focus:bg-white border border-gray-300 focus:border-purple-500 outline-none font-bold text-purple-900" 
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-purple-100 font-bold text-purple-900 border-t-2 border-purple-300">
                            <tr>
                                <td className="p-3 text-right border-r uppercase text-xs md:text-sm">Tổng Điểm (Max 10đ):</td>
                                {targetStudents.map(s => {
                                    const total = getPeerTotal(s.code);
                                    return (
                                        <td key={s.id} className={`p-2 text-center border-l border-purple-200 text-lg ${total > 10 ? 'text-red-600' : ''}`}>
                                            {total}
                                        </td>
                                    )
                                })}
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center pt-6 mt-6 border-t border-gray-200">
                    <button onClick={handleClearPeerData} className="text-gray-400 hover:text-red-500 text-sm font-medium transition">
                        Xóa làm lại bảng này
                    </button>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button onClick={submitPeerEvaluation} disabled={isSyncingAll} className="w-full md:w-auto bg-purple-700 hover:bg-purple-800 text-white shadow-lg py-3 px-6 text-base">
                            {isSyncingAll ? <Loader className="animate-spin" size={20}/> : <Save size={20}/>}
                            Gửi Bảng Đánh Giá Nhóm {targetGroup}
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
      
      {/* HEADER DÀNH CHO GIẢNG VIÊN */}
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
             <div className="hidden sm:flex items-center bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
                <Calendar size={16} className="text-blue-600 mr-2"/>
                <select className="bg-transparent font-bold text-blue-800 text-sm outline-none cursor-pointer" value={currentSessionIdx} onChange={(e) => { setCurrentSessionIdx(parseInt(e.target.value)); setCurrentStage(0); }}>
                  {courseSessions.map((s, idx) => <option key={s.id} value={idx}>Buổi {s.id}</option>)}
                </select>
             </div>

             <div className="flex items-center gap-2">
               <input type="text" placeholder="Link App Script (Chỉ GV)" className="text-xs border border-gray-300 rounded px-2 py-1.5 w-24 md:w-40 focus:outline-blue-500" value={scriptUrl} onChange={(e) => setScriptUrl(e.target.value)} title="Chỉ dành cho Giảng Viên đồng bộ bảng điểm chính" />
               <Button variant="success" onClick={handleSyncAll} disabled={isSyncingAll || !scriptUrl} className="py-1.5 px-3 text-xs md:text-sm whitespace-nowrap" title="Đồng bộ điểm lớp học lên Sheet GV">
                  {isSyncingAll ? <Loader className="animate-spin" size={14}/> : <Save size={14}/>}
                  <span className="hidden md:inline">Đồng bộ Lớp</span>
               </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* MENU */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>
            <Layout size={16}/> Điều khiển
          </button>
          <button onClick={() => setActiveTab('attendance')} className={`px-4 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'attendance' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>
            <CheckSquare size={16}/> Điểm danh
          </button>
          <button onClick={() => setActiveTab('scoring')} className={`px-4 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'scoring' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>
            <Trophy size={16}/> Điểm GV (60%)
          </button>
          <button onClick={() => setActiveTab('peerReview')} className={`px-4 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'peerReview' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200 border border-purple-200'}`}>
            <Users size={16} className={activeTab === 'peerReview' ? 'text-white' : 'text-purple-600'}/> SV Đánh Giá Chéo
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
