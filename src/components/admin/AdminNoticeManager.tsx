import React from 'react';
import { Megaphone, Trash2 } from 'lucide-react';

interface AdminNoticeManagerProps {
  notices: any[];
  noticeForm: { text: string; priority: string };
  onFormChange: (form: { text: string; priority: string }) => void;
  onPostNotice: (e: React.FormEvent) => void;
  onDeleteNotice: (id: string) => void;
}

export const AdminNoticeManager: React.FC<AdminNoticeManagerProps> = ({
  notices,
  noticeForm,
  onFormChange,
  onPostNotice,
  onDeleteNotice
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="font-bold text-navy uppercase tracking-widest text-xs mb-6">Dispatch New Deployment Notice</h4>
        <form onSubmit={onPostNotice} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Official statement or deployment instruction..." 
            className="flex-grow bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm italic"
            value={noticeForm.text}
            onChange={e => onFormChange({ ...noticeForm, text: e.target.value })}
            required
          />
          <select 
            className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm font-bold"
            value={noticeForm.priority}
            onChange={e => onFormChange({ ...noticeForm, priority: e.target.value })}
          >
            <option value="normal">Normal</option>
            <option value="high">Urgent</option>
          </select>
          <button className="bg-navy text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-ncc-red transition-all shadow-lg">DISPATCH</button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h4 className="font-bold text-navy uppercase tracking-widest text-xs">Dispatch History</h4>
        </div>
        <div className="p-4 space-y-4">
          {notices.map((n: any) => (
            <div key={n.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex gap-4 items-start">
                <div className={`mt-1 w-2 h-2 rounded-full ${n.priority === 'high' ? 'bg-ncc-red animate-pulse' : 'bg-navy'}`}></div>
                <div>
                  <p className="text-sm font-bold text-navy">{n.text}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Issued: {n.date?.seconds ? new Date(n.date.seconds * 1000).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
              <button 
                onClick={() => onDeleteNotice(n.id)}
                className="text-slate-400 hover:text-ncc-red transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
