import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

async function generate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Remix Archiv2ie';
  workbook.lastModifiedBy = 'Remix Archiv2ie';
  workbook.created = new Date();
  workbook.modified = new Date();

  // 1. Create "Dépôts" sheet
  const depositsSheet = workbook.addWorksheet('Dépôts', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  const headers = [
    "ID Unique",
    "Date",
    "Nom",
    "Email",
    "Statut Déposant",
    "Filière",
    "Semestre",
    "Matière",
    "Nom Document",
    "Type Document",
    "Commentaire",
    "Fichier",
    "Taille",
    "Type MIME",
    "Drive File ID",
    "Statut Drive"
  ];

  depositsSheet.addRow(headers);
  
  // Style headers
  const headerRow = depositsSheet.getRow(1);
  headerRow.font = { name: 'Inter', bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E293B' } // Slate-800
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
  
  // Set column widths
  depositsSheet.columns = headers.map(h => ({
    header: h,
    key: h,
    width: h.length < 15 ? 16 : h.length + 4
  }));

  // Add some sample row to show how it looks (optional, but let's keep it empty or with a sample instruction row)
  // Let's keep it empty so they can start fresh, or add one demo row
  depositsSheet.addRow([
    "DEPOT-DEMO",
    new Date().toLocaleDateString('fr-FR'),
    "Exemple Déposant",
    "exemple@univ.edu",
    "Etudiant",
    "Tronc Commun (S1 à S4)",
    "S1",
    "Analyse 1",
    "TD Fonction - Corrigé",
    "TD",
    "Un exemple de document",
    "td1_analyse.pdf",
    "1.50 MB",
    "application/pdf",
    "https://drive.google.com/file/d/demo-id/view",
    "success"
  ]);

  // 2. Create "Tableau de Bord" sheet
  const dashboardSheet = workbook.addWorksheet('Tableau de Bord', {
    properties: { showGridLines: true }
  });

  // Set widths
  dashboardSheet.columns = [
    { width: 35 },
    { width: 15 },
    { width: 5 },
    { width: 40 },
    { width: 15 },
    { width: 5 }
  ];

  // Add title block
  dashboardSheet.addRow(["TABLEAU DE BORD - REMIX ARCHIV2IE"]);
  dashboardSheet.addRow(["Statistiques globales issues de l'application"]);
  dashboardSheet.addRow([]);

  // Styling title rows
  dashboardSheet.mergeCells('A1:E1');
  const titleCell = dashboardSheet.getCell('A1');
  titleCell.font = { name: 'Space Grotesk', bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' } // Slate-900
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  dashboardSheet.mergeCells('A2:E2');
  const subtitleCell = dashboardSheet.getCell('A2');
  subtitleCell.font = { name: 'Inter', italic: true, size: 10, color: { argb: 'FF94A3B8' } };
  subtitleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E293B' } // Slate-800
  };
  subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // KPI Headers
  dashboardSheet.getCell('A4').value = "Métrique clé";
  dashboardSheet.getCell('B4').value = "Valeur";
  dashboardSheet.getCell('D4').value = "Dépôts par Filière";
  dashboardSheet.getCell('E4').value = "Nombre";

  const kpiHeaders = ['A4', 'B4', 'D4', 'E4'];
  kpiHeaders.forEach(cellId => {
    const cell = dashboardSheet.getCell(cellId);
    cell.font = { name: 'Inter', bold: true, size: 11, color: { argb: 'FF1E293B' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2E8F0' } // Slate-200
    };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FF94A3B8' } }
    };
  });

  // KPI Rows
  dashboardSheet.getCell('A5').value = "Total des dépôts";
  dashboardSheet.getCell('B5').value = { formula: "COUNTA('Dépôts'!A2:A)" };

  dashboardSheet.getCell('A6').value = "Fichiers Synchronisés";
  dashboardSheet.getCell('B6').value = { formula: "COUNTIF('Dépôts'!P2:P, \"success\")" };

  dashboardSheet.getCell('A7').value = "Fichiers en attente";
  dashboardSheet.getCell('B7').value = { formula: "COUNTIF('Dépôts'!P2:P, \"pending\")" };

  // Filière Rows
  dashboardSheet.getCell('D5').value = "Tronc Commun (S1 à S4)";
  dashboardSheet.getCell('E5').value = { formula: "COUNTIF('Dépôts'!F:F, \"Tronc Commun (S1 à S4)\")" };

  dashboardSheet.getCell('D6').value = "Génie Électrique & Énergétique (GEE)";
  dashboardSheet.getCell('E6').value = { formula: "COUNTIF('Dépôts'!F:F, \"Génie Électrique & Énergétique (GEE)\")" };

  dashboardSheet.getCell('D7').value = "Génie Civil & BTP (GC-BTP)";
  dashboardSheet.getCell('E7').value = { formula: "COUNTIF('Dépôts'!F:F, \"Génie Civil & BTP (GC-BTP)\")" };

  dashboardSheet.getCell('D8').value = "Génie Eau, Assainissement & AH (GEAAH)";
  dashboardSheet.getCell('E8').value = { formula: "COUNTIF('Dépôts'!F:F, \"Génie Eau, Assainissement & AH (GEAAH)\")" };

  // Document Types Headers (Row 10)
  dashboardSheet.getCell('A10').value = "Dépôts par Type de Document";
  dashboardSheet.getCell('B10').value = "Nombre";

  const typeHeaders = ['A10', 'B10'];
  typeHeaders.forEach(cellId => {
    const cell = dashboardSheet.getCell(cellId);
    cell.font = { name: 'Inter', bold: true, size: 11, color: { argb: 'FF1E293B' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2E8F0' } // Slate-200
    };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FF94A3B8' } }
    };
  });

  // Document Types Rows
  dashboardSheet.getCell('A11').value = "Cours";
  dashboardSheet.getCell('B11').value = { formula: "COUNTIF('Dépôts'!J:J, \"Cours\")" };

  dashboardSheet.getCell('A12').value = "TD";
  dashboardSheet.getCell('B12').value = { formula: "COUNTIF('Dépôts'!J:J, \"TD\")" };

  dashboardSheet.getCell('A13').value = "TP";
  dashboardSheet.getCell('B13').value = { formula: "COUNTIF('Dépôts'!J:J, \"TP\")" };

  dashboardSheet.getCell('A14').value = "Examen";
  dashboardSheet.getCell('B14').value = { formula: "COUNTIF('Dépôts'!J:J, \"Examen\")" };

  dashboardSheet.getCell('A15').value = "Autre";
  dashboardSheet.getCell('B15').value = { formula: "COUNTIF('Dépôts'!J:J, \"Autre\")" };

  // Alignments and subtle borders
  const borderStyle = {
    top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
    right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
  };

  for (let r = 5; r <= 15; r++) {
    const row = dashboardSheet.getRow(r);
    row.font = { name: 'Inter', size: 10 };
    
    // Borders for A & B
    if (r !== 8 && r !== 9) {
      dashboardSheet.getCell(`A${r}`).border = borderStyle;
      dashboardSheet.getCell(`B${r}`).border = borderStyle;
      dashboardSheet.getCell(`B${r}`).alignment = { horizontal: 'right' };
    }

    // Borders for D & E (only rows 5 to 8)
    if (r >= 5 && r <= 8) {
      dashboardSheet.getCell(`D${r}`).border = borderStyle;
      dashboardSheet.getCell(`E${r}`).border = borderStyle;
      dashboardSheet.getCell(`E${r}`).alignment = { horizontal: 'right' };
    }
  }

  // Ensure output directory exists
  const outDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const filePath = path.join(outDir, 'Remix_Archiv2ie_Template.xlsx');
  await workbook.xlsx.writeFile(filePath);
  console.log(`[Success] Template Excel generated at: ${filePath}`);
}

generate().catch(err => {
  console.error('Error generating Excel template:', err);
  process.exit(1);
});
