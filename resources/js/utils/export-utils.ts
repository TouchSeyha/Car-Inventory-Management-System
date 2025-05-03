import { SalesReportData } from "@/types/report";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { Packer, Document, Paragraph, Table, TableCell, TableRow, HeadingLevel} from "docx";

// Format currency for exports
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Export to PDF
export const exportToPdf = async (
  reportData: SalesReportData,
  title: string,
  periodRange: { start: string; end: string }
) => {
  // Create PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add period
  doc.setFontSize(12);
  doc.text(`Period: ${periodRange.start} to ${periodRange.end}`, 14, 32);
  
  // Add summary section
  doc.setFontSize(14);
  doc.text("Summary", 14, 45);
  
  const summaryData = [
    ["Total Sales", reportData.summary.totalSales.toString()],
    ["Total Revenue", formatCurrency(reportData.summary.totalRevenue)],
    ["Average Order Value", formatCurrency(reportData.summary.averageOrder)],
    ["Top Selling Product", reportData.summary.topSellingProduct],
    ["Customer Retention Rate", `${reportData.summary.customerRetentionRate}%`],
    ["Total Inventory Value", formatCurrency(reportData.summary.inventoryValue)],
  ];
  
  autoTable(doc, {
    startY: 50,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "striped",
    headStyles: { fillColor: [66, 66, 204] },
  });
  
  // Add top products section
  const topProductsY = (doc as any).lastAutoTable.finalY + 15;
  doc.text("Top Selling Products", 14, topProductsY);
  
  const topProductsData = reportData.topProducts.map(product => [
    product.name,
    product.quantity.toString(),
    formatCurrency(product.total)
  ]);
  
  autoTable(doc, {
    startY: topProductsY + 5,
    head: [["Product", "Quantity", "Total Revenue"]],
    body: topProductsData,
    theme: "striped",
    headStyles: { fillColor: [66, 66, 204] },
  });
  
  // Add sales by category section
  const categoriesY = (doc as any).lastAutoTable.finalY + 15;
  doc.text("Sales by Category", 14, categoriesY);
  
  const categoriesData = reportData.salesByCategory.map(category => [
    category.name,
    category.value.toString(),
    formatCurrency(category.amount)
  ]);
  
  autoTable(doc, {
    startY: categoriesY + 5,
    head: [["Category", "Units Sold", "Amount"]],
    body: categoriesData,
    theme: "striped",
    headStyles: { fillColor: [66, 66, 204] },
  });
  
  // Add monthly sales data
  const monthlyY = (doc as any).lastAutoTable.finalY + 15;
  doc.text("Monthly Sales", 14, monthlyY);
  
  const monthlyData = reportData.monthlySales.map(monthly => [
    monthly.month,
    monthly.sales.toString(),
    formatCurrency(monthly.revenue),
    formatCurrency(monthly.profit)
  ]);
  
  autoTable(doc, {
    startY: monthlyY + 5,
    head: [["Month", "Sales", "Revenue", "Profit"]],
    body: monthlyData,
    theme: "striped",
    headStyles: { fillColor: [66, 66, 204] },
  });
  
  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_${periodRange.start}_to_${periodRange.end}.pdf`);
};

// Export to Word
export const exportToWord = async (
  reportData: SalesReportData,
  title: string,
  periodRange: { start: string; end: string }
) => {
  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            spacing: {
              after: 200,
            },
          }),
          
          // Period range
          new Paragraph({
            text: `Period: ${periodRange.start} to ${periodRange.end}`,
            spacing: {
              after: 400,
            },
          }),
          
          // Summary heading
          new Paragraph({
            text: "Summary",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              after: 200,
            },
          }),
          
          // Summary table
          new Table({
            width: {
              size: 100,
              type: 'pct',
            },
            rows: [
              // Header row
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    children: [new Paragraph("Metric")],
                    shading: {
                      fill: "4242CC",
                      color: "FFFFFF",
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph("Value")],
                    shading: {
                      fill: "4242CC",
                      color: "FFFFFF",
                    },
                  }),
                ],
              }),
              // Data rows
              ...Object.entries(reportData.summary).map(([key, value]) => 
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))],
                    }),
                    new TableCell({
                      children: [new Paragraph(
                        typeof value === 'number' && 
                        (key === 'totalRevenue' || key === 'averageOrder' || key === 'inventoryValue') 
                          ? formatCurrency(value) 
                          : key === 'customerRetentionRate' 
                            ? `${value}%`
                            : value.toString()
                      )],
                    }),
                  ],
                })
              ),
            ],
          }),
          
          // Spacing
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),
          
          // Top Products heading
          new Paragraph({
            text: "Top Selling Products",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              after: 200,
            },
          }),
          
          // Top Products table
          new Table({
            width: {
              size: 100,
              type: 'pct',
            },
            rows: [
              // Header row
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    children: [new Paragraph("Product")],
                    shading: {
                      fill: "4242CC",
                      color: "FFFFFF",
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph("Quantity")],
                    shading: {
                      fill: "4242CC",
                      color: "FFFFFF",
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph("Total Revenue")],
                    shading: {
                      fill: "4242CC",
                      color: "FFFFFF",
                    },
                  }),
                ],
              }),
              // Data rows
              ...reportData.topProducts.map(product => 
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph(product.name)],
                    }),
                    new TableCell({
                      children: [new Paragraph(product.quantity.toString())],
                    }),
                    new TableCell({
                      children: [new Paragraph(formatCurrency(product.total))],
                    }),
                  ],
                })
              ),
            ],
          }),
          
          // Spacing
          new Paragraph({
            text: "",
            spacing: {
              after: 200,
            },
          }),
          
          // Sales by Category heading
          new Paragraph({
            text: "Sales by Category",
            heading: HeadingLevel.HEADING_2,
            spacing: {
              after: 200,
            },
          }),
          
          // Categories table
          new Table({
            width: {
              size: 100,
              type: 'pct',
            },
            rows: [
              // Header row
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    children: [new Paragraph("Category")],
                    shading: {
                      fill: "4242CC",
                      color: "FFFFFF",
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph("Units Sold")],
                    shading: {
                      fill: "4242CC",
                      color: "FFFFFF",
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph("Revenue")],
                    shading: {
                      fill: "4242CC",
                      color: "FFFFFF",
                    },
                  }),
                ],
              }),
              // Data rows
              ...reportData.salesByCategory.map(category => 
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph(category.name)],
                    }),
                    new TableCell({
                      children: [new Paragraph(category.value.toString())],
                    }),
                    new TableCell({
                      children: [new Paragraph(formatCurrency(category.amount))],
                    }),
                  ],
                })
              ),
            ],
          }),
        ],
      },
    ],
  });

  // Generate and save the document
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  saveAs(blob, `${title.replace(/\s+/g, '_').toLowerCase()}_${periodRange.start}_to_${periodRange.end}.docx`);
};

// Export to Excel
export const exportToExcel = async (
  reportData: SalesReportData,
  title: string,
  periodRange: { start: string; end: string }
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Car Dealership App';
  workbook.created = new Date();
  
  // Create Summary sheet
  const summarySheet = workbook.addWorksheet('Summary');
  
  // Add title and period
  summarySheet.mergeCells('A1:B1');
  const titleRow = summarySheet.getRow(1);
  titleRow.getCell(1).value = title;
  titleRow.font = { bold: true, size: 16 };
  
  summarySheet.mergeCells('A2:B2');
  const periodRow = summarySheet.getRow(2);
  periodRow.getCell(1).value = `Period: ${periodRange.start} to ${periodRange.end}`;
  
  // Add summary data
  summarySheet.addRow(['', '']);
  summarySheet.addRow(['Metric', 'Value']);
  
  const summaryHeaders = summarySheet.getRow(4);
  summaryHeaders.font = { bold: true };
  summaryHeaders.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4242CC' },
  };
  summaryHeaders.font = { bold: true, color: { argb: 'FFFFFF' } };
  
  // Add summary data
  summarySheet.addRow(['Total Sales', reportData.summary.totalSales]);
  summarySheet.addRow(['Total Revenue', reportData.summary.totalRevenue]);
  summarySheet.getCell('B6').numFmt = '$#,##0.00';
  summarySheet.addRow(['Average Order Value', reportData.summary.averageOrder]);
  summarySheet.getCell('B7').numFmt = '$#,##0.00';
  summarySheet.addRow(['Top Selling Product', reportData.summary.topSellingProduct]);
  summarySheet.addRow(['Customer Retention Rate', `${reportData.summary.customerRetentionRate}%`]);
  summarySheet.addRow(['Total Inventory Value', reportData.summary.inventoryValue]);
  summarySheet.getCell('B10').numFmt = '$#,##0.00';
  
  // Format columns
  summarySheet.columns = [
    { key: 'metric', width: 25 },
    { key: 'value', width: 20 },
  ];
  
  // Create Top Products sheet
  const productsSheet = workbook.addWorksheet('Top Products');
  productsSheet.addRow(['Product', 'Quantity', 'Total Revenue']);
  
  const productsHeader = productsSheet.getRow(1);
  productsHeader.font = { bold: true };
  productsHeader.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4242CC' },
  };
  productsHeader.font = { bold: true, color: { argb: 'FFFFFF' } };
  
  // Add product data
  reportData.topProducts.forEach(product => {
    productsSheet.addRow([product.name, product.quantity, product.total]);
  });
  
  // Format columns
  productsSheet.columns = [
    { key: 'product', width: 30 },
    { key: 'quantity', width: 15 },
    { key: 'total', width: 20, style: { numFmt: '$#,##0.00' } },
  ];
  
  // Create Categories sheet
  const categoriesSheet = workbook.addWorksheet('Categories');
  categoriesSheet.addRow(['Category', 'Units Sold', 'Revenue']);
  
  const categoriesHeader = categoriesSheet.getRow(1);
  categoriesHeader.font = { bold: true };
  categoriesHeader.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4242CC' },
  };
  categoriesHeader.font = { bold: true, color: { argb: 'FFFFFF' } };
  
  // Add category data
  reportData.salesByCategory.forEach(category => {
    categoriesSheet.addRow([category.name, category.value, category.amount]);
  });
  
  // Format columns
  categoriesSheet.columns = [
    { key: 'category', width: 20 },
    { key: 'units', width: 15 },
    { key: 'revenue', width: 20, style: { numFmt: '$#,##0.00' } },
  ];
  
  // Create Monthly Sales sheet
  const monthlySheet = workbook.addWorksheet('Monthly Sales');
  monthlySheet.addRow(['Month', 'Sales', 'Revenue', 'Profit']);
  
  const monthlyHeader = monthlySheet.getRow(1);
  monthlyHeader.font = { bold: true };
  monthlyHeader.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4242CC' },
  };
  monthlyHeader.font = { bold: true, color: { argb: 'FFFFFF' } };
  
  // Add monthly data
  reportData.monthlySales.forEach(monthly => {
    monthlySheet.addRow([monthly.month, monthly.sales, monthly.revenue, monthly.profit]);
  });
  
  // Format columns
  monthlySheet.columns = [
    { key: 'month', width: 15 },
    { key: 'sales', width: 15 },
    { key: 'revenue', width: 20, style: { numFmt: '$#,##0.00' } },
    { key: 'profit', width: 20, style: { numFmt: '$#,##0.00' } },
  ];
  
  // Write to file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${title.replace(/\s+/g, '_').toLowerCase()}_${periodRange.start}_to_${periodRange.end}.xlsx`);
};

// Export to CSV
export const exportToCsv = (
  reportData: SalesReportData,
  title: string,
  periodRange: { start: string; end: string }
) => {
  // Create a CSV content string
  let csvContent = `${title}\n`;
  csvContent += `Period: ${periodRange.start} to ${periodRange.end}\n\n`;
  
  // Summary section
  csvContent += "SUMMARY\n";
  csvContent += "Metric,Value\n";
  csvContent += `Total Sales,${reportData.summary.totalSales}\n`;
  csvContent += `Total Revenue,${reportData.summary.totalRevenue}\n`;
  csvContent += `Average Order Value,${reportData.summary.averageOrder}\n`;
  csvContent += `Top Selling Product,${reportData.summary.topSellingProduct}\n`;
  csvContent += `Customer Retention Rate,${reportData.summary.customerRetentionRate}%\n`;
  csvContent += `Total Inventory Value,${reportData.summary.inventoryValue}\n\n`;
  
  // Top Products section
  csvContent += "TOP SELLING PRODUCTS\n";
  csvContent += "Product,Quantity,Total Revenue\n";
  reportData.topProducts.forEach(product => {
    csvContent += `"${product.name}",${product.quantity},${product.total}\n`;
  });
  csvContent += "\n";
  
  // Categories section
  csvContent += "SALES BY CATEGORY\n";
  csvContent += "Category,Units Sold,Revenue\n";
  reportData.salesByCategory.forEach(category => {
    csvContent += `"${category.name}",${category.value},${category.amount}\n`;
  });
  csvContent += "\n";
  
  // Monthly sales section
  csvContent += "MONTHLY SALES\n";
  csvContent += "Month,Sales,Revenue,Profit\n";
  reportData.monthlySales.forEach(monthly => {
    csvContent += `${monthly.month},${monthly.sales},${monthly.revenue},${monthly.profit}\n`;
  });
  
  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${title.replace(/\s+/g, '_').toLowerCase()}_${periodRange.start}_to_${periodRange.end}.csv`);
};
