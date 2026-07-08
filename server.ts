import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

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
  folderId: string | null;
  accessToken: string | null;
  passcode: string | null;
  deposits: Deposit[];
}

const CONFIG_FILE = path.join(process.cwd(), "sheets_config.json");

// Read firebase-applet-config.json for server-side persistence
const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
let firestoreDb: any = null;

if (fs.existsSync(firebaseConfigPath)) {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
    const app = initializeApp(firebaseConfig);
    const dbId = process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId;
    firestoreDb = dbId ? getFirestore(app, dbId) : getFirestore(app);
    console.log("[Firebase Server] Firestore initialized successfully.");
  } catch (e) {
    console.error("[Firebase Server] Error initializing Firebase on backend:", e);
  }
}

// Global cached config
let cachedConfig: SheetsConfig = {
  spreadsheetId: null,
  folderId: null,
  accessToken: null,
  passcode: null,
  deposits: [],
};

function loadConfig(): SheetsConfig {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const content = fs.readFileSync(CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return {
        spreadsheetId: parsed.spreadsheetId || null,
        folderId: parsed.folderId || null,
        accessToken: parsed.accessToken || null,
        passcode: parsed.passcode || null,
        deposits: parsed.deposits || [],
      };
    } catch (e) {
      console.error("Error reading config:", e);
    }
  }
  return { spreadsheetId: null, folderId: null, accessToken: null, passcode: null, deposits: [] };
}

function saveConfig(config: SheetsConfig) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving config:", e);
  }
}

// Async state persistence helpers to sync with Firestore
async function persistConfig(config: SheetsConfig) {
  saveConfig(config);
  cachedConfig = config;
  
  if (!firestoreDb) return;
  try {
    const stateDocRef = doc(firestoreDb, "admin_config", "sheets_state");
    await setDoc(stateDocRef, {
      spreadsheetId: config.spreadsheetId,
      folderId: config.folderId || null,
      accessToken: config.accessToken,
      passcode: config.passcode,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log("[Firebase Server] state document synced with Firestore.");
  } catch (err) {
    console.error("[Firebase Server] Error syncing state document to Firestore:", err);
  }
}

async function persistDepositToFirestore(dep: Deposit) {
  if (!firestoreDb) return;
  try {
    const depDocRef = doc(firestoreDb, "deposits", dep.id);
    const { base64, ...depWithoutBase64 } = dep;
    await setDoc(depDocRef, depWithoutBase64, { merge: true });
    console.log(`[Firebase Server] Deposit ${dep.id} synced with Firestore.`);
  } catch (err) {
    console.error(`[Firebase Server] Error syncing deposit ${dep.id} to Firestore:`, err);
  }
}

async function deleteDepositFromFirestore(id: string) {
  if (!firestoreDb) return;
  try {
    const depDocRef = doc(firestoreDb, "deposits", id);
    await deleteDoc(depDocRef);
    console.log(`[Firebase Server] Deposit ${id} deleted from Firestore.`);
  } catch (err) {
    console.error(`[Firebase Server] Error deleting deposit ${id} from Firestore:`, err);
  }
}

async function initConfigFromFirestore() {
  const localConfig = loadConfig();
  cachedConfig = localConfig;
  
  if (!firestoreDb) return;
  try {
    console.log("[Firebase Server] Initializing config from Firestore...");
    const stateDocRef = doc(firestoreDb, "admin_config", "sheets_state");
    const docSnap = await getDoc(stateDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      cachedConfig.spreadsheetId = data.spreadsheetId || localConfig.spreadsheetId;
      cachedConfig.folderId = data.folderId || localConfig.folderId;
      cachedConfig.accessToken = data.accessToken || localConfig.accessToken;
      cachedConfig.passcode = data.passcode || localConfig.passcode;
    }
    
    // Load deposits
    const depositsCollRef = collection(firestoreDb, "deposits");
    const querySnapshot = await getDocs(depositsCollRef);
    const firestoreDeposits: Deposit[] = [];
    querySnapshot.forEach((docSnap) => {
      const dep = docSnap.data() as Deposit;
      const { base64, ...depWithoutBase64 } = dep;
      firestoreDeposits.push(depWithoutBase64 as Deposit);
    });
    
    if (firestoreDeposits.length > 0) {
      const mergedMap = new Map<string, Deposit>();
      localConfig.deposits.forEach(d => mergedMap.set(d.id, d));
      firestoreDeposits.forEach(d => mergedMap.set(d.id, d));
      
      cachedConfig.deposits = Array.from(mergedMap.values()).sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    }
    
    saveConfig(cachedConfig);
    console.log(`[Firebase Server] Initialization complete. Loaded ${cachedConfig.deposits.length} deposits.`);
  } catch (err) {
    console.error("[Firebase Server] Error initializing config from Firestore:", err);
  }
}

// Google Drive Folder management and File upload REST API functions
async function getOrCreateDriveFolder(folderName: string, accessToken: string): Promise<string | null> {
  try {
    console.log(`[Drive Folder] Finding folder "${folderName}"...`);
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(folderName)}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id)`;
    const searchResponse = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (searchResponse.ok) {
      const searchData = (await searchResponse.json()) as any;
      const files = searchData.files || [];
      if (files.length > 0) {
        console.log(`[Drive Folder] Existing folder found: ${files[0].id}`);
        return files[0].id;
      }
    }
    
    console.log(`[Drive Folder] Creating a new folder "${folderName}"...`);
    const createResponse = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      }),
    });
    
    if (!createResponse.ok) {
      const errText = await createResponse.text();
      console.error(`[Drive Folder] Folder creation failed: ${errText}`);
      return null;
    }
    
    const createData = (await createResponse.json()) as any;
    console.log(`[Drive Folder] Folder created successfully: ${createData.id}`);
    return createData.id;
  } catch (err) {
    console.error("[Drive Folder] Error resolving Google Drive folder:", err);
    return null;
  }
}

async function uploadFileToDrive(
  fileName: string,
  mimeType: string,
  base64Data: string,
  folderId: string,
  accessToken: string
): Promise<string | null> {
  try {
    console.log(`[Drive File Upload] Uploading "${fileName}" to Google Drive folder ${folderId}...`);
    let cleanBase64 = base64Data;
    if (base64Data.includes(";base64,")) {
      cleanBase64 = base64Data.split(";base64,")[1];
    }
    
    const metadata = {
      name: fileName,
      parents: [folderId],
    };
    
    const boundary = "archiv2ie_upload_boundary_foo_bar";
    const parts = [
      `--${boundary}\r\n`,
      `Content-Type: application/json; charset=UTF-8\r\n\r\n`,
      JSON.stringify(metadata) + `\r\n`,
      `--${boundary}\r\n`,
      `Content-Type: ${mimeType || "application/octet-stream"}\r\n`,
      `Content-Transfer-Encoding: base64\r\n\r\n`,
      cleanBase64 + `\r\n`,
      `--${boundary}--`
    ];
    
    const body = parts.join("");
    
    const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: body,
    });
    
    if (!response.ok) {
      const errMsg = await response.text();
      console.error(`[Drive File Upload] File upload failed with status ${response.status}:`, errMsg);
      return null;
    }
    
    const data = (await response.json()) as any;
    console.log(`[Drive File Upload] Upload succeeded. New file ID: ${data.id}`);
    return data.id;
  } catch (err) {
    console.error("[Drive File Upload] Error uploading file directly to Drive:", err);
    return null;
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
    // Update individual deposit in Firestore
    await persistDepositToFirestore(dep);
  }
  if (updated) {
    await persistConfig(config);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Initialize config and sync from Firestore on startup (non-blocking)
  initConfigFromFirestore().catch((err) => {
    console.error("[Firebase Server] Non-blocking initConfigFromFirestore failed:", err);
  });

  // 1. Configuration Admin Endpoints
  app.get("/api/admin/config", (req, res) => {
    res.json({
      hasPasscode: !!cachedConfig.passcode,
      passcode: cachedConfig.passcode,
      spreadsheetId: cachedConfig.spreadsheetId,
      folderId: cachedConfig.folderId,
      hasToken: !!cachedConfig.accessToken,
    });
  });

  app.post("/api/admin/config/passcode", async (req, res) => {
    const { passcode, deletePasscode } = req.body;
    if (deletePasscode) {
      cachedConfig.passcode = null;
    } else if (passcode) {
      cachedConfig.passcode = String(passcode).trim();
    }
    await persistConfig(cachedConfig);
    res.json({ success: true, hasPasscode: !!cachedConfig.passcode });
  });

  app.post("/api/admin/config/verify-passcode", (req, res) => {
    const { passcode } = req.body;
    if (!cachedConfig.passcode) {
      return res.json({ success: true, message: "No passcode configured." });
    }
    if (cachedConfig.passcode === String(passcode).trim()) {
      return res.json({ success: true });
    }
    res.status(401).json({ success: false, error: "Code d'accès incorrect." });
  });

  app.post("/api/admin/config/token", async (req, res) => {
    const { accessToken, spreadsheetId } = req.body;
    if (accessToken) {
      cachedConfig.accessToken = accessToken;
    }
    if (spreadsheetId !== undefined) {
      if (spreadsheetId === "REMOVE_SPREADSHEET_ID" || spreadsheetId === null) {
        cachedConfig.spreadsheetId = null;
      } else {
        cachedConfig.spreadsheetId = spreadsheetId;
      }
    }
    await persistConfig(cachedConfig);

    // Run background sync for any pending deposits since we have a fresh token!
    if (cachedConfig.spreadsheetId && cachedConfig.accessToken) {
      syncAllPendingDeposits(cachedConfig).catch((err) => {
        console.error("Background sync failed:", err);
      });
    }

    res.json({ success: true, spreadsheetId: cachedConfig.spreadsheetId });
  });

  // 2. Google Sheet Creation Endpoint
  app.post("/api/sheets/create", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header required" });
    }
    const token = authHeader.replace("Bearer ", "");

    try {
      // Step 0: Find or Create "Remix Archiv2ie - Dépôts" folder dynamically in Drive
      console.log("[Sheets Create] Step 0: Resolving Google Drive target folder...");
      const folderId = await getOrCreateDriveFolder("Remix Archiv2ie - Dépôts", token);
      if (!folderId) {
        return res.status(500).json({ error: "Impossible de créer ou de localiser le dossier dans Google Drive." });
      }

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

      console.log(`[Sheets Create] Sheet created: ${spreadsheetId}. Step 2: Moving Sheet to Folder...`);

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
            ["Fichiers Synchronisés", '=COUNTIF(\'Dépôts\'!P2:P, "success")', "", "Génie Électrique & Énergétique (GEE)", '=COUNTIF(\'Dépôts\'!F:F, "Génie Électrique & Énergétique (GEE)")', ""],
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

      // Save to local config and sync with Firestore
      cachedConfig.spreadsheetId = spreadsheetId;
      cachedConfig.folderId = folderId;
      cachedConfig.accessToken = token;
      await persistConfig(cachedConfig);

      // Try syncing any pending deposits right away
      syncAllPendingDeposits(cachedConfig).catch((err) => {
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
    res.json(cachedConfig.deposits);
  });

  app.post("/api/deposits", async (req, res) => {
    const newDep = req.body as Deposit;
    if (!newDep.id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Direct Google Drive Upload using backend admin credentials
    if (newDep.base64 && cachedConfig.folderId && cachedConfig.accessToken) {
      try {
        console.log(`[Direct Upload] Uploading ${newDep.fileName} directly to admin's Drive...`);
        const fileId = await uploadFileToDrive(
          newDep.nomDoc || newDep.fileName,
          newDep.fileType,
          newDep.base64,
          cachedConfig.folderId,
          cachedConfig.accessToken
        );
        if (fileId) {
          newDep.driveFileId = `https://drive.google.com/file/d/${fileId}/view?usp=drivesdk`;
          newDep.driveStatus = "success";
        } else {
          newDep.driveStatus = "failed";
        }
      } catch (err) {
        console.error("[Direct Upload] Exception during direct Google Drive upload:", err);
        newDep.driveStatus = "failed";
      }
    }

    // Strip out base64 before saving to save space and comply with size limits
    delete newDep.base64;

    // Add or replace
    const index = cachedConfig.deposits.findIndex((d) => d.id === newDep.id);
    if (index !== -1) {
      cachedConfig.deposits[index] = newDep;
    } else {
      cachedConfig.deposits.unshift(newDep);
    }
    
    await persistConfig(cachedConfig);
    await persistDepositToFirestore(newDep);

    // Sync to Google Sheet in the background
    if (cachedConfig.spreadsheetId && cachedConfig.accessToken) {
      syncDepositToSheet(newDep, cachedConfig.spreadsheetId, cachedConfig.accessToken)
        .then(async (ok) => {
          const depToUpdate = cachedConfig.deposits.find((d) => d.id === newDep.id);
          if (depToUpdate) {
            depToUpdate.sheetStatus = ok ? "success" : "failed";
            await persistConfig(cachedConfig);
            await persistDepositToFirestore(depToUpdate);
          }
        })
        .catch((e) => {
          console.error("Background deposit sync failed:", e);
        });
    }

    res.json({ success: true, deposit: newDep });
  });

  app.patch("/api/deposits/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const dep = cachedConfig.deposits.find((d) => d.id === id);
    if (!dep) {
      return res.status(404).json({ error: "Deposit not found" });
    }

    // Apply updates
    Object.assign(dep, updates);
    await persistConfig(cachedConfig);
    await persistDepositToFirestore(dep);

    // Sync updates to Google Sheet in the background
    if (cachedConfig.spreadsheetId && cachedConfig.accessToken) {
      updateDepositInSheet(dep, cachedConfig.spreadsheetId, cachedConfig.accessToken)
        .then(async (ok) => {
          const syncedDep = cachedConfig.deposits.find((d) => d.id === id);
          if (syncedDep) {
            syncedDep.sheetStatus = ok ? "success" : "failed";
            await persistConfig(cachedConfig);
            await persistDepositToFirestore(syncedDep);
          }
        })
        .catch((e) => console.error("Background patch update failed:", e));
    }

    res.json({ success: true, deposit: dep });
  });

  app.delete("/api/deposits/:id", async (req, res) => {
    const { id } = req.params;

    const index = cachedConfig.deposits.findIndex((d) => d.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Deposit not found" });
    }

    cachedConfig.deposits.splice(index, 1);
    await persistConfig(cachedConfig);
    await deleteDepositFromFirestore(id);

    // Async delete from Google Sheets
    if (cachedConfig.spreadsheetId && cachedConfig.accessToken) {
      deleteDepositFromSheet(id, cachedConfig.spreadsheetId, cachedConfig.accessToken)
        .catch((e) => console.error("Background sheet delete failed:", e));
    }

    res.json({ success: true });
  });

  app.post("/api/deposits/sync-all", async (req, res) => {
    if (!cachedConfig.spreadsheetId || !cachedConfig.accessToken) {
      return res.status(400).json({ error: "Spreadsheet ID or access token not configured" });
    }
    await syncAllPendingDeposits(cachedConfig);
    res.json({ success: true, deposits: cachedConfig.deposits });
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
