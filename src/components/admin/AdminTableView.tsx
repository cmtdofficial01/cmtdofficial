import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface AdminTableViewProps {
  items: any[];
  type: string;
  collection: string;
  onEdit: (collection: string, row: any) => void;
  onDelete: (collection: string, id: string, item: any) => void;
}

export const AdminTableView: React.FC<AdminTableViewProps> = ({
  items,
  type,
  collection,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h4 className="font-bold text-navy uppercase tracking-widest text-xs">{type} Submissions</h4>
        <span className="text-xs font-bold text-slate-400">{items.length} Records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
              <th className="px-6 py-3 font-bold">Name / Institution</th>
              <th className="px-6 py-3 font-bold">Location / Detail</th>
              <th className="px-6 py-3 font-bold">Contact</th>
              <th className="px-6 py-3 font-bold">Date</th>
              <th className="px-6 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100 italic font-mono">
            {items.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-navy">{row.schoolName || row.name}</td>
                <td className="px-6 py-4 text-slate-500">{row.location || row.post || row.force}</td>
                <td className="px-6 py-4 font-medium">{row.contactNumber || row.mobile}</td>
                <td className="px-6 py-4 text-slate-400">{row.createdAt?.seconds ? new Date(row.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(collection, row)}
                      className="p-1 text-slate-400 hover:text-navy"
                      title="Edit Entry"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(collection, row.id, row)}
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
};
