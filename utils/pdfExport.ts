import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportToPDFOptions {
  title: string;
  filename: string;
  headers: string[];
  data: (string | number)[][];
}

export const exportToPDF = ({ title, filename, headers, data }: ExportToPDFOptions) => {
  const doc = new jsPDF();

  // Add Company Logo / Brand Name
  doc.setFontSize(22);
  doc.setTextColor(229, 75, 75); // TransitOps primary color (#E54B4B)
  doc.setFont("helvetica", "bold");
  doc.text("TransitOps", 14, 20);

  // Add Report Title
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(title, 14, 30);

  // Add Generation Date
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("helvetica", "normal");
  const dateStr = new Date().toLocaleString();
  doc.text(`Generated on: ${dateStr}`, 14, 38);

  // Add Table
  autoTable(doc, {
    startY: 45,
    head: [headers],
    body: data,
    theme: 'grid',
    headStyles: {
      fillColor: [229, 75, 75], // primary color
      textColor: 255,
      fontStyle: 'bold',
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 5,
    },
    didDrawPage: (dataArg) => {
      // Add Page Number at the bottom
      const str = `Page ${doc.internal.getNumberOfPages()}`;
      doc.setFontSize(10);
      doc.setTextColor(100);
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text(str, dataArg.settings.margin.left, pageHeight - 10);
    },
  });

  doc.save(filename);
};
