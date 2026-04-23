/**
 * ページ遷移制御
 */
function doGet(e) {
  const page = e.parameter.page || 'index';
  return HtmlService.createTemplateFromFile(page).evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('日本語トレーニング');
}

/**
 * 公開されたCSV URLからデータを取得
 */
function getCompositionData() {
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTDRPlyoBQrG9wzUadhnR8OY9sxuPhkRRpO_WO0BNs-H_f349__5bK5vN6ZYb3U_w/pub?gid=1136664882&single=true&output=csv";
  
  try {
    const response = UrlFetchApp.fetch(csvUrl);
    const csvData = Utilities.parseCsv(response.getContentText());
    
    const headers = csvData[0]; // 1行目：要素の種類
    const rows = csvData.slice(1); // 2行目以降：単語

    // 列ごとに整形して返す
    return headers.map((header, colIndex) => {
      return {
        label: header,
        options: rows.map(row => row[colIndex]).filter(cell => cell && cell.trim() !== "")
      };
    });
  } catch (e) {
    console.error("データ取得エラー: " + e.toString());
    return [];
  }
}

function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}
