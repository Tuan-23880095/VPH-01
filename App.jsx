import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CheckSquare, 
  Trophy, 
  BookOpen, 
  BarChart2, 
  Play, 
  Pause, 
  RotateCcw,
  UserPlus,
  Save,
  HelpCircle,
  Layout,
  Award,
  Globe,
  MessageCircle,
  CloudLightning,
  Link,
  Loader
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
    danger: "bg-red-50 text-red-600 hover:bg-red-100 disabled:bg-red-50",
    outline: "border-2 border-gray-200 text-gray-600 hover:border-gray-300 bg-transparent"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Main Application ---

export default function App() {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Google Script Integration State
  const [scriptUrl, setScriptUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  // Lesson Data updated based on "buoi 1" file
  const lessonPlan = {
    title: "Buổi 1: Giới thiệu ĐCĐT & Vỏ phong hóa",
    duration: 150, // minutes
    stages: [
      { 
        id: 1, 
        title: "1. Ổn định & Giới thiệu", 
        time: 45, 
        content: "Giới thiệu GV, Giáo trình, Quy chế điểm (60/40), Chia nhóm.",
        detail: "Điểm quá trình 60%: GK(20%), TX(10%), TL(10%), BC(10%), CC(10%)."
      },
      { 
        id: 2, 
        title: "2. Khái niệm cơ bản (Chương 1)", 
        time: 30, 
        content: "Định nghĩa ĐCĐT (2.6tr năm), VPH (tại chỗ), Mối quan hệ nguồn vật liệu." 
      },
      { 
        id: 3, 
        title: "3. VPH là thể địa chất (Chương 2)", 
        time: 60, 
        content: "4 Quá trình phong hóa, Yếu tố ảnh hưởng (Đá, Khí hậu...), Phân đới (Laterit -> Đá gốc)." 
      },
      { 
        id: 4, 
        title: "4. Tổng kết & English Test", 
        time: 15, 
        content: "Kiểm tra từ vựng (CHP7), Dặn dò chuẩn bị Chương 3." 
      }
    ]
  };

  // English Quiz Data
  const englishQuiz = [
    { q: "Material formed by breakdown of rocks remaining in situ?", a: "B. Weathering Crust" },
    { q: "Quaternary Geology focuses on the last...?", a: "B. 2.6 million years" },
    { q: "Glacial cycles are periods of warm climate?", a: "False (Glacial = Cold)" },
    { q: "Fill in blank: Unconsolidated rock material... NOT transported?", a: "Weathering crust" }
  ];
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Student Data (Updated List & Structure)
  const [students, setStudents] = useState([
    { id: 1, name: "TRẦN THỊ NHƯ HẢO", code: "23160002", group: 1, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 2, name: "ĐỖ NGUYỄN XUÂN THANH", code: "23160004", group: 2, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 3, name: "LÝ NGỌC TƯỜNG VÂN", code: "23160006", group: 3, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 4, name: "NGUYỄN LÊ THẢO TIÊN", code: "23160007", group: 4, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 5, name: "DƯƠNG QUỲNH ANH", code: "23160008", group: 1, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 6, name: "NGUYỄN MINH CHÍ", code: "23160009", group: 2, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 7, name: "PHÙNG THỊ TRÚC ĐÀO", code: "23160011", group: 3, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 8, name: "NGUYỄN HỮU HOÀN", code: "23160012", group: 4, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 9, name: "VÕ TRẦN TIẾN HUY", code: "23160015", group: 1, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 10, name: "VŨ ĐÌNH KHOA", code: "23160016", group: 2, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 11, name: "LÂM YẾN NHI", code: "23160019", group: 3, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 12, name: "PHẠM GIA PHONG", code: "23160020", group: 4, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 13, name: "NGUYỄN THỊ THANH THẢO", code: "23160022", group: 1, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
    { id: 14, name: "VŨ HOÀNG ANH THƯ", code: "23160024", group: 2, attendance: false, discussion: 0, groupReport: 0, regular: 0 },
  ]);

  // Group Report Scores
  const [groupReportInputs, setGroupReportInputs] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });

  // Timer State
  const [timeLeft, setTimeLeft] = useState(lessonPlan.stages[0].time * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  // Random Picker State
  const [pickedStudent, setPickedStudent] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  // --- Effects ---
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // --- Google Sheet Sync Logic ---
  
  const handleSyncToSheet = async () => {
    if (!scriptUrl) {
      setSyncStatus({ type: 'error', message: 'Vui lòng nhập Web App URL trước!' });
      return;
    }
    
    setIsSyncing(true);
    setSyncStatus(null);
    let successCount = 0;
    
    // We will loop through all students and send requests
    // Note: In a real app, you might want to batch this or change the API to accept an array.
    // Based on the provided script, it handles one row append per request.
    
    try {
      // Create an array of promises to send data in parallel (or sequential if preferred)
      const promises = students.map(async (student) => {
        const ccScore = student.attendance ? 10 : 0;
        const totalProcess = (ccScore * 0.1) + (student.discussion * 0.1) + (student.groupReport * 0.1) + (student.regular * 0.1);
        const totalFinal = (totalProcess * 10).toFixed(1);

        const payload = {
          // No explicit "action" means it falls to Case 3 (Save to Sheet) in your script
          role: "Bảng điểm Buổi 1",
          evaluator: "ThS. Đinh Quốc Tuấn",
          groupName: `${student.name} (${student.code})`,
          comment: totalProcess >= 3.2 ? "Giỏi - Tích cực" : "Cần cố gắng", // Simple auto comment
          headers: ["MSSV", "Nhóm", "Chuyên cần", "Thảo luận", "Báo cáo", "Thường xuyên", "Tổng kết (Hệ 10)"],
          scores: [
            student.code, 
            `Nhóm ${student.group}`, 
            ccScore, 
            student.discussion, 
            student.groupReport, 
            student.regular, 
            totalFinal
          ]
        };

        // Using no-cors because standard CORS often blocks Google Apps Script Web Apps unless configured perfectly
        // With no-cors, we can't read the response JSON, but the request is sent.
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        successCount++;
      });

      await Promise.all(promises);
      setSyncStatus({ type: 'success', message: `Đã gửi lệnh đồng bộ cho ${successCount} sinh viên!` });

    } catch (error) {
      console.error(error);
      setSyncStatus({ type: 'error', message: 'Lỗi kết nối: ' + error.message });
    } finally {
      setIsSyncing(false);
    }
  };


  // --- Actions ---

  const handleStageChange = (index) => {
    setCurrentStage(index);
    setTimeLeft(lessonPlan.stages[index].time * 60);
    setTimerActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAttendance = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, attendance: !s.attendance } : s));
  };

  const updateStudentScore = (id, type, value) => {
    setStudents(students.map(s => s.id === id ? { ...s, [type]: parseFloat(value) || 0 } : s));
  };

  const updateGroupReportScore = (groupId, score) => {
    const numScore = parseFloat(score) || 0;
    setGroupReportInputs(prev => ({ ...prev, [groupId]: numScore }));
    setStudents(students.map(s => s.group === parseInt(groupId) ? { ...s, groupReport: numScore } : s));
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

  // --- Views ---

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-sm text-blue-600 font-semibold mb-1">Hiện diện</div>
          <div className="text-3xl font-bold text-blue-900">
            {students.filter(s => s.attendance).length} / {students.length}
          </div>
        </Card>
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="text-sm text-purple-600 font-semibold mb-1">Giai đoạn</div>
          <div className="text-lg font-bold text-purple-900 truncate">
            {lessonPlan.stages[currentStage].title}
          </div>
        </Card>
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="text-sm text-orange-600 font-semibold mb-1">Thời gian còn lại</div>
          <div className={`text-3xl font-bold font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-orange-900'}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setTimerActive(!timerActive)} className="p-1 rounded hover:bg-orange-200">
              {timerActive ? <Pause size={16}/> : <Play size={16}/>}
            </button>
            <button onClick={() => setTimeLeft(lessonPlan.stages[currentStage].time * 60)} className="p-1 rounded hover:bg-orange-200">
              <RotateCcw size={16}/>
            </button>
          </div>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="text-sm text-green-600 font-semibold mb-1">Nhóm dẫn đầu (Báo cáo)</div>
          <div className="text-lg font-bold text-green-900">
            Nhóm {Object.entries(groupReportInputs).sort((a,b) => b[1] - a[1])[0][0]}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} /> Tiến trình bài giảng
        </h3>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {lessonPlan.stages.map((stage, index) => (
            <button
              key={stage.id}
              onClick={() => handleStageChange(index)}
              className={`flex-1 p-3 rounded-lg border text-left transition-all ${
                currentStage === index 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className="text-xs opacity-75">{stage.time} Phút</div>
              <div className="font-semibold text-sm">{stage.title}</div>
            </button>
          ))}
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-bold text-gray-700">Hoạt động: </span>
              <span className="text-gray-600">{lessonPlan.stages[currentStage].content}</span>
            </div>
            {lessonPlan.stages[currentStage].detail && (
              <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                {lessonPlan.stages[currentStage].detail}
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <HelpCircle size={20}/> Gọi ngẫu nhiên (Q&A)
          </h3>
          <div className="text-center py-4">
             <div className="text-2xl font-bold text-blue-800 mb-4 h-12 flex items-center justify-center bg-blue-50 rounded-lg border border-blue-100">
               {pickedStudent ? `${pickedStudent.name} (N${pickedStudent.group})` : "..."}
             </div>
             <div className="flex justify-center gap-3">
               <Button onClick={pickRandomStudent} disabled={isRolling}>
                 {isRolling ? "Đang chọn..." : "Chọn sinh viên"}
               </Button>
               {pickedStudent && (
                 <Button variant="success" onClick={() => updateStudentScore(pickedStudent.id, 'discussion', pickedStudent.discussion + 1)}>
                   +1đ Thảo luận
                 </Button>
               )}
             </div>
          </div>
        </Card>

        {currentStage === 3 ? (
          <Card className="p-6 border-purple-200 bg-purple-50">
            <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Globe size={20}/> English Vocabulary Test (CHP7)
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm font-semibold text-gray-500 mb-2">Question {currentQuizIdx + 1}/{englishQuiz.length}</div>
                <div className="text-lg font-medium text-gray-800 mb-3">{englishQuiz[currentQuizIdx].q}</div>
                
                {showAnswer ? (
                  <div className="bg-green-100 text-green-800 p-2 rounded animate-fade-in">
                    <strong>Đáp án:</strong> {englishQuiz[currentQuizIdx].a}
                  </div>
                ) : (
                  <Button variant="outline" className="w-full justify-center" onClick={() => setShowAnswer(true)}>
                    Hiện đáp án
                  </Button>
                )}
              </div>
              <div className="flex justify-between">
                <button 
                  disabled={currentQuizIdx === 0}
                  onClick={() => {setCurrentQuizIdx(prev => prev - 1); setShowAnswer(false)}}
                  className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  disabled={currentQuizIdx === englishQuiz.length - 1}
                  onClick={() => {setCurrentQuizIdx(prev => prev + 1); setShowAnswer(false)}}
                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded disabled:opacity-50"
                >
                  Next Question
                </button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={20}/> Nhập điểm Báo cáo Nhóm (10%)
            </h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(g => (
                <div key={g} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="font-medium text-sm">Nhóm {g}</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      max="10"
                      className="w-16 border rounded p-1 text-center"
                      value={groupReportInputs[g]}
                      onChange={(e) => updateGroupReportScore(g, e.target.value)}
                    />
                    <span className="text-xs text-gray-500">/10 điểm</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  const renderAttendance = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><CheckSquare/> Điểm danh (Chuyên cần 10%)</h2>
        <Button onClick={() => setStudents(students.map(s => ({...s, attendance: true})))}>
          Có mặt tất cả
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">MSSV</th>
              <th className="p-3">Họ và tên</th>
              <th className="p-3">Nhóm</th>
              <th className="p-3 text-center">Trạng thái</th>
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
                  <span className={`px-2 py-1 rounded text-sm ${student.attendance ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {student.attendance ? 'Có mặt' : 'Vắng'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button 
                    onClick={() => toggleAttendance(student.id)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${student.attendance ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${student.attendance ? 'left-5' : 'left-1'}`} />
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
        <h2 className="text-xl font-bold flex items-center gap-2"><Trophy/> Nhập điểm Quá trình</h2>
        <div className="text-sm text-gray-500 italic">
          Cập nhật điểm theo từng cột quy chế (Thang 10)
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 border-b text-sm">
              <th className="p-3">Sinh viên</th>
              <th className="p-3 text-center w-24">Báo cáo Nhóm (10%)</th>
              <th className="p-3 text-center w-32">Thảo luận (10%)</th>
              <th className="p-3 text-center w-32">TX (English/Quiz) (10%)</th>
              <th className="p-3 text-center text-purple-700">Tạm tính (30%)</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="font-medium text-sm">{student.name}</div>
                  <div className="text-xs text-gray-500">Nhóm {student.group}</div>
                </td>
                <td className="p-3 text-center">
                   <div className="font-bold text-gray-700 bg-gray-100 rounded py-1">{student.groupReport}</div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => updateStudentScore(student.id, 'discussion', Math.max(0, student.discussion - 1))} className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">-</button>
                    <input 
                      className="w-8 text-center border-none bg-transparent font-bold text-blue-600"
                      value={student.discussion}
                      readOnly
                    />
                    <button onClick={() => updateStudentScore(student.id, 'discussion', Math.min(10, student.discussion + 1))} className="w-6 h-6 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">+</button>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <input 
                    type="number"
                    max="10"
                    className="w-12 border rounded p-1 text-center"
                    value={student.regular}
                    onChange={(e) => updateStudentScore(student.id, 'regular', e.target.value)}
                  />
                </td>
                 <td className="p-3 text-center font-bold text-purple-700">
                    {(student.groupReport + student.discussion + student.regular).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderSummary = () => (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><BarChart2/> Bảng Tổng kết Buổi 1</h2>
        
        {/* Google Sheet Connection Area */}
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Link size={16} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="https://script.google.com/macros/s/AKfycbxBPRlkjpMLDctdm2Uk7aYex_P6Cx0uhIdUmwOcYEm9C7JDe5OH92FiWEn6Nz1HNenY-A/exec" 
              className="text-sm border border-gray-300 rounded px-2 py-1.5 w-full md:w-64"
              value={scriptUrl}
              onChange={(e) => setScriptUrl(e.target.value)}
            />
          </div>
          <Button 
            variant="success" 
            onClick={handleSyncToSheet} 
            disabled={isSyncing || !scriptUrl}
            className="whitespace-nowrap"
          >
             {isSyncing ? <Loader className="animate-spin" size={16}/> : <CloudLightning size={16}/>}
             {isSyncing ? 'Đang gửi...' : 'Đồng bộ Google Sheet'}
          </Button>
        </div>
      </div>

      {/* Sync Status Notification */}
      {syncStatus && (
        <div className={`mb-4 p-3 rounded text-sm flex items-center gap-2 ${syncStatus.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
           {syncStatus.type === 'success' ? <CheckSquare size={16}/> : <HelpCircle size={16}/>}
           {syncStatus.message}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-gray-50 p-3 rounded border text-center">
           <strong className="block text-gray-700">Chuyên cần</strong>
           <span className="text-xs text-gray-500">10%</span>
         </div>
         <div className="bg-blue-50 p-3 rounded border text-center">
           <strong className="block text-blue-700">Thảo luận</strong>
           <span className="text-xs text-gray-500">10%</span>
         </div>
         <div className="bg-green-50 p-3 rounded border text-center">
           <strong className="block text-green-700">Báo cáo nhóm</strong>
           <span className="text-xs text-gray-500">10%</span>
         </div>
         <div className="bg-purple-50 p-3 rounded border text-center">
           <strong className="block text-purple-700">Thường xuyên</strong>
           <span className="text-xs text-gray-500">10%</span>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-3 rounded-tl-lg">Họ và tên</th>
              <th className="p-3 text-center">CC (10%)</th>
              <th className="p-3 text-center">TL (10%)</th>
              <th className="p-3 text-center">BC (10%)</th>
              <th className="p-3 text-center">TX (10%)</th>
              <th className="p-3 text-center bg-gray-700 font-bold">Tổng (40%)</th>
              <th className="p-3 text-center rounded-tr-lg">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => {
              const ccScore = student.attendance ? 10 : 0;
              const totalProcess = (ccScore * 0.1) + (student.discussion * 0.1) + (student.groupReport * 0.1) + (student.regular * 0.1);
              
              return (
                <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 font-medium border-b">{student.name}</td>
                  <td className="p-3 text-center border-b">
                    {student.attendance ? <span className="text-green-600 font-bold">10</span> : <span className="text-red-500">0</span>}
                  </td>
                  <td className="p-3 text-center border-b">{student.discussion}</td>
                  <td className="p-3 text-center border-b">{student.groupReport}</td>
                  <td className="p-3 text-center border-b">{student.regular}</td>
                  <td className="p-3 text-center border-b font-bold text-lg bg-gray-100">
                    {(totalProcess * 10).toFixed(1)} <span className="text-[10px] font-normal text-gray-500">/40</span>
                  </td>
                  <td className="p-3 text-center border-b text-gray-500">
                    {totalProcess >= 3.2 ? 'Giỏi' : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 pb-10">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Layout size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight text-gray-900">Quản lý Lớp học GEO10065</h1>
              <p className="text-xs text-gray-500">Buổi 1: Địa chất Đệ tứ & Vỏ phong hóa</p>
            </div>
          </div>
          
          <div className="text-right hidden md:block">
            <div className="text-sm font-semibold text-gray-700">Giảng viên: ThS. Đinh Quốc Tuấn</div>
            <div className="text-xs text-gray-500">{new Date().toLocaleDateString('vi-VN')}</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${activeTab === 'dashboard' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
          >
            Điểm danh (CC)
          </button>
          <button 
            onClick={() => setActiveTab('scoring')}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${activeTab === 'scoring' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
          >
            Nhập điểm Quá trình
          </button>
          <button 
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${activeTab === 'summary' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
          >
            Bảng Tổng kết
          </button>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'attendance' && renderAttendance()}
          {activeTab === 'scoring' && renderScoring()}
          {activeTab === 'summary' && renderSummary()}
        </div>
      </main>
    </div>
  );
}
