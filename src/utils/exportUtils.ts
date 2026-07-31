import ExcelJS from 'exceljs';

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

/**
 * Exports data to Microsoft Excel (.xlsx) file with professional formatting.
 */
export async function exportToExcel(
  filename: string,
  sheetName: string,
  columns: ExportColumn[],
  data: Record<string, any>[]
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns.map(c => ({
    header: c.header,
    key: c.key,
    width: c.width || Math.max(c.header.length + 6, 16)
  }));

  // Style Header Row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11, name: 'Calibri' };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '1E293B' } // Dark slate background
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  headerRow.height = 26;

  // Add Data Rows with alternating background color and clean formatting
  data.forEach((item, index) => {
    const rowValues: Record<string, any> = {};
    columns.forEach(col => {
      let val = item[col.key];
      if (Array.isArray(val)) {
        val = val.join('; ');
      } else if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val);
      }
      rowValues[col.key] = val !== undefined && val !== null ? val : '';
    });

    const row = worksheet.addRow(rowValues);
    row.height = 22;
    row.font = { size: 10, name: 'Calibri' };
    row.alignment = { vertical: 'middle', wrapText: false };

    // Zebra striping
    if (index % 2 === 1) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F8FAFC' }
      };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports data to CSV (.csv) file with UTF-8 BOM for Excel compatibility.
 */
export function exportToCsv(
  filename: string,
  columns: ExportColumn[],
  data: Record<string, any>[]
) {
  const escapeCsvField = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = Array.isArray(val) ? val.join('; ') : String(val);
    const clean = str.replace(/"/g, '""');
    return `"${clean}"`;
  };

  const headerRow = columns.map(c => escapeCsvField(c.header)).join(',');
  const rows = data.map(item => {
    return columns.map(col => {
      let val = item[col.key];
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        val = JSON.stringify(val);
      }
      return escapeCsvField(val);
    }).join(',');
  });

  const csvContent = [headerRow, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
