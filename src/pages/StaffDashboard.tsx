import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, Calendar, Megaphone, Plus, Search, 
  ChevronRight, Edit2, CheckCircle, Clock, LogOut, Trash2, FileSpreadsheet,
  X, Save, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { firebaseService } from '../services/firebaseService';
import { SheetEditor } from '../components/dashboard/SheetEditor';

import { logout } from '../lib/firebase';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const staffId = localStorage.getItem('staff_id') || 'Unknown User';
  const staffName = localStorage.getItem('staff_name') || 'Staff Member';
  const [loading, setLoading] = React.useState(true);
  const [deleteConfirm, setDeleteConfirm] = React.useState<{
    isOpen: boolean;
    type: 'school' | 'task' | 'file';
    id: string;
    extra?: any;
  }>({ isOpen: false, type: 'school', id: '' });
  const [excelManager, setExcelManager] = React.useState<{id: string, name: string, excelFiles: any[]} | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [activeSheetEditor, setActiveSheetEditor] = React.useState<{
    fileId: string;
    fileName: string;
    sheets: { name: string; data: string[][] }[];
  } | null>(null);
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const [sheetStats, setSheetStats] = React.useState({ rows: 100, cols: 20 });
  const [notices, setNotices] = React.useState<any[]>([]);
  const [schools, setSchools] = React.useState<any[]>([]);
  const [schedule, setSchedule] = React.useState<any[]>([]);
  const [isEditingSchedule, setIsEditingSchedule] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const syncTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const unsubNotices = firebaseService.subscribeToCollection('notices', (data) => {
      setNotices(data.sort((a, b) => b.date?.seconds - a.date?.seconds));
    });
    const unsubSchools = firebaseService.subscribeToQuery('staff_managed_schools', 'staffId', staffId, (data) => {
      setSchools(data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }));
    });
    const unsubSchedule = firebaseService.subscribeToQuery('staff_schedules', 'staffId', staffId, (data) => {
      setSchedule(data.sort((a, b) => (a.time || '').localeCompare(b.time || '')));
    });

    // Initial load check
    setTimeout(() => setLoading(false), 1000);

    return () => {
      unsubNotices();
      unsubSchools();
      unsubSchedule();
    };
  }, [staffId]);

  const [editingSchool, setEditingSchool] = React.useState<any>(null);
  const [showForm, setShowForm] = React.useState(false);

  const [schoolForm, setSchoolForm] = React.useState({
    schoolName: '',
    wing: '',
    totalStudents: '',
    anoName: '',
    anoMobile: '',
    location: '',
    excelFiles: [] as any[]
  });

  const handleOpenForm = (school: any = null) => {
    if (school) {
      setEditingSchool(school);
      setSchoolForm({
        schoolName: school.schoolName || school.name || '',
        wing: school.wing || '',
        totalStudents: school.totalStudents || school.cadets || '',
        anoName: school.anoName || '',
        anoMobile: school.anoMobile || '',
        location: school.location || '',
        excelFiles: school.excelFiles || []
      });
    } else {
      setEditingSchool(null);
      setSchoolForm({
        schoolName: '',
        wing: '',
        totalStudents: '',
        anoName: '',
        anoMobile: '',
        location: '',
        excelFiles: []
      });
    }
    setShowForm(true);
  };

  const handleSaveSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSchool) {
        await firebaseService.updateDocument('staff_managed_schools', editingSchool.id, {
          ...schoolForm,
          updatedAt: new Date().toISOString()
        });
        alert('School Record Updated!');
      } else {
        await firebaseService.createDocument('staff_managed_schools', {
          ...schoolForm,
          staffId,
          status: 'Active',
          createdAt: new Date().toISOString()
        });
        alert('New School Added Successfully!');
      }
      setShowForm(false);
      setEditingSchool(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save record.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        uploadedAt: new Date().toISOString(),
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type || 'application/vnd.ms-excel'
      };
      setSchoolForm(prev => ({
        ...prev,
        excelFiles: [...prev.excelFiles, newFile]
      }));
    }
  };

  const handleRenameFile = (fileId: string) => {
    const file = schoolForm.excelFiles.find(f => f.id === fileId);
    const newName = prompt('Enter new filename:', file?.name);
    if (newName && newName.trim()) {
      setSchoolForm(prev => ({
        ...prev,
        excelFiles: prev.excelFiles.map(f => f.id === fileId ? { ...f, name: newName.trim() } : f)
      }));
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setDeleteConfirm({ isOpen: true, type: 'file', id: fileId });
  };

  const handleUpdateSchedule = async (id: string, field: string, value: string) => {
    try {
      await firebaseService.updateDocument('staff_schedules', id, { [field]: value });
    } catch (err) {
      console.error(err);
      alert('Failed to update schedule. Please check permissions.');
    }
  };

  const handleAddSchedule = async () => {
    try {
      await firebaseService.createDocument('staff_schedules', {
        staffId,
        time: '00:00 - 00:00',
        task: 'New Task',
        location: 'Field'
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add schedule item.');
    }
  };

  const handleUpdateSchoolField = async (schoolId: string, field: string, value: string) => {
    try {
      await firebaseService.updateDocument('staff_managed_schools', schoolId, { [field]: value });
    } catch (err) {
      console.error(err);
      alert('Failed to update school field.');
    }
  };

  const handleAddSchool = async (initialData: any = {}) => {
    try {
      const docRef = await firebaseService.createDocument('staff_managed_schools', {
        staffId,
        schoolName: '',
        wing: '',
        totalStudents: '',
        anoName: '',
        anoMobile: '',
        location: '',
        status: 'Active',
        createdAt: new Date().toISOString(),
        ...initialData
      });
      return docRef;
    } catch (err) {
      console.error(err);
      alert('Failed to add school.');
    }
  };

  const handleDeleteSchool = async (id: string) => {
    setDeleteConfirm({ isOpen: true, type: 'school', id });
  };

  const handleDeleteScheduleItem = async (id: string) => {
    setDeleteConfirm({ isOpen: true, type: 'task', id });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteConfirm;
    setDeleteConfirm(prev => ({ ...prev, isOpen: false }));
    
    try {
      if (type === 'school') {
        await firebaseService.deleteDocument('staff_managed_schools', id);
        alert('School record deleted successfully.');
      } else if (type === 'task') {
        await firebaseService.deleteDocument('staff_schedules', id);
        alert('Task removed.');
      } else if (type === 'file') {
        setSchoolForm(prev => ({
          ...prev,
          excelFiles: prev.excelFiles.filter(f => f.id !== id)
        }));
      }
    } catch (err) {
      console.error(err);
      alert('Action failed.');
    }
  };

  const filteredSchools = schools.filter(s => 
    (s.schoolName || s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/staff-login';
  };

  const handleDirectSheetOpen = async (school: any) => {
    let excelFiles = school.excelFiles || [];
    let file = excelFiles[0];
    let isNew = false;

    if (!file) {
      file = {
        id: 'MAIN-SHEET-' + Date.now(),
        name: 'Database: ' + (school.schoolName || school.name),
        uploadedAt: new Date().toISOString(),
        sheets: [
          { name: 'Sheet1', data: JSON.stringify(Array(100).fill(null).map(() => Array(20).fill(''))) }
        ]
      };
      excelFiles = [file];
      isNew = true;
    }

    // Save if new so it's not lost
    if (isNew) {
      try {
        await firebaseService.updateDocument('staff_managed_schools', school.id, {
          excelFiles: excelFiles
        });
      } catch (err) {
        console.warn('Initial slot creation failed to sync:', err);
      }
    }

    // Parse the data back from string format 
    const parsedSheets = (file.sheets || []).map((s: any) => {
      let data = s.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          data = Array(100).fill(null).map(() => Array(20).fill(''));
        }
      } else if (!Array.isArray(data)) {
        data = Array(100).fill(null).map(() => Array(20).fill(''));
      }
      return { ...s, data };
    });

    setExcelManager({ 
      id: school.id, 
      name: school.schoolName || school.name || '', 
      excelFiles: excelFiles 
    });

    setActiveTabIndex(0);
    setActiveSheetEditor({
      fileId: file.id,
      fileName: file.name,
      sheets: parsedSheets
    });
  };

  const handleOpenExcelManager = (school: any) => {
    handleDirectSheetOpen(school);
  };

  const syncToCloud = (updatedSheets: any[]) => {
    if (!activeSheetEditor || !excelManager) return;
    
    // Update local excelManager state immediately with RAW ARRAYS (not stringified)
    setExcelManager(prev => {
      if (!prev) return null;
      const updatedExcelFiles = prev.excelFiles.map(f => 
        f.id === activeSheetEditor.fileId 
          ? { ...f, sheets: updatedSheets, uploadedAt: new Date().toISOString() } 
          : f
      );
      
      // Clear previous timeout and set a new one for the remote sync
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      setIsSyncing(true);
      syncTimeoutRef.current = setTimeout(async () => {
        try {
          // Serialize ONLY for the network request
          const serializedSheetsForFirestore = updatedSheets.map(s => ({
            ...s,
            data: typeof s.data === 'string' ? s.data : JSON.stringify(s.data)
          }));
          
          const finalExcelFilesForFirestore = updatedExcelFiles.map(f => 
            f.id === activeSheetEditor.fileId
              ? { ...f, sheets: serializedSheetsForFirestore }
              : f
          );

          await firebaseService.updateDocument('staff_managed_schools', prev.id, {
            excelFiles: finalExcelFilesForFirestore
          });
          setIsSyncing(false);
        } catch (err) {
          console.warn('Auto-save failed:', err);
          setIsSyncing(false);
        }
      }, 2000);

      return { ...prev, excelFiles: updatedExcelFiles };
    });
  };

  const handleOpenSheetEditor = (file: any) => {
    const parsedSheets = (file.sheets || []).map((s: any) => {
      let data = s.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          data = Array(100).fill(null).map(() => Array(20).fill(''));
        }
      } else if (!Array.isArray(data)) {
        data = Array(100).fill(null).map(() => Array(20).fill(''));
      }
      return { ...s, data };
    });

    setActiveTabIndex(0);
    setActiveSheetEditor({
      fileId: file.id,
      fileName: file.name,
      sheets: parsedSheets
    });
  };

  const handleAddRow = (count: number = 1) => {
    setActiveSheetEditor(prev => {
      if (!prev) return null;
      const currentSheets = [...prev.sheets];
      const targetSheet = { ...currentSheets[activeTabIndex] };
      const numCols = targetSheet.data[0]?.length || 20;
      const newRows = Array(count).fill(null).map(() => Array(numCols).fill(''));
      targetSheet.data = [...targetSheet.data, ...newRows];
      currentSheets[activeTabIndex] = targetSheet;
      
      syncToCloud(currentSheets);
      return { ...prev, sheets: currentSheets };
    });
  };

  const handleAddTab = () => {
    setActiveSheetEditor(prev => {
      if (!prev) return null;
      const newTab = {
        name: `Sheet${prev.sheets.length + 1}`,
        data: Array(100).fill(null).map(() => Array(20).fill(''))
      };
      const updatedSheets = [...prev.sheets, newTab];
      setActiveTabIndex(updatedSheets.length - 1);
      syncToCloud(updatedSheets);
      return { ...prev, sheets: updatedSheets };
    });
  };

  const handleRenameTab = (index: number, newName: string) => {
    setActiveSheetEditor(prev => {
      if (!prev) return null;
      const updatedSheets = [...prev.sheets];
      updatedSheets[index] = { ...updatedSheets[index], name: newName };
      syncToCloud(updatedSheets);
      return { ...prev, sheets: updatedSheets };
    });
  };

  const handleDeleteTab = (index: number) => {
    setActiveSheetEditor(prev => {
      if (!prev || prev.sheets.length <= 1) return prev;
      const updatedSheets = prev.sheets.filter((_, i) => i !== index);
      const newIndex = Math.min(activeTabIndex, updatedSheets.length - 1);
      setActiveTabIndex(newIndex);
      
      if (excelManager) {
        // Prepare updated list for local state (RAW ARRAYS)
        const updatedExcelFiles = excelManager.excelFiles.map(f => 
          f.id === prev.fileId 
            ? { ...f, sheets: updatedSheets, uploadedAt: new Date().toISOString() } 
            : f
        );

        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        
        // Serialise ONLY for Firestore
        const serializedSheets = updatedSheets.map(s => ({
          ...s,
          data: typeof s.data === 'string' ? s.data : JSON.stringify(s.data)
        }));

        const finalExcelFilesForFirestore = updatedExcelFiles.map(f => 
          f.id === prev.fileId ? { ...f, sheets: serializedSheets } : f
        );

        firebaseService.updateDocument('staff_managed_schools', excelManager.id, {
          excelFiles: finalExcelFilesForFirestore
        }).catch(err => console.warn('Immediate delete sync failed:', err));
        
        // Update local excel manager state
        setExcelManager({ ...excelManager, excelFiles: updatedExcelFiles });
      }

      return { ...prev, sheets: updatedSheets };
    });
  };

  const downloadCSV = () => {
    if (!activeSheetEditor) return;
    const currentSheet = activeSheetEditor.sheets[activeTabIndex];
    const csvContent = currentSheet.data
      .filter(row => row.some(cell => cell.trim() !== '')) // Only non-empty rows
      .map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(","))
      .join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${currentSheet.name.replace(/[^a-z0-9]/gi, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddColumn = () => {
    setActiveSheetEditor(prev => {
      if (!prev) return null;
      const updatedSheets = [...prev.sheets];
      const targetSheet = { ...updatedSheets[activeTabIndex] };
      targetSheet.data = targetSheet.data.map(row => [...row, '']);
      updatedSheets[activeTabIndex] = targetSheet;
      syncToCloud(updatedSheets);
      return { ...prev, sheets: updatedSheets };
    });
  };

  const handleUpdateCell = (rIdx: number, cIdx: number, val: string) => {
    setActiveSheetEditor(prev => {
      if (!prev) return null;
      const updatedSheets = [...prev.sheets];
      const targetSheet = { ...updatedSheets[activeTabIndex] };
      const newData = [...targetSheet.data];
      newData[rIdx] = [...newData[rIdx]];
      newData[rIdx][cIdx] = val;
      targetSheet.data = newData;
      updatedSheets[activeTabIndex] = targetSheet;
      
      syncToCloud(updatedSheets);
      return { ...prev, sheets: updatedSheets };
    });
  };

  const handleDeleteExcel = async () => {
    if (!activeSheetEditor || !excelManager) return;
    
    const updatedExcelFiles = excelManager.excelFiles.filter(f => f.id !== activeSheetEditor.fileId);
    
    try {
      await firebaseService.updateDocument('staff_managed_schools', excelManager.id, {
        excelFiles: updatedExcelFiles
      });
      setActiveSheetEditor(null);
      setExcelManager(null);
      alert('Spreadsheet deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete spreadsheet.');
    }
  };

  if (activeSheetEditor) {
    return (
      <SheetEditor 
        activeSheetEditor={activeSheetEditor}
        sheetStats={sheetStats}
        onClose={() => {
          setActiveSheetEditor(null);
          setExcelManager(null);
        }}
        onAddRow={handleAddRow}
        onAddColumn={handleAddColumn}
        onUpdateCell={handleUpdateCell}
        onAddTab={handleAddTab}
        onRenameTab={handleRenameTab}
        onDeleteTab={handleDeleteTab}
        activeTabIndex={activeTabIndex}
        onTabChange={(idx) => setActiveTabIndex(idx)}
        downloadCSV={downloadCSV}
        onDeleteExcel={handleDeleteExcel}
        isSyncing={isSyncing}
      />
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border-4 border-ncc-red"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-ncc-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-2">Confirm Delete</h3>
              <p className="text-slate-500 text-sm italic font-medium leading-relaxed">
                This action is irreversible. Are you absolutely sure you want to terminate this record?
              </p>
            </div>
            <div className="flex border-t-2 border-slate-100">
              <button 
                onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
                className="flex-1 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors border-r-2 border-slate-100"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-6 py-4 text-xs font-black uppercase tracking-widest text-ncc-red hover:bg-red-50 transition-colors"
               >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {localStorage.getItem('admin_auth') === 'true' && (
        <div className="bg-amber-400 text-navy text-[10px] font-black py-1.5 px-4 text-center uppercase tracking-[0.2em] shadow-md relative z-50 border-b border-navy/10 flex justify-between items-center px-8">
          <span>ADMIN EYE ACTIVE: VIEWING AS {staffName}</span>
          <button 
            onClick={() => navigate('/admin-dashboard')}
            className="bg-navy text-white px-2 py-0.5 rounded hover:bg-ncc-red transition-all"
          >
            EXIT VIEW
          </button>
        </div>
      )}
      <header className="bg-navy text-white py-8 border-b-4 border-ncc-red">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ncc-light-blue">Authorized Access Only</span>
            <h1 className="text-3xl font-bold mt-1 uppercase tracking-tight">{staffName} ({staffId})</h1>
          </div>
          <div className="text-right pb-1 flex items-center gap-6">
            <p className="text-xs text-slate-400 font-mono tracking-tighter">LOC: Sector 7/HQ • LOG: {new Date().toLocaleDateString()}</p>
            {localStorage.getItem('admin_auth') === 'true' && (
              <button 
                onClick={() => navigate('/admin-dashboard')}
                className="px-3 py-1 bg-ncc-red text-white text-[10px] font-black rounded hover:bg-white hover:text-ncc-red transition-all shadow-lg"
              >
                BACK TO ADMIN
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-ncc-red"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        
        {/* Layout Sections */}
        {/* Notices Section */}
        <section className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-ncc-red p-4 text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-wider text-sm">Deployment Notices</h3>
            </div>
            <div className="p-4 divide-y divide-slate-100 italic">
              {notices.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No active notices</p>}
              {notices.map(notice => (
                <div key={notice.id} className="py-3 flex items-start gap-4">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notice.priority === 'high' ? 'bg-ncc-red' : 'bg-navy'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{notice.text}</p>
                    <span className="text-[10px] font-bold text-slate-400">
                      {notice.date?.seconds ? new Date(notice.date.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-navy p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Training Schedule</h3>
              </div>
              <button 
                onClick={() => setIsEditingSchedule(!isEditingSchedule)}
                className="p-1 hover:bg-white/10 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {schedule.length === 0 && !isEditingSchedule && (
                  <p className="text-xs text-slate-400 italic">No schedule data available. Click edit to add Tasks.</p>
                )}
                {(schedule.length > 0 ? schedule : (isEditingSchedule ? [] : [
                  { id: '1', time: '06:00 - 08:00', task: 'Physical Fitness / Drill', location: 'Ground A' },
                  { id: '2', time: '10:00 - 12:00', task: 'Theory: Map Reading', location: 'Room 102' }
                ])).map((item, i) => (
                  <div key={item.id || i} className="flex gap-4 group">
                    <div className="w-24 text-right">
                      {isEditingSchedule ? (
                        <input 
                          type="text"
                          className="text-[10px] font-mono font-bold text-slate-600 w-full border-b border-slate-200 focus:outline-none bg-slate-50 px-1"
                          defaultValue={item.time}
                          onBlur={(e) => {
                            if (e.target.value !== item.time) {
                              handleUpdateSchedule(item.id, 'time', e.target.value);
                            }
                          }}
                        />
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-slate-400 block">{item.time}</span>
                      )}
                    </div>
                    <div className="flex-grow pb-4 border-l border-slate-200 pl-4 relative">
                      <div className="absolute top-0 -left-1 w-2 h-2 bg-slate-200 rounded-full group-hover:bg-ncc-red transition-colors"></div>
                      {isEditingSchedule ? (
                        <div className="space-y-4 bg-slate-50 p-2 rounded border border-slate-100">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400">MISSION TASK</label>
                            <input 
                              className="text-sm font-bold text-navy uppercase leading-none w-full border-b border-slate-200 focus:outline-none bg-white p-1"
                              defaultValue={item.task}
                              onBlur={(e) => {
                                if (e.target.value !== item.task) {
                                  handleUpdateSchedule(item.id, 'task', e.target.value);
                                }
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400">OPERATION LOCATION</label>
                            <input 
                              className="text-xs text-slate-500 flex items-center gap-1 w-full border-b border-slate-200 focus:outline-none bg-white p-1"
                              defaultValue={item.location}
                              onBlur={(e) => {
                                if (e.target.value !== item.location) {
                                  handleUpdateSchedule(item.id, 'location', e.target.value);
                                }
                              }}
                            />
                          </div>
                          <button 
                            onClick={async () => {
                              await handleDeleteScheduleItem(item.id);
                            }}
                            className="text-[8px] font-black text-ncc-red hover:underline"
                          >
                            REMOVE PLOT
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-navy uppercase leading-none">{item.task}</h4>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {item.location}
                            </p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                const newTask = prompt('Edit Task:', item.task);
                                if (newTask) handleUpdateSchedule(item.id, 'task', newTask);
                              }}
                              className="p-1 text-slate-400 hover:text-navy"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteScheduleItem(item.id)}
                              className="p-1 text-slate-400 hover:text-ncc-red"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {isEditingSchedule && (
                <button 
                  onClick={() => handleAddSchedule()}
                  className="w-full mt-4 py-2 text-[10px] font-black uppercase tracking-widest text-ncc-red bg-slate-50 border-2 border-dashed border-slate-200 hover:bg-slate-100 transition-all rounded-md"
                >
                  + Add Strategic Plot
                </button>
              )}
            </div>
          </section>
        {/* End of Left-aligned items stack naturally because of space-y-8 */}

        {/* School Management Section */}
        <div className="space-y-8">
          {showForm && (
            <motion.section 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl border-2 border-navy/10 overflow-hidden"
            >
              <div className="bg-navy p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Plus className="w-5 h-5 text-ncc-light-blue" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight">
                    {editingSchool ? 'Edit Registration' : 'New School Entry'}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleSaveSchool} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl focus:border-navy focus:bg-white transition-all outline-none font-bold text-navy"
                      placeholder="e.g. Kendriya Vidyalaya No.1"
                      value={schoolForm.schoolName}
                      onChange={e => setSchoolForm({...schoolForm, schoolName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Wing / Unit</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl focus:border-navy focus:bg-white transition-all outline-none font-bold text-navy"
                      placeholder="e.g. 1 BENGAL BN NCC"
                      value={schoolForm.wing}
                      onChange={e => setSchoolForm({...schoolForm, wing: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Cadets</label>
                    <input 
                      type="number" 
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl focus:border-navy focus:bg-white transition-all outline-none font-bold text-navy"
                      placeholder="Strength Count"
                      value={schoolForm.totalStudents}
                      onChange={e => setSchoolForm({...schoolForm, totalStudents: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / District</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl focus:border-navy focus:bg-white transition-all outline-none font-bold text-navy"
                      placeholder="Operational Area"
                      value={schoolForm.location}
                      onChange={e => setSchoolForm({...schoolForm, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ANO / CTO Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl focus:border-navy focus:bg-white transition-all outline-none font-bold text-navy"
                      placeholder="Full Name"
                      value={schoolForm.anoName}
                      onChange={e => setSchoolForm({...schoolForm, anoName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Mobile</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl focus:border-navy focus:bg-white transition-all outline-none font-bold text-navy"
                      placeholder="Valid Phone Number"
                      value={schoolForm.anoMobile}
                      onChange={e => setSchoolForm({...schoolForm, anoMobile: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-xs font-black text-navy uppercase tracking-widest">Excel Documentation Hub</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 italic">Authorized personnel only: multi-sheet binary storage active.</p>
                    </div>
                    <label className="cursor-pointer bg-ncc-red text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-navy transition-all shadow-lg flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Sheet
                      <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schoolForm.excelFiles.length === 0 && (
                      <div className="md:col-span-2 py-8 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300">
                        <FileSpreadsheet className="w-12 h-12 mb-2 opacity-10" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Zero Sheets Attached</span>
                      </div>
                    )}
                    {schoolForm.excelFiles.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-ncc-red/30 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <FileSpreadsheet className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-navy max-w-[150px] truncate">{file.name}</p>
                            <span className="text-[8px] font-mono text-slate-400 uppercase">{file.size} • {new Date(file.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={() => handleRenameFile(file.id)}
                            className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-navy transition-all"
                            title="Rename"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleRemoveFile(file.id)}
                            className="p-1.5 hover:bg-white rounded text-slate-400 hover:text-ncc-red transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-grow bg-navy text-white py-4 rounded-xl text-xs font-black uppercase tracking-[0.3em] hover:bg-ncc-red hover:shadow-2xl transition-all"
                  >
                    {editingSchool ? 'Push Changes to Server' : 'Register New Institution'}
                  </button>
                </div>
              </form>
            </motion.section>
          )}

          <section className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 rounded-lg text-navy">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-navy uppercase tracking-tighter">School Management Database</h3>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search schools..." 
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-navy transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {!showForm && (
                  <button 
                    onClick={() => handleOpenForm()}
                    className="bg-navy p-2 text-white rounded-md hover:bg-ncc-red transition-all flex items-center gap-2 px-4 whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase">Open Registration Form</span>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-20">
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <th className="px-6 py-4 w-12 text-center">#</th>
                    <th className="px-6 py-4">Institution Name</th>
                    <th className="px-6 py-4">Unit / Wing</th>
                    <th className="px-6 py-4 text-center">Cadets</th>
                    <th className="px-6 py-4">ANO/CTO Details</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-center">Database</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredSchools.map((school, idx) => (
                      <tr key={school.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-300 text-center">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-navy">{school.schoolName || school.name || '---'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-1 rounded">{school.wing}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-navy text-sm">{school.totalStudents || school.cadets || '0'}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-navy">{school.anoName || '---'}</span>
                            <span className="text-[9px] text-slate-400 font-mono italic">{school.anoMobile || '---'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] text-slate-400 font-mono italic uppercase tracking-tighter">{school.location}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleOpenExcelManager(school)}
                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100 flex items-center justify-center mx-auto shadow-sm group"
                            title="Open Database"
                          >
                            <FileSpreadsheet className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleUpdateSchoolField(school.id, 'status', school.status === 'Active' ? 'Inactive' : 'Active')}
                            className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase transition-all ${
                              school.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {school.status || 'Active'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleOpenForm(school)}
                              className="p-2 text-slate-400 hover:text-navy bg-slate-50 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                              title="Edit Strategic Data"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSchool(school.id)}
                              className="p-2 text-slate-400 hover:text-ncc-red bg-slate-50 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                              title="Terminate Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredSchools.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-20 text-center text-slate-300 font-bold uppercase tracking-[0.3em] text-xs">
                          No active school records found in sector
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-navy text-white flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Total Fleet Strength Index: {schools.length + 100} Slots Available</p>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-ncc-light-blue uppercase">Operational Data Hub</p>
                  <p className="text-xs font-mono">LATEST UPDATE: {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
