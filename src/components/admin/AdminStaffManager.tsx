import React from 'react';
import { UserCheck, UserCog, Trash2 } from 'lucide-react';

interface AdminStaffManagerProps {
  staffAccounts: any[];
  staffSchools: any[];
  staffForm: any;
  editingStaff: string | null;
  submitting: boolean;
  onFormChange: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEdit: (staff: any) => void;
  onImpersonate: (staff: any) => void;
  onDelete: (id: string, userId: string) => void;
  onCancelEdit: () => void;
}

export const AdminStaffManager: React.FC<AdminStaffManagerProps> = ({
  staffAccounts,
  staffSchools,
  staffForm,
  editingStaff,
  submitting,
  onFormChange,
  onSubmit,
  onEdit,
  onImpersonate,
  onDelete,
  onCancelEdit
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-navy uppercase tracking-widest text-xs">
            {editingStaff ? 'Edit Staff Account' : 'Create New Staff Account'}
          </h4>
          {editingStaff && (
            <button 
              onClick={onCancelEdit}
              className="text-[10px] font-bold text-ncc-red uppercase hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Staff Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-mono"
              value={staffForm.name}
              onChange={e => onFormChange({...staffForm, name: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Mobile Number</label>
            <input 
              type="text" 
              required
              placeholder="+91..."
              className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-mono"
              value={staffForm.mobile}
              onChange={e => onFormChange({...staffForm, mobile: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">User ID</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-mono"
              value={staffForm.userId}
              onChange={e => onFormChange({...staffForm, userId: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Password</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-mono"
              value={staffForm.password}
              onChange={e => onFormChange({...staffForm, password: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Directorate / Area</label>
            <input 
              type="text" 
              required
              placeholder="e.g. WB & Sikkim"
              className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-mono"
              value={staffForm.area}
              onChange={e => onFormChange({...staffForm, area: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Post / Rank</label>
            <input 
              type="text" 
              required
              placeholder="e.g. JCI / Staff"
              className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-mono"
              value={staffForm.post}
              onChange={e => onFormChange({...staffForm, post: e.target.value})}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-6 mt-2">
            <button 
              disabled={submitting}
              className="bg-navy text-white px-12 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-ncc-red transition-all shadow-lg w-full md:w-auto italic"
            >
              {submitting ? 'Processing...' : (editingStaff ? 'UPDATE ACCOUNT' : 'CREATE ACCOUNT')}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h4 className="font-bold text-navy uppercase tracking-widest text-xs">Staff Directory</h4>
          <span className="text-xs font-bold text-slate-400">{staffAccounts.length} Staff Members</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
                <th className="px-6 py-3 font-bold">Staff Name</th>
                <th className="px-6 py-3 font-bold">Mobile</th>
                <th className="px-6 py-3 font-bold">User ID</th>
                <th className="px-6 py-3 font-bold">Password</th>
                <th className="px-6 py-3 font-bold">Area</th>
                <th className="px-6 py-3 font-bold">Post</th>
                <th className="px-6 py-3 font-bold text-center">School Count</th>
                <th className="px-6 py-3 font-bold">Last Active</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 font-mono italic">
              {staffAccounts.map((staff: any) => {
                const schoolCount = staffSchools.filter((s: any) => s.staffId === staff.userId).length;
                return (
                  <tr key={staff.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-navy">{staff.name}</td>
                    <td className="px-6 py-4 text-slate-500">{staff.mobile || '---'}</td>
                    <td className="px-6 py-4 text-slate-500">{staff.userId}</td>
                    <td className="px-6 py-4 text-slate-400 select-all">{staff.password}</td>
                    <td className="px-6 py-4">{staff.area || staff.role}</td>
                    <td className="px-6 py-4">{staff.post || '---'}</td>
                    <td className="px-6 py-4 text-center font-bold text-ncc-red">{schoolCount}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-sans">
                      {staff.lastLogin?.seconds ? new Date(staff.lastLogin.seconds * 1000).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => onImpersonate(staff)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-[10px] font-black text-navy hover:bg-ncc-red hover:text-white transition-all shadow-sm"
                      >
                        <UserCheck className="w-3 h-3" />
                        PROFILE VIEW
                      </button>
                      <button 
                        onClick={() => onEdit(staff)}
                        className="p-1 hover:text-navy transition-colors inline-block"
                      >
                        <UserCog className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(staff.id, staff.userId)}
                        className="p-1 hover:text-ncc-red transition-colors inline-block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
