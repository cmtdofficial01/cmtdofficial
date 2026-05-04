import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, Users, School, Shield, GraduationCap, 
  Settings, LogOut, Search, Filter, Trash2, Edit, RefreshCw, 
  UserCheck, UserCog, Megaphone, FileSpreadsheet, Plus, Building2,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { firebaseService } from '../services/firebaseService';
import { logout, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { AdminNoticeManager } from '../components/admin/AdminNoticeManager';
import { AdminStaffManager } from '../components/admin/AdminStaffManager';
import { AdminExcelManager } from '../components/admin/AdminExcelManager';
import { AdminTableView } from '../components/admin/AdminTableView';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [data, setData] = React.useState<any>({
    schools: [],
    trainers: [],
    staffApp: [],
    defence: [],
    staffAccounts: [],
    staffSchools: [],
    staffSchedules: [],
    notices: [],
    excelSheets: []
  });
  const [noticeForm, setNoticeForm] = React.useState({ text: '', priority: 'normal' });
  const [loading, setLoading] = React.useState(true);
  const [deleteConfirm, setDeleteConfirm] = React.useState<{
    isOpen: boolean;
    collection: string;
    id: string;
    item?: any;
    displayTitle?: string;
  }>({ isOpen: false, collection: '', id: '' });
  const navigate = useNavigate();

  const [config, setConfig] = React.useState({
    phoneNumber: '+91 9110000000',
    email: 'contact@cmtd.in',
    address: 'HQ CMDT, Sector 7, India',
    facebookUrl: '#',
    instagramUrl: '#',
    twitterUrl: '#'
  });
  const [configLoading, setConfigLoading] = React.useState(false);

  React.useEffect(() => {
    const unsubSchools = firebaseService.subscribeToCollection('schoolRegistrations', (data) => {
      setData(prev => ({ ...prev, schools: data }));
    });
    const unsubTrainers = firebaseService.subscribeToCollection('trainerRequests', (data) => {
      setData(prev => ({ ...prev, trainers: data }));
    });
    const unsubStaffApp = firebaseService.subscribeToCollection('staffApplications', (data) => {
      setData(prev => ({ ...prev, staffApp: data }));
    });
    const unsubDefence = firebaseService.subscribeToCollection('defenceTrainingRegistrations', (data) => {
      setData(prev => ({ ...prev, defence: data }));
    });
    const unsubStaffAcc = firebaseService.subscribeToCollection('staff', (data) => {
      setData(prev => ({ ...prev, staffAccounts: data }));
    });
    const unsubStaffSchools = firebaseService.subscribeToCollection('staff_managed_schools', (data) => {
      setData(prev => ({ ...prev, staffSchools: data }));
    });
    const unsubStaffSchedules = firebaseService.subscribeToCollection('staff_schedules', (data) => {
      setData(prev => ({ ...prev, staffSchedules: data }));
    });
    const unsubNotices = firebaseService.subscribeToCollection('notices', (data) => {
      setData(prev => ({ ...prev, notices: data }));
    });

    const fetchConfig = async () => {
      const settings = await firebaseService.getDoc('settings', 'global_config');
      if (settings) setConfig(settings);
      setLoading(false);
    };
    fetchConfig();

    return () => {
      unsubSchools();
      unsubTrainers();
      unsubStaffApp();
      unsubDefence();
      unsubStaffAcc();
      unsubStaffSchools();
      unsubStaffSchedules();
      unsubNotices();
    };
  }, []);

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'global_config'), {
        ...config,
        updatedAt: new Date().toISOString()
      });
      alert('Settings Updated Successfully');
    } catch (err) {
      console.error(err);
      alert('Error updating settings');
    } finally {
      setConfigLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schools', label: 'Public Reg.', icon: School },
    { id: 'staff_schools', label: 'Staff Schools', icon: Building2 },
    { id: 'staff_schedules', label: 'Staff Schedules', icon: Calendar },
    { id: 'trainers', label: 'Trainer Req.', icon: Shield },
    { id: 'staff', label: 'Staff Apps', icon: Users },
    { id: 'defence', label: 'Defence Training', icon: GraduationCap },
    { id: 'staff_manage', label: 'Staff ID Create', icon: UserCheck },
    { id: 'notices', label: 'Notices / Admin', icon: Megaphone },
    { id: 'excel_manage', label: 'Excel Manager', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const [staffForm, setStaffForm] = React.useState({
    name: '',
    mobile: '',
    userId: '',
    password: '',
    area: '',
    post: ''
  });
  const [submitting, setSubmitting] = React.useState(false);

  const [editingStaff, setEditingStaff] = React.useState<string | null>(null);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const staffRef = doc(db, 'staff', staffForm.userId);
      await setDoc(staffRef, {
        ...staffForm,
        loginCount: editingStaff ? data.staffAccounts.find(s => s.id === editingStaff)?.loginCount || 0 : 0,
        lastLogin: editingStaff ? data.staffAccounts.find(s => s.id === editingStaff)?.lastLogin || null : null
      });
      setStaffForm({ name: '', mobile: '', userId: '', password: '', area: '', post: '' });
      setEditingStaff(null);
      alert(`Staff Account ${editingStaff ? 'Updated' : 'Created'} Successfully`);
    } catch (err) {
      console.error(err);
      alert('Error saving staff account. Ensure User ID contains only allowed characters.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStaff = (staff: any) => {
    setEditingStaff(staff.id);
    setStaffForm({
      name: staff.name,
      mobile: staff.mobile || '',
      userId: staff.userId,
      password: staff.password,
      area: staff.area || staff.role || '',
      post: staff.post || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImpersonate = (staff: any) => {
    localStorage.setItem('staff_id', staff.userId);
    localStorage.setItem('staff_name', staff.name);
    localStorage.setItem('admin_auth', 'true');
    navigate('/staff-dashboard');
  };

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await firebaseService.createDocument('notices', {
        ...noticeForm,
        date: new Date(),
        author: 'Admin'
      });
      setNoticeForm({ text: '', priority: 'normal' });
      alert('Notice Posted Successfully');
    } catch (err) { console.error(err); }
  };

  const [activeSheet, setActiveSheet] = React.useState('Main');
  const [sheets, setSheets] = React.useState<string[]>(['Main', 'Inventory', 'Field Schedule']);
  const [sheetData, setSheetData] = React.useState<any>({});

  // Fetch sheet logic
  React.useEffect(() => {
    const fetchSheetData = async () => {
      const docSnap: any = await firebaseService.getDoc('excel_data', activeSheet);
      if (docSnap && docSnap.data) {
        setSheetData(docSnap.data);
      } else {
        setSheetData({});
      }
    };
    if (activeTab === 'excel_manage') {
      fetchSheetData();
    }
  }, [activeSheet, activeTab]);

  // Load sheets configuration
  React.useEffect(() => {
    const loadConfig = async () => {
      const configDoc: any = await firebaseService.getDoc('settings', 'excel_config');
      if (configDoc && configDoc.sheets) {
        setSheets(configDoc.sheets);
      }
    };
    loadConfig();
  }, []);

  const saveSheetConfig = async (newSheets: string[]) => {
    try {
      await setDoc(doc(db, 'settings', 'excel_config'), { sheets: newSheets });
    } catch (err) { console.error(err); }
  };

  const handleSheetAction = (sheetName: string, rowIndex: number, colIndex: number, value: string) => {
    const key = `${sheetName}-${rowIndex}-${colIndex}`;
    setSheetData((prev: any) => {
      const next = { ...prev, [key]: value };
      // Async save
      setDoc(doc(db, 'excel_data', sheetName), { data: next }, { merge: true }).catch(console.error);
      return next;
    });
  };

  const renderExcelManagerView = () => (
    <AdminExcelManager 
      sheets={sheets}
      activeSheet={activeSheet}
      sheetData={sheetData}
      onSelectSheet={(sheet) => setActiveSheet(sheet)}
      onRenameSheet={(sheet) => {
        const newName = prompt('RENAME LIST:', sheet);
        if (newName && newName !== sheet) {
          const next = sheets.map(s => s === sheet ? newName : s);
          setSheets(next);
          saveSheetConfig(next);
          if (activeSheet === sheet) setActiveSheet(newName);
        }
      }}
      onDeleteSheet={(sheet) => {
        setDeleteConfirm({
          isOpen: true,
          collection: 'excel_sheet',
          id: sheet,
          displayTitle: `LIST "${sheet}"`
        });
      }}
      onAddSheet={(name) => {
        if (name && !sheets.includes(name)) {
          const next = [...sheets, name];
          setSheets(next);
          saveSheetConfig(next);
          setActiveSheet(name);
        }
      }}
      onCellUpdate={handleSheetAction}
    />
  );

  const renderNoticeManagerView = () => (
    <AdminNoticeManager 
      notices={data.notices}
      noticeForm={noticeForm}
      onFormChange={(form) => setNoticeForm(form)}
      onPostNotice={handlePostNotice}
      onDeleteNotice={(id) => handleDeleteSubmission('notices', id)}
    />
  );

  const handleDeleteStaff = async (id: string, staffUserId: string) => {
    setDeleteConfirm({
      isOpen: true,
      collection: 'staff',
      id: id,
      item: { userId: staffUserId },
      displayTitle: `STAFF [${staffUserId}] AND LINKED DATA`
    });
  };

  const renderStaffManagementView = () => (
    <AdminStaffManager 
      staffAccounts={data.staffAccounts}
      staffSchools={data.staffSchools}
      staffForm={staffForm}
      editingStaff={editingStaff}
      submitting={submitting}
      onFormChange={setStaffForm}
      onSubmit={handleCreateStaff}
      onEdit={handleEditStaff}
      onImpersonate={handleImpersonate}
      onDelete={handleDeleteStaff}
      onCancelEdit={() => { 
        setEditingStaff(null); 
        setStaffForm({ name: '', mobile: '', userId: '', password: '', area: '', post: '' }); 
      }}
    />
  );

  const handleUpdateStaffSchool = async (id: string, field: string, value: any) => {
    try {
      await firebaseService.updateDocument('staff_managed_schools', id, { [field]: value });
      alert('School record updated.');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const [editingSchoolInAdmin, setEditingSchoolInAdmin] = React.useState<any>(null);

  const renderStaffSchoolsView = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h4 className="font-bold text-navy uppercase tracking-widest text-xs">Staff-Managed School Database</h4>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400">{data.staffSchools.length} Records</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
              <th className="px-6 py-3 font-bold">Managed By</th>
              <th className="px-6 py-3 font-bold">Institution Name</th>
              <th className="px-6 py-3 font-bold">Wing / Unit</th>
              <th className="px-6 py-3 font-bold text-center">Cadets</th>
              <th className="px-6 py-3 font-bold">ANO/CTO Details</th>
              <th className="px-6 py-3 font-bold">Location</th>
              <th className="px-6 py-3 font-bold">Excel Docs</th>
              <th className="px-6 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100 italic font-mono">
            {data.staffSchools.map((row: any) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-bold text-ncc-red uppercase">{row.staffId}</td>
                <td className="px-6 py-4 font-bold text-navy">{row.schoolName || row.name}</td>
                <td className="px-6 py-4">{row.wing}</td>
                <td className="px-6 py-4 text-center font-bold text-navy">{row.totalStudents || row.cadets || 0}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-navy">{row.anoName || '---'}</span>
                    <span className="text-[9px] text-slate-400 font-mono italic">{row.anoMobile || '---'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">{row.location || '---'}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1 group/files relative">
                    <FileSpreadsheet className={`w-4 h-4 ${row.excelFiles?.length > 0 ? 'text-green-500' : 'text-slate-200'}`} />
                    <span className="text-[10px] font-bold text-slate-400">{row.excelFiles?.length || 0}</span>
                    {row.excelFiles?.length > 0 && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-navy text-white text-[8px] p-2 rounded shadow-xl hidden group-hover/files:block z-50 whitespace-nowrap">
                        {row.excelFiles.map((f: any) => <div key={f.id}>{f.name}</div>)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => {
                         const newName = prompt('Enter New School Name:', row.schoolName);
                         if (newName) handleUpdateStaffSchool(row.id, 'schoolName', newName);
                      }}
                      className="p-1 text-slate-400 hover:text-navy"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSubmission('staff_managed_schools', row.id)}
                      className="p-1 text-slate-400 hover:text-ncc-red"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStaffSchedulesView = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h4 className="font-bold text-navy uppercase tracking-widest text-xs">Master Schedule Database</h4>
        <span className="text-xs font-bold text-slate-400">{data.staffSchedules.length} Tasks</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
              <th className="px-6 py-3 font-bold">Staff ID</th>
              <th className="px-6 py-3 font-bold">Task Description</th>
              <th className="px-6 py-3 font-bold">Time / Slot</th>
              <th className="px-6 py-3 font-bold">Location</th>
              <th className="px-6 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100 italic font-mono">
            {data.staffSchedules.map((row: any) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-ncc-red uppercase">{row.staffId}</td>
                <td className="px-6 py-4 font-bold text-navy">{row.task}</td>
                <td className="px-6 py-4 text-slate-500">{row.time}</td>
                <td className="px-6 py-4">{row.location}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={async () => {
                        const newTask = prompt('Edit Task Description:', row.task);
                        if (newTask) {
                          try {
                            await firebaseService.updateDocument('staff_schedules', row.id, { task: newTask });
                            alert('Task updated successfully.');
                          } catch (err) {
                            alert('Update failed.');
                          }
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-navy"
                      title="Edit Task"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSubmission('staff_schedules', row.id)}
                      className="p-1 hover:text-ncc-red transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const chartData = [
    { name: 'Schools', count: data.schools.length },
    { name: 'Cadets', count: data.schools.reduce((acc, s) => acc + (Number(s.totalStudents) || 0), 0) },
    { name: 'Trainers', count: data.trainers.length },
    { name: 'Defence', count: data.defence.length },
  ];

  const handleDeleteSubmission = async (collection: string, id: string, item?: any) => {
    setDeleteConfirm({
      isOpen: true,
      collection,
      id,
      item,
      displayTitle: 'THIS RECORD'
    });
  };

  const confirmDelete = async () => {
    const { collection, id, item } = deleteConfirm;
    setDeleteConfirm(prev => ({ ...prev, isOpen: false }));
    
    try {
      if (collection === 'staff') {
        const staffUserId = item?.userId;
        const staffSchools = data.staffSchools.filter((s: any) => s.staffId === staffUserId);
        const staffSchedules = data.staffSchedules.filter((s: any) => s.staffId === staffUserId);

        await Promise.all([
          firebaseService.deleteDocument('staff', id),
          ...staffSchools.map((s: any) => firebaseService.deleteDocument('staff_managed_schools', s.id)),
          ...staffSchedules.map((s: any) => firebaseService.deleteDocument('staff_schedules', s.id))
        ]);
        alert(`Staff [${staffUserId}] and ${staffSchools.length} schools + ${staffSchedules.length} schedules removed.`);
      } else if (collection === 'excel_sheet') {
         const next = sheets.filter(s => s !== id);
         setSheets(next);
         saveSheetConfig(next);
         if (activeSheet === id) setActiveSheet(next[0] || 'Main');
         alert('Sheet removed.');
      } else {
        let targetCollection = collection;
        if (collection === 'mixed' && item) {
          if (item.wingSelection || item.principalName) targetCollection = 'schoolRegistrations';
          else if (item.wingType || item.nearestStation) targetCollection = 'trainerRequests';
          else if (item.post || item.collegeName) targetCollection = 'staffApplications';
          else if (item.force || item.nccStatus) targetCollection = 'defenceTrainingRegistrations';
        }
        await firebaseService.deleteDocument(targetCollection, id);
        alert('Record deleted successfully.');
      }
    } catch (err) {
      console.error(err);
      alert('Action Failed: Permission Denied or Network Error');
    }
  };

  const handleEditEntry = async (collection: string, row: any) => {
    let targetCol = collection;
    if (collection === 'mixed') {
      if (row.wingSelection || row.principalName) targetCol = 'schoolRegistrations';
      else if (row.wingType || row.nearestStation) targetCol = 'trainerRequests';
      else if (row.post || row.collegeName) targetCol = 'staffApplications';
      else if (row.force || row.nccStatus) targetCol = 'defenceTrainingRegistrations';
    }
    const newName = prompt('Update Name/Institution:', row.schoolName || row.name);
    if (newName) {
      const field = (row.schoolName) ? 'schoolName' : 'name';
      try {
        await firebaseService.updateDocument(targetCol, row.id, { [field]: newName });
        alert('Record updated successfully.');
      } catch (err) {
        alert('Update failed.');
      }
    }
  };

  const renderCategorizedSubmissions = (type: string, collection: string, itemsOverride?: any[]) => {
    const items = itemsOverride || (collection === 'mixed' 
      ? [...data.schools, ...data.trainers, ...data.staffApp, ...data.defence]
      : data[collection] || []);
    
    return (
      <AdminTableView 
        items={items}
        type={type}
        collection={collection}
        onEdit={handleEditEntry}
        onDelete={handleDeleteSubmission}
      />
    );
  };

  const renderSettingsView = () => (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="font-bold text-navy uppercase tracking-widest text-xs mb-6">Contact & Branch Settings</h4>
        <form onSubmit={handleUpdateConfig} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Phone Number</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded font-mono text-sm"
                value={config.phoneNumber}
                onChange={e => setConfig({...config, phoneNumber: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Official Email</label>
              <input 
                type="email" 
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded font-mono text-sm"
                value={config.email}
                onChange={e => setConfig({...config, email: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Headquarters Address</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded font-mono text-sm"
                value={config.address}
                onChange={e => setConfig({...config, address: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h4 className="font-bold text-navy uppercase tracking-widest text-xs mb-6">Social Media Control</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Facebook Link</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded font-mono text-sm"
                  value={config.facebookUrl}
                  onChange={e => setConfig({...config, facebookUrl: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Instagram Link</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded font-mono text-sm"
                  value={config.instagramUrl}
                  onChange={e => setConfig({...config, instagramUrl: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Twitter / X Link</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded font-mono text-sm"
                  value={config.twitterUrl}
                  onChange={e => setConfig({...config, twitterUrl: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={configLoading}
              className="btn-primary w-full italic"
            >
              {configLoading ? 'UPDATING...' : 'SAVE MISSION CONFIGURATION'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
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
                This action is irreversible. Are you absolutely sure you want to terminate <span className="text-ncc-red font-bold">{deleteConfirm.displayTitle}</span>?
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
      {/* Sidebar */}
      <div className="w-64 bg-navy text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold tracking-tighter">CMTD ADMIN</h2>
          <p className="text-[10px] text-ncc-light-blue uppercase font-bold tracking-widest">Master Command</p>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id ? 'bg-ncc-red text-white shadow-lg' : 'hover:bg-white/5 text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-slate-400 transition-all font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
          <h3 className="text-xl font-bold text-navy capitalize">{activeTab} Panel</h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              disabled={loading}
              className="p-2 hover:bg-slate-100 rounded-full transition-all disabled:opacity-50 active:rotate-180"
              title="Force Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Global Search..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            </div>
          ) : activeTab === 'dashboard' ? (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Public Schools", val: data.schools.length, color: "text-navy" },
                  { label: "Staff Managed", val: data.staffSchools.length, color: "text-ncc-red" },
                  { label: "Trainer Requests", val: data.trainers.length, color: "text-navy" },
                  { label: "Defence Applicants", val: data.defence.length, color: "text-navy" }
                ].map((stat) => (
                  <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.val}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold mb-6 text-navy">Submission Overview</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#002366" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold mb-6 text-navy">Priority Distribution</h4>
                  <div className="p-12 text-center text-slate-300 font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-xl">
                    Live Analytics Feed Active
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              {renderCategorizedSubmissions("Latest", "mixed", [...data.schools, ...data.trainers, ...data.staffApp, ...data.defence].slice(0, 10))}
            </div>
          ) : activeTab === 'schools' ? (
            renderCategorizedSubmissions("School", "schoolRegistrations")
          ) : activeTab === 'staff_schools' ? (
            renderStaffSchoolsView()
          ) : activeTab === 'staff_schedules' ? (
            renderStaffSchedulesView()
          ) : activeTab === 'trainers' ? (
            renderCategorizedSubmissions("Trainer", "trainerRequests")
          ) : activeTab === 'staff' ? (
            renderCategorizedSubmissions("Staff App", "staffApplications")
          ) : activeTab === 'defence' ? (
            renderCategorizedSubmissions("Defence", "defenceTrainingRegistrations")
          ) : activeTab === 'staff_manage' ? (
            renderStaffManagementView()
          ) : activeTab === 'notices' ? (
            renderNoticeManagerView()
          ) : activeTab === 'excel_manage' ? (
            renderExcelManagerView()
          ) : activeTab === 'settings' ? (
            renderSettingsView()
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 border-dashed text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Filter className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-400">Settings & Content Admin</h4>
              <p className="text-slate-400 mt-2">Manage website text, phone numbers, and staff accounts.</p>
              <button className="mt-6 btn-primary">Initialise Config Editor</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
