import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface Deposit {
  id: string;
  date: string;
  nom: string;
  email: string;
  statut: string;
  filiere: string;
  semestre: string;
  nomDoc: string;
  matiere: string;
  typeDoc: string;
  commentaire: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  status: string;
  driveFileId: string;
  driveStatus: string;
  base64?: string;
  isLargeFile?: boolean;
  createdAt: string;
  sheetStatus?: string;
}

interface SheetsConfig {
  spreadsheetId: string | null;
  accessToken: string | null;
  passcode: string | null;
  deposits: Deposit[];
}

const CONFIG_FILE = path.join(process.cwd(), "sheets_config.json");

function loadConfig(): SheetsConfig {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const content = fs.readFileSync(CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return {
        spreadsheetId: parsed.spreadsheetId || null,
        accessToken: parsed.accessToken || null,
        passcode: parsed.passcode || null,
        deposits: parsed.deposits || [],
      };
    } catch (e) {
      console.error("Error reading config:", e);
    }
  }
  return { spreadsheetId: null, accessToken: null, passcode: null, deposits: [] };
}

function saveConfig(config: SheetsConfig) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving config:", e);
  }
}

// Google Sheet synchronization helper functions
async function syncDepositToSheet(dep: Deposit, spreadsheetId: string, accessToken: string): Promise<boolean> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Dépôts'!A:P:append?valueInputOption=USER_ENTERED`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [
            dep.id,
            dep.date,
            dep.nom,
            dep.email,
            dep.statut,
            dep.filiere,
            dep.semestre,
            dep.matiere,
            dep.nomDoc,
            dep.typeDoc,
            dep.commentaire,
            dep.fileName,
            dep.fileSize,
            dep.fileType,
            dep.driveFileId,
            dep.driveStatus,
          ],
        ],
      }),
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error(`Google Sheets sync error: ${response.status} - ${errText}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`Exception during deposit ${dep.id} sheet sync:`, e);
    return false;
  }
}

async function updateDepositInSheet(dep: Deposit, spreadsheetId: string, accessToken: string): Promise<boolean> {
  try {
    // 1. Fetch column A to find row index
    const fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Dépôts'!A:A`;
    const fetchResponse = await fetch(fetchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!fetchResponse.ok) return false;
    const data = await fetchResponse.json();
    const rows = data.values || [];

    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === dep.id) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) {
      // Row not found, just append
      return await syncDepositToSheet(dep, spreadsheetId, accessToken);
    }

    // 2. Update the row values
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Dépôts'!A${rowIndex}:P${rowIndex}?valueInputOption=USER_ENTERED`;
    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [
            dep.id,
            dep.date,
            dep.nom,
            dep.email,
            dep.statut,
            dep.filiere,
            dep.semestre,
            dep.matiere,
            dep.nomDoc,
            dep.typeDoc,
            dep.commentaire,
            dep.fileName,
            dep.fileSize,
            dep.fileType,
            dep.driveFileId,
            dep.driveStatus,
          ],
        ],
      }),
    });
    return updateResponse.ok;
  } catch (e) {
    console.error(`Exception during deposit ${dep.id} sheet update:`, e);
    return false;
  }
}

async function getSheetIdOfTab(spreadsheetId: string, accessToken: string, tabName: string): Promise<number | null> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const sheets = data.sheets || [];
    for (const sheet of sheets) {
      if (sheet.properties.title === tabName) {
        return sheet.properties.sheetId;
      }
    }
  } catch (e) {
    console.error("Error getting sheet ID:", e);
  }
  return null;
}

async function deleteDepositFromSheet(depositId: string, spreadsheetId: string, accessToken: string): Promise<boolean> {
  try {
    // 1. Fetch column A to find row index
    const fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Dépôts'!A:A`;
    const fetchResponse = await fetch(fetchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!fetchResponse.ok) return false;
    const data = await fetchResponse.json();
    const rows = data.values || [];

    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === depositId) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) return true; // Already deleted

    const sheetId = await getSheetIdOfTab(spreadsheetId, accessToken, "Dépôts");
    if (sheetId === null) return false;

    // 2. Perform batchUpdate deleteDimension request
    const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    const batchResponse = await fetch(batchUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: "ROWS",
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      }),
    });
    return batchResponse.ok;
  } catch (e) {
    console.error(`Exception during deposit ${depositId} sheet deletion:`, e);
    return false;
  }
}

async function syncAllPendingDeposits(config: SheetsConfig) {
  if (!config.spreadsheetId || !config.accessToken) return;
  const pending = config.deposits.filter((d) => d.sheetStatus !== "success");
  if (pending.length === 0) return;

  console.log(`[Sync] Starting background sync of ${pending.length} pending deposits...`);
  let updated = false;
  for (const dep of pending) {
    const ok = await syncDepositToSheet(dep, config.spreadsheetId, config.accessToken);
    if (ok) {
      dep.sheetStatus = "success";
      updated = true;
    } else {
      dep.sheetStatus = "failed";
      updated = true;
    }
  }
  if (updated) {
    saveConfig(config);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Ensure config exists
  const config = loadConfig();
  saveConfig(config);

  // 1. Configuration Admin Endpoints
  app.get("/api/admin/config", (req, res) => {
    const currentConfig = loadConfig();
    res.json({
      hasPasscode: !!currentConfig.passcode,
      passcode: currentConfig.passcode,
      spreadsheetId: currentConfig.spreadsheetId,
      hasToken: !!currentConfig.accessToken,
    });
  });

  app.post("/api/admin/config/passcode", (req, res) => {
    const { passcode, deletePasscode } = req.body;
    const currentConfig = loadConfig();
    if (deletePasscode) {
      currentConfig.passcode = null;
    } else if (passcode) {
      currentConfig.passcode = String(passcode).trim();
    }
    saveConfig(currentConfig);
    res.json({ success: true, hasPasscode: !!currentConfig.passcode });
  });

  app.post("/api/admin/config/verify-passcode", (req, res) => {
    const { passcode } = req.body;
    const currentConfig = loadConfig();
    if (!currentConfig.passcode) {
      return res.json({ success: true, message: "No passcode configured." });
    }
    if (currentConfig.passcode === String(passcode).trim()) {
      return res.json({ success: true });
    }
    res.status(401).json({ success: false, error: "Code d'accès incorrect." });
  });

  app.post("/api/admin/config/token", (req, res) => {
    const { accessToken, spreadsheetId } = req.body;
    const currentConfig = loadConfig();
    if (accessToken) {
      currentConfig.accessToken = accessToken;
    }
    if (spreadsheetId !== undefined) {
      if (spreadsheetId === "REMOVE_SPREADSHEET_ID" || spreadsheetId === null) {
        currentConfig.spreadsheetId = null;
      } else {
        currentConfig.spreadsheetId = spreadsheetId;
      }
    }
    saveConfig(currentConfig);

    // Run background sync for any pending deposits since we have a fresh token!
    if (currentConfig.spreadsheetId && currentConfig.accessToken) {
      syncAllPendingDeposits(currentConfig).catch((err) => {
        console.error("Background sync failed:", err);
      });
    }

    res.json({ success: true, spreadsheetId: currentConfig.spreadsheetId });
  });

  // 2. Google Sheet Creation Endpoint
  app.post("/api/sheets/create", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header required" });
    }
    const token = authHeader.replace("Bearer ", "");

    try {
      console.log("[Sheets Create] Step 1: Creating Google Sheet...");
      const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            title: "Remix Archiv2ie - Métadonnées",
          },
          sheets: [
            {
              properties: {
                title: "Dépôts",
                gridProperties: {
                  frozenRowCount: 1,
                },
              },
            },
            {
              properties: {
                title: "Tableau de Bord",
                gridProperties: {
                  showGridLines: true,
                },
              },
            },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: `Failed to create sheet: ${errText}` });
      }

      const sheetData = await response.json();
      const spreadsheetId = sheetData.spreadsheetId;
      const spreadsheetUrl = sheetData.spreadsheetUrl;
      const sheets = sheetData.sheets || [];
      const depositsSheetId = sheets[0]?.properties?.sheetId || 0;
      const dashboardSheetId = sheets[1]?.properties?.sheetId || 0;

      console.log(`[Sheets Create] Sheet created: ${spreadsheetId}. Step 2: Moving to Folder...`);
      const folderId = "1VOjv5qxNbFLUvRc0BShinaoOM3OF5jBxDIRJt7MEhDqrBtiLX7wtvbLGFj1WpCu8U1ESC3ob";

      // Fetch current parents
      const metaResp = await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}?fields=parents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meta = await metaResp.json();
      const currentParents = meta.parents ? meta.parents.join(",") : "root";

      // Move to target folder
      const moveResp = await fetch(
        `https://www.googleapis.com/drive/v3/files/${spreadsheetId}?addParents=${folderId}&removeParents=${currentParents}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!moveResp.ok) {
        console.warn("[Sheets Create] Moving to folder failed, but sheet was created. Proceeding...");
      }

      console.log("[Sheets Create] Step 3: Initializing columns for Dépôts sheet...");
      const headersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Dépôts'!A1:P1?valueInputOption=USER_ENTERED`;
      await fetch(headersUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [
            [
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
              "Statut Drive",
            ],
          ],
        }),
      });

      console.log("[Sheets Create] Step 4: Building Dashboard tab...");
      const dashUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Tableau de Bord'!A1:F17?valueInputOption=USER_ENTERED`;
      await fetch(dashUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [
            ["TABLEAU DE BORD - REMIX ARCHIV2IE", "", "", "", "", ""],
            ["Statistiques globales issues de l'application", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["Métrique clé", "Valeur", "", "Dépôts par Filière", "Nombre", ""],
            ["Total des dépôts", "=COUNTA('Dépôts'!A2:A)", "", "Tronc Commun (S1 à S4)", '=COUNTIF(\'Dépôts\'!F:F, "Tronc Commun (S1 à S4)")', ""],
            ["Fichiers Synchronisés", '=COUNTIF(\'Dépôts\'!P2:P, "success")', "", "Génie Électrique & Énergétique (GEE)", '=COUNTIF(\'Dépôts\'!F:F, "Génie Électrique & Énergétique (GEE) (GEE)")', ""],
            ["Fichiers en attente", '=COUNTIF(\'Dépôts\'!P2:P, "pending")', "", "Génie Civil & BTP (GC-BTP)", '=COUNTIF(\'Dépôts\'!F:F, "Génie Civil & BTP (GC-BTP)")', ""],
            ["", "", "", "Génie Eau, Assainissement & AH (GEAAH)", '=COUNTIF(\'Dépôts\'!F:F, "Génie Eau, Assainissement & AH (GEAAH)")', ""],
            ["", "", "", "", "", ""],
            ["Dépôts par Type de Document", "Nombre", "", "", "", ""],
            ["Cours", '=COUNTIF(\'Dépôts\'!J:J, "Cours")', "", "", "", ""],
            ["TD", '=COUNTIF(\'Dépôts\'!J:J, "TD")', "", "", "", ""],
            ["TP", '=COUNTIF(\'Dépôts\'!J:J, "TP")', "", "", "", ""],
            ["Examen", '=COUNTIF(\'Dépôts\'!J:J, "Examen")', "", "", "", ""],
            ["Autre", '=COUNTIF(\'Dépôts\'!J:J, "Autre")', "", "", "", ""],
          ],
        }),
      });

      console.log("[Sheets Create] Step 5: Formatting cells...");
      const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
      await fetch(batchUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            // Style dashboard title
            {
              repeatCell: {
                range: {
                  sheetId: dashboardSheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 6,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.15, green: 0.23, blue: 0.35 },
                    textFormat: { foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 }, bold: true, fontSize: 14 },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat)",
              },
            },
            // Format KPI table headers
            {
              repeatCell: {
                range: {
                  sheetId: dashboardSheetId,
                  startRowIndex: 3,
                  endRowIndex: 4,
                  startColumnIndex: 0,
                  endColumnIndex: 5,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.92, green: 0.94, blue: 0.97 },
                    textFormat: { bold: true },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat)",
              },
            },
            // Format DocType headers
            {
              repeatCell: {
                range: {
                  sheetId: dashboardSheetId,
                  startRowIndex: 9,
                  endRowIndex: 10,
                  startColumnIndex: 0,
                  endColumnIndex: 2,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.92, green: 0.94, blue: 0.97 },
                    textFormat: { bold: true },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat)",
              },
            },
          ],
        }),
      });

      // Save to local config
      const currentConfig = loadConfig();
      currentConfig.spreadsheetId = spreadsheetId;
      currentConfig.accessToken = token;
      saveConfig(currentConfig);

      // Try syncing any pending deposits right away
      syncAllPendingDeposits(currentConfig).catch((err) => {
        console.error("Auto sync after sheet creation failed:", err);
      });

      return res.json({ success: true, spreadsheetId, url: spreadsheetUrl });
    } catch (err: any) {
      console.error("Exception during sheet creation:", err);
      return res.status(500).json({ error: err.message || String(err) });
    }
  });

  // 3. Deposit Endpoints
  app.get("/api/deposits", (req, res) => {
    const currentConfig = loadConfig();
    res.json(currentConfig.deposits);
  });

  app.post("/api/deposits", (req, res) => {
    const newDep = req.body as Deposit;
    if (!newDep.id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const currentConfig = loadConfig();
    
    // Add or replace
    const index = currentConfig.deposits.findIndex((d) => d.id === newDep.id);
    if (index !== -1) {
      currentConfig.deposits[index] = newDep;
    } else {
      currentConfig.deposits.unshift(newDep);
    }
    
    saveConfig(currentConfig);

    // Fast-response to client immediately! Then run Google Sheet sync in the background
    if (currentConfig.spreadsheetId && currentConfig.accessToken) {
      syncDepositToSheet(newDep, currentConfig.spreadsheetId, currentConfig.accessToken)
        .then((ok) => {
          const reloadedConfig = loadConfig();
          const depToUpdate = reloadedConfig.deposits.find((d) => d.id === newDep.id);
          if (depToUpdate) {
            depToUpdate.sheetStatus = ok ? "success" : "failed";
            saveConfig(reloadedConfig);
          }
        })
        .catch((e) => {
          console.error("Background deposit sync failed:", e);
        });
    }

    res.json({ success: true, deposit: newDep });
  });

  app.patch("/api/deposits/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const currentConfig = loadConfig();

    const dep = currentConfig.deposits.find((d) => d.id === id);
    if (!dep) {
      return res.status(404).json({ error: "Deposit not found" });
    }

    // Apply updates
    Object.assign(dep, updates);
    saveConfig(currentConfig);

    // Sync updates to Google Sheet in the background
    if (currentConfig.spreadsheetId && currentConfig.accessToken) {
      updateDepositInSheet(dep, currentConfig.spreadsheetId, currentConfig.accessToken)
        .then((ok) => {
          const reloadedConfig = loadConfig();
          const syncedDep = reloadedConfig.deposits.find((d) => d.id === id);
          if (syncedDep) {
            syncedDep.sheetStatus = ok ? "success" : "failed";
            saveConfig(reloadedConfig);
          }
        })
        .catch((e) => console.error("Background patch update failed:", e));
    }

    res.json({ success: true, deposit: dep });
  });

  app.delete("/api/deposits/:id", (req, res) => {
    const { id } = req.params;
    const currentConfig = loadConfig();

    const index = currentConfig.deposits.findIndex((d) => d.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Deposit not found" });
    }

    currentConfig.deposits.splice(index, 1);
    saveConfig(currentConfig);

    // Async delete from Google Sheets
    if (currentConfig.spreadsheetId && currentConfig.accessToken) {
      deleteDepositFromSheet(id, currentConfig.spreadsheetId, currentConfig.accessToken)
        .catch((e) => console.error("Background sheet delete failed:", e));
    }

    res.json({ success: true });
  });

  app.post("/api/deposits/sync-all", async (req, res) => {
    const currentConfig = loadConfig();
    if (!currentConfig.spreadsheetId || !currentConfig.accessToken) {
      return res.status(400).json({ error: "Spreadsheet ID or access token not configured" });
    }
    await syncAllPendingDeposits(currentConfig);
    res.json({ success: true, deposits: currentConfig.deposits });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
