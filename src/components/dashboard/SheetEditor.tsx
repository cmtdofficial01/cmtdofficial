import React from 'react';
import { ChevronLeft, FileSpreadsheet, Plus, Save, Search, Type, Bold, Italic, Pencil, Trash2, Check } from 'lucide-react';

interface SheetEditorProps {
  activeSheetEditor: {
    fileId: string;
    fileName: string;
    sheets: { name: string; data: string[][] }[];
  };
  sheetStats: { rows: number; cols: number };
  onClose: () => void;
  onAddRow: (count?: number) => void;
  onAddColumn: () => void;
  onUpdateCell: (row: number, col: number, value: string) => void;
  onAddTab: () => void;
  onRenameTab: (index: number, name: string) => void;
  onDeleteTab: (index: number) => void;
  activeTabIndex: number;
  onTabChange: (index: number) => void;
  downloadCSV: () => void;
  onDeleteExcel: () => void;
  isSyncing?: boolean;
}

interface GridCellProps {
  rIdx: number;
  cIdx: number;
  cell: string;
  isActive: boolean;
  isSelected: boolean;
  onUpdateCell: (r: number, c: number, val: string) => void;
  onMouseDown: (r: number, c: number) => void;
  onMouseEnter: (r: number, c: number) => void;
  onFocus: (r: number, c: number) => void;
  isMouseDown: boolean;
}

const GridCell = React.memo<GridCellProps>(({ 
  rIdx, cIdx, cell, isActive, isSelected, onUpdateCell, onMouseDown, onMouseEnter, onFocus, isMouseDown 
}) => {
  const [localValue, setLocalValue] = React.useState(cell);

  React.useEffect(() => {
    setLocalValue(cell);
  }, [cell]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    onUpdateCell(rIdx, cIdx, val);
  };

  return (
    <td 
      className={`p-0 border-r border-b border-[#e0e0e0] min-w-[120px] h-[24px] relative group focus-within:ring-2 focus-within:ring-blue-500 focus-within:z-10 cursor-cell ${
        isActive ? 'ring-2 ring-blue-500 z-10' : ''
      } ${isSelected && !isActive ? 'bg-blue-100/50' : ''}`}
      onMouseDown={() => onMouseDown(rIdx, cIdx)}
      onMouseEnter={() => onMouseEnter(rIdx, cIdx)}
    >
      <input 
        type="text"
        value={localValue}
        onChange={handleChange}
        onFocus={() => onFocus(rIdx, cIdx)}
        className="w-full h-full px-2 text-[13px] text-slate-800 bg-transparent outline-none selection:bg-blue-200 select-text cursor-text"
      />
    </td>
  );
}, (prev, next) => {
  return prev.cell === next.cell && 
         prev.isActive === next.isActive && 
         prev.isSelected === next.isSelected &&
         prev.isMouseDown === next.isMouseDown;
});

interface GridRowProps {
  rIdx: number;
  row: string[];
  activeCell: { r: number; c: number } | null;
  isInSelection: (r: number, c: number) => boolean;
  isRowInSelection: (r: number) => boolean;
  onUpdateCell: (r: number, c: number, val: string) => void;
  handleMouseDown: (r: number, c: number) => void;
  handleMouseEnter: (r: number, c: number) => void;
  handleCellFocus: (r: number, c: number) => void;
  isMouseDown: boolean;
}

const GridRow = React.memo<GridRowProps>(({ 
  rIdx, row, activeCell, isInSelection, isRowInSelection, 
  onUpdateCell, handleMouseDown, handleMouseEnter, handleCellFocus, isMouseDown 
}) => {
  return (
    <tr className="h-[24px]">
      <td className={`w-10 border-r border-b border-slate-300 text-[10px] text-center sticky left-0 z-20 font-sans transition-colors ${
        isRowInSelection(rIdx) ? 'bg-[#e8f0fe] text-blue-600 border-r-2 border-r-blue-500' : 'bg-[#f8f9fa] text-slate-500'
      }`}>
        {rIdx + 1}
      </td>
      {row.map((cell, cIdx) => (
        <GridCell 
          key={cIdx} 
          rIdx={rIdx} 
          cIdx={cIdx} 
          cell={cell} 
          isActive={activeCell?.r === rIdx && activeCell?.c === cIdx} 
          isSelected={isInSelection(rIdx, cIdx)} 
          onUpdateCell={onUpdateCell} 
          onMouseDown={handleMouseDown} 
          onMouseEnter={handleMouseEnter} 
          onFocus={handleCellFocus}
          isMouseDown={isMouseDown}
        />
      ))}
    </tr>
  );
}, (prev, next) => {
  return prev.row === next.row && 
         prev.activeCell?.r !== prev.rIdx && next.activeCell?.r !== next.rIdx && // Neither was active
         prev.isMouseDown === next.isMouseDown &&
         prev.activeCell === next.activeCell; // This is a bit loose but helps
});

export const SheetEditor: React.FC<SheetEditorProps> = ({
  activeSheetEditor,
  sheetStats,
  onClose,
  onAddRow,
  onAddColumn,
  onUpdateCell,
  onAddTab,
  onRenameTab,
  onDeleteTab,
  activeTabIndex,
  onTabChange,
  downloadCSV,
  onDeleteExcel,
  isSyncing
}) => {
  const [activeCell, setActiveCell] = React.useState<{ r: number, c: number } | null>(null);
  const [selectionStart, setSelectionStart] = React.useState<{ r: number, c: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = React.useState<{ r: number, c: number } | null>(null);
  const [isMouseDown, setIsMouseDown] = React.useState(false);

  const [deleteTabIdx, setDeleteTabIdx] = React.useState<number | null>(null);
  const [showDeleteExcelModal, setShowDeleteExcelModal] = React.useState(false);
  const [renameTabIdx, setRenameTabIdx] = React.useState<number | null>(null);
  const [renameValue, setRenameValue] = React.useState('');

  React.useEffect(() => {
    const handleGlobalMouseUp = () => setIsMouseDown(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const getColLabel = (i: number) => {
    let label = '';
    let n = i;
    while (n >= 0) {
      label = String.fromCharCode(65 + (n % 26)) + label;
      n = Math.floor(n / 26) - 1;
    }
    return label;
  };

  const selectionBounds = React.useMemo(() => {
    if (!selectionStart || !selectionEnd) return null;
    return {
      minR: Math.min(selectionStart.r, selectionEnd.r),
      maxR: Math.max(selectionStart.r, selectionEnd.r),
      minC: Math.min(selectionStart.c, selectionEnd.c),
      maxC: Math.max(selectionStart.c, selectionEnd.c)
    };
  }, [selectionStart, selectionEnd]);

  const isInSelection = React.useCallback((r: number, c: number) => {
    if (!selectionBounds) return false;
    const { minR, maxR, minC, maxC } = selectionBounds;
    return r >= minR && r <= maxR && c >= minC && c <= maxC;
  }, [selectionBounds]);

  const handleMouseDown = (r: number, c: number) => {
    setIsMouseDown(true);
    setSelectionStart({ r, c });
    setSelectionEnd({ r, c });
    setActiveCell({ r, c });
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isMouseDown) {
      setSelectionEnd({ r, c });
    }
  };

  const isRowInSelection = (r: number) => {
    if (!selectionBounds) return false;
    return r >= selectionBounds.minR && r <= selectionBounds.maxR;
  };

  const isColInSelection = (c: number) => {
    if (!selectionBounds) return false;
    return c >= selectionBounds.minC && c <= selectionBounds.maxC;
  };

  const currentSheet = activeSheetEditor.sheets[activeTabIndex] || { name: 'Sheet1', data: [[]] };

  const handleCellFocus = (r: number, c: number) => {
    if (!isMouseDown) {
      setSelectionStart({ r, c });
      setSelectionEnd({ r, c });
      setActiveCell({ r, c });
    }
  };

  const handleClearSelection = () => {
    if (!selectionBounds) return;
    const { minR, maxR, minC, maxC } = selectionBounds;

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        onUpdateCell(r, c, '');
      }
    }
  };

  const hasRangeSelection = selectionStart && selectionEnd && (selectionStart.r !== selectionEnd.r || selectionStart.c !== selectionEnd.c);
  
  const handlePaste = (e: React.ClipboardEvent) => {
    if (!activeCell) return;
    e.preventDefault();
    const clipboardData = e.clipboardData.getData('text');
    if (!clipboardData) return;

    // Standard spreadsheet copy format is Tab-Separated (TSV)
    const rows = clipboardData.split(/\r?\n/).filter(row => row.length > 0);
    const startR = activeCell.r;
    const startC = activeCell.c;

    rows.forEach((rowStr, rIdx) => {
      const cols = rowStr.split('\t');
      cols.forEach((val, cIdx) => {
        const targetR = startR + rIdx;
        const targetC = startC + cIdx;
        // Only update if within bounds
        if (targetR < currentSheet.data.length && targetC < (currentSheet.data[0]?.length || 0)) {
          onUpdateCell(targetR, targetC, val);
        }
      });
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // If typing in an input, don't trigger global shortcuts
    if ((e.target as HTMLElement).tagName === 'INPUT') {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // If it's a range selection (not just focused in one cell)
        if (hasRangeSelection) {
          e.preventDefault();
          handleClearSelection();
        }
      }
      return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      handleClearSelection();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-white flex flex-col font-sans overflow-hidden text-slate-800"
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      tabIndex={0} // Make div focusable to catch key events
    >
      {/* Simple Header Bar */}
      <div className="bg-[#f9fbfd] border-b border-[#e0e0e0] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-1 px-2 hover:bg-slate-200 rounded cursor-pointer" onClick={onClose} title="Back to Dashboard">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            <h3 className="text-base font-semibold leading-tight">{activeSheetEditor.fileName}</h3>
            <div className="ml-4 flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Auto-Sync Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[10px] text-slate-400 font-medium">
            Every change is automatically saved to the cloud
          </div>
          <button 
            onClick={() => setShowDeleteExcelModal(true)}
            className="p-1 px-3 bg-red-50 text-red-600 hover:bg-red-100 rounded border border-red-200 text-[10px] font-bold uppercase transition-all shadow-sm"
          >
            Delete Excel
          </button>
        </div>
      </div>

      {/* Tabs Navigation at Top */}
      <div className="bg-[#f8f9fa] border-b border-[#e0e0e0] flex items-center h-[36px] shrink-0 overflow-hidden shadow-sm select-none">
        <div className="flex h-full items-center px-2 gap-1 border-r border-slate-300 bg-white/50">
           <button 
             onClick={onAddTab}
             className="px-3 h-7 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded flex items-center gap-1.5 text-[11px] font-black transition-all border border-blue-100 uppercase"
             title="Create New Strategic Sheet"
           >
             <Plus className="w-3.5 h-3.5" /> New Sheet
           </button>
        </div>
        <div className="flex-1 flex items-center overflow-x-auto scrollbar-hide h-full px-1">
           {activeSheetEditor.sheets.map((tab, idx) => (
             <div 
               key={idx}
               className={`group flex items-center h-[80%] px-4 mx-0.5 rounded-t-md border-x border-t text-[12px] font-bold cursor-pointer transition-all relative whitespace-nowrap min-w-max ${
                 activeTabIndex === idx 
                   ? 'bg-white text-blue-700 border-slate-300 shadow-[0_-2px_0_0_#2563eb_inset]' 
                   : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200/50'
               }`}
               onClick={() => onTabChange(idx)}
             >
               <span className="select-none tracking-tight">{tab.name}</span>
               
               <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     setRenameTabIdx(idx);
                     setRenameValue(tab.name);
                   }}
                   className="p-1 hover:bg-white/80 hover:text-blue-600 rounded shadow-sm border border-transparent hover:border-blue-100"
                   title="Rename Sheet"
                 >
                   <Pencil className="w-3 h-3" />
                 </button>
                 
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     setDeleteTabIdx(idx);
                   }}
                   className="p-1 hover:bg-white/80 hover:text-red-600 rounded shadow-sm border border-transparent hover:border-red-100"
                   title="Delete Sheet"
                 >
                   <Trash2 className="w-3 h-3" />
                 </button>
               </div>
             </div>
           ))}
        </div>
        <div className="px-4 text-[10px] text-slate-500 font-mono tracking-widest border-l border-slate-300 bg-white/30 h-full flex items-center gap-2 uppercase">
          <span className="opacity-40">Matrix:</span> {currentSheet.data.length} × {currentSheet.data[0]?.length || 0}
        </div>
      </div>

      {/* Basic Toolbar Layer */}
      <div className="bg-[#f0f4f9] px-4 py-1 flex items-center gap-2 border-b border-[#e0e0e0]">
        <button onClick={() => onAddRow(1)} className="p-1.5 hover:bg-white rounded text-slate-600 flex items-center gap-1 text-[11px] font-bold" title="Add Row">
          <Plus className="w-4 h-4" /> Add Row
        </button>
        {hasRangeSelection && (
          <>
            <div className="w-[1px] h-4 bg-slate-300 mx-2"></div>
            <button 
              onClick={handleClearSelection} 
              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded flex items-center gap-1 text-[11px] font-bold transition-colors" 
              title="Clear Selected Cells"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Range
            </button>
          </>
        )}
        <div className="w-[1px] h-4 bg-slate-300 mx-2"></div>
        <button onClick={downloadCSV} className="p-1.5 hover:bg-white rounded text-slate-600 whitespace-nowrap text-[11px] font-bold" title="Export CSV">
          Download CSV
        </button>
      </div>

      {/* Formula Bar / Cell Status */}
      <div className="bg-white border-b border-[#e0e0e0] flex items-center px-4 py-1.5">
        <div className="w-16 text-center text-xs text-slate-500 font-medium border-r border-[#e0e0e0] mr-2">
          {activeCell ? `${getColLabel(activeCell.c)}${activeCell.r + 1}` : ''}
        </div>
        <div className="flex items-center gap-2 text-slate-400 italic text-[13px] px-2 flex-1">
          <span className="font-bold text-slate-500 not-italic">fx |</span>
          <input 
            type="text"
            className="w-full bg-transparent outline-none not-italic text-slate-800"
            value={activeCell ? currentSheet.data[activeCell.r][activeCell.c] : ''}
            onChange={(e) => activeCell && onUpdateCell(activeCell.r, activeCell.c, e.target.value)}
            placeholder="Type content..."
          />
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 overflow-auto bg-[#f8f9fa] select-none">
        <div className="relative inline-block min-w-full">
          <table className="border-collapse table-fixed bg-white">
            <thead className="sticky top-0 z-30">
              <tr className="h-[26px]">
                <th className="w-10 bg-[#f8f9fa] border-r border-b border-slate-300 sticky left-0 z-40"></th>
                {Array.from({ length: currentSheet.data[0]?.length || 20 }).map((_, i) => (
                  <th 
                    key={i} 
                    className={`min-w-[120px] border-r border-b border-slate-300 text-[11px] font-medium text-center uppercase transition-colors ${
                      isColInSelection(i) ? 'bg-[#e8f0fe] text-blue-600 border-b-2 border-b-blue-500' : 'bg-[#f8f9fa] text-slate-500'
                    }`}
                  >
                    {getColLabel(i)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentSheet.data.map((row, rIdx) => (
                <GridRow 
                  key={rIdx}
                  rIdx={rIdx}
                  row={row}
                  activeCell={activeCell}
                  isInSelection={isInSelection}
                  isRowInSelection={isRowInSelection}
                  onUpdateCell={onUpdateCell}
                  handleMouseDown={handleMouseDown}
                  handleMouseEnter={handleMouseEnter}
                  handleCellFocus={handleCellFocus}
                  isMouseDown={isMouseDown}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Bottom Status Bar */}
      <div className="bg-[#f8f9fa] border-t border-[#e0e0e0] px-4 py-1 flex items-center justify-between h-[24px] shrink-0">
        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
          <span>CLOUD SPREADSHEET</span>
          <div className="h-3 w-[1px] bg-slate-300 mx-1"></div>
          <span>Rows: {currentSheet.data.length}</span>
          <span>Cols: {currentSheet.data[0]?.length || 0}</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold tracking-tight uppercase">
          {isSyncing ? (
            <span className="text-blue-600 animate-pulse flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              Saving to Cloud...
            </span>
          ) : (
            <span className="text-green-600 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteTabIdx !== null && (
        <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                <Trash2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Sheet?</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                You're about to delete <span className="font-bold text-slate-700">"{activeSheetEditor.sheets[deleteTabIdx]?.name}"</span>. 
                This action is permanent and cannot be undone. Are you sure?
              </p>
            </div>
            <div className="flex border-t border-slate-100 bg-slate-50 p-3 gap-3">
              <button 
                onClick={() => setDeleteTabIdx(null)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onDeleteTab(deleteTabIdx);
                  setDeleteTabIdx(null);
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Full Excel Delete Confirmation Modal */}
      {showDeleteExcelModal && (
        <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-200">
                <Trash2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Entire Excel?</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                You are about to permanently delete <span className="font-bold text-slate-700">"{activeSheetEditor.fileName}"</span> and all its sheets. This cannot be recovered.
              </p>
            </div>
            <div className="flex border-t border-slate-100 bg-slate-50 p-3 gap-3">
              <button 
                onClick={() => setShowDeleteExcelModal(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onDeleteExcel();
                  setShowDeleteExcelModal(false);
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Sheet Rename Modal */}
      {renameTabIdx !== null && (
        <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                <Pencil className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-slate-800 mb-1 uppercase tracking-tight">Rename Sheet</h2>
              <p className="text-slate-500 text-xs mb-4">Enter the new name for this database tab.</p>
              
              <div className="relative">
                <input 
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && renameValue.trim()) {
                      onRenameTab(renameTabIdx, renameValue.trim());
                      setRenameTabIdx(null);
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                  placeholder="Sheet Name..."
                />
              </div>
            </div>
            <div className="flex border-t border-slate-100 p-3 bg-slate-50/50 gap-3">
              <button 
                onClick={() => setRenameTabIdx(null)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm tracking-tight hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (renameValue.trim()) {
                    onRenameTab(renameTabIdx, renameValue.trim());
                    setRenameTabIdx(null);
                  }
                }}
                disabled={!renameValue.trim()}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm tracking-widest uppercase hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

