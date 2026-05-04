import React from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';

interface AdminExcelManagerProps {
  sheets: string[];
  activeSheet: string;
  sheetData: any;
  onSelectSheet: (sheet: string) => void;
  onRenameSheet: (sheet: string) => void;
  onDeleteSheet: (sheet: string) => void;
  onAddSheet: (name: string) => void;
  onCellUpdate: (sheet: string, r: number, c: number, value: string) => void;
}

export const AdminExcelManager: React.FC<AdminExcelManagerProps> = ({
  sheets,
  activeSheet,
  sheetData,
  onSelectSheet,
  onRenameSheet,
  onDeleteSheet,
  onAddSheet,
  onCellUpdate
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xl">
        <div className="p-2 bg-[#f8f9fa] border-b border-slate-200 flex overflow-x-auto gap-1">
          {sheets.map(sheet => (
            <div key={sheet} className="flex items-center group relative">
              <button 
                onClick={() => onSelectSheet(sheet)}
                className={`px-6 py-2 rounded-t-lg font-bold text-[11px] uppercase transition-all flex items-center gap-2 border-x border-t ${
                  activeSheet === sheet 
                    ? 'bg-white text-blue-600 border-slate-200 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]' 
                    : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-200'
                }`}
              >
                {sheet}
              </button>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded px-1">
                <button 
                  onClick={() => onRenameSheet(sheet)}
                  className="p-1 hover:text-blue-600 transition-colors text-slate-400"
                  title="Rename"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => onDeleteSheet(sheet)}
                  className="p-1 hover:text-ncc-red transition-colors text-slate-400"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex gap-1 items-center bg-white px-3 py-1 rounded-t-lg border border-slate-200 ml-2">
            <Plus className="w-3 h-3 text-green-600" />
            <input 
              type="text" 
              placeholder="NEW LIST..."
              className="bg-transparent text-[10px] uppercase font-black w-20 outline-none"
              id="newSheetInput"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const name = (e.target as HTMLInputElement).value;
                  if (name) {
                    onAddSheet(name);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="overflow-auto max-h-[600px] bg-slate-100">
          <table className="border-collapse table-fixed bg-white">
            <thead className="sticky top-0 z-30">
              <tr className="h-8">
                <th className="w-10 bg-[#f8f9fa] border-r border-b border-slate-300 sticky left-0 z-40"></th>
                {Array.from({ length: 20 }).map((_, i) => {
                  let label = '';
                  let n = i;
                  while (n >= 0) {
                    label = String.fromCharCode(65 + (n % 26)) + label;
                    n = Math.floor(n / 26) - 1;
                  }
                  return (
                    <th key={i} className="min-w-[150px] bg-[#f8f9fa] border-r border-b border-slate-300 text-[11px] font-medium text-slate-500 text-center uppercase">
                      {label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 100 }).map((_, r) => (
                <tr key={r} className="h-8">
                  <td className="w-10 bg-[#f8f9fa] border-r border-b border-slate-300 text-[10px] text-slate-500 text-center sticky left-0 z-20 font-sans">
                    {r + 1}
                  </td>
                  {Array.from({ length: 20 }).map((_, c) => {
                    const key = `${activeSheet}-${r}-${c}`;
                    return (
                      <td key={c} className="border-r border-b border-slate-200 min-w-[150px] h-8 p-0 group focus-within:ring-1 focus-within:ring-blue-500">
                        <input 
                          type="text" 
                          className="w-full h-full px-2 text-[13px] text-slate-800 bg-transparent outline-none focus:bg-blue-50"
                          value={sheetData[key] || ''}
                          onChange={(e) => onCellUpdate(activeSheet, r, c, e.target.value)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-[#f8f9fa] border-t border-slate-200 text-[10px] font-bold text-slate-500 flex justify-between uppercase">
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> {activeSheet} ACTIVE</span>
             <span className="text-slate-300">|</span>
             <span>100 Rows x 20 Columns</span>
          </div>
          <span className="italic text-slate-400">Google-Style Grid Engine Enabled</span>
        </div>
      </div>
    </div>
  );
};
