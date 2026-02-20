import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, CheckSquare, Trophy, BookOpen, BarChart2, 
  Play, Pause, RotateCcw, HelpCircle, Layout, Globe, 
  CloudLightning, Link, Loader, Save, CheckCircle, AlertCircle, Calendar
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

// --- Main Application ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
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

  // --- TÍNH ĐIỂM QUÁ TRÌNH ---
  // Đề cương: CC(10%), TL(10%), BC(10%), TX(10%), GK(20%) -> Tổng 60%
  // Quy đổi hệ 10 Điểm Quá Trình = (CC + TL + BC + TX + GK*2) / 6
  const calculateProcessScore = (s) => {
    return ((s.attendance + s.discussion + s.groupReport + s.regular + (s.midterm * 2)) / 6).toFixed(1);
  };

  // --- HÀM GỬI DỮ LIỆU LÊN GOOGLE SHEET ---
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

  // --- ACTIONS ---
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

  // --- VIEWS ---
  const renderStatusToast = () => {
    if (!lastSyncStatus) return null;
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
        <CloudLightning size={16} className="text-yellow-400"/>
        {lastSyncStatus}
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

  const renderScoring = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><Trophy/> Bảng Điểm Quá Trình (60%)</h2>
        <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">
          Tự động đồng bộ Google Sheet
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

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 pb-10">
      {renderStatusToast()}
      
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg"><Layout size={24} /></div>
            <div>
              <h1 className="font-bold text-xl leading-tight text-gray-900 hidden md:block">Hệ thống Quản lý GEO10065</h1>
              <h1 className="font-bold text-lg leading-tight text-gray-900 md:hidden">GEO10065</h1>
              <p className="text-xs text-gray-500">ThS. Đinh Quốc Tuấn</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Dropdown Chọn Buổi Học */}
             <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
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

             <div className="hidden md:flex items-center gap-2">
               <Link size={14} className="text-gray-400"/>
               <input type="text" placeholder="URL Web App (Script)..." 
                 className="text-xs border border-gray-300 rounded px-2 py-1.5 w-48 focus:outline-blue-500"
                 value={scriptUrl} onChange={(e) => setScriptUrl(e.target.value)}
               />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* TABS */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>
            <Layout size={16}/> Điều khiển Lớp học
          </button>
          <button onClick={() => setActiveTab('scoring')} className={`px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'scoring' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>
            <Trophy size={16}/> Bảng Điểm Tổng Hợp
          </button>
        </div>

        {/* CONTENT */}
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'scoring' && renderScoring()}
        </div>
      </main>
    </div>
  );
}
