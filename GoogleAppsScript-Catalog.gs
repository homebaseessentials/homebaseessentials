/** HOMEBASE ESSENTIALS: READ-ONLY PUBLIC CATALOG
 * Paste in Extensions > Apps Script in the Google Sheets management workbook.
 * Deploy as Web App: Execute as Me; access Anyone.
 * IMPORTANT: this script exposes ONLY explicitly selected public product fields.
 * NEVER expose customer, order, quote, delivery, or private business tabs.
 * No doPost endpoint is provided. Do not accept orders or payments through this script.
 */
function doGet() {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  function rows(tab){
    const s=ss.getSheetByName(tab); if(!s)throw new Error('Missing tab '+tab);
    const a=s.getDataRange().getDisplayValues();return a.slice(1).filter(r=>r[0]);
  }
  const truth=v=>['yes','true','1','active'].includes(String(v).trim().toLowerCase());
  const productRows=rows('Products');
  const variantRows=rows('Variants & Pricing');
  const inventory=Object.fromEntries(rows('Inventory').map(r=>[r[0],r]));
  const products=productRows.filter(r=>truth(r[8])).map(r=>({
    sku:r[0],name:r[1],category:r[2],description:r[3],descriptionEs:r[4],
    images:[r[5],r[6],r[7]].filter(x=>/^https:\/\//.test(x)),related:String(r[9]||'').split(',').map(x=>x.trim()).filter(Boolean),active:true
  }));
  const variants=variantRows.filter(r=>truth(r[10])).map(r=>{
    const inv=inventory[r[0]];
    // Inventory column F: Available Packs (may be a formula); empty = availability unconfirmed
    const raw=inv?inv[5]:'';
    return {sku:r[0],productSku:r[1],label:r[2],units:Number(r[3])||1,unitType:r[4],price:Number(String(r[5]).replace(/[$,]/g,''))||0,
      stock:raw===''?null:Math.max(0,Number(String(raw).replace(/,/g,''))||0),
      tier1Qty:Number(r[6])||null,tier1Price:Number(r[7])||null,tier2Qty:Number(r[8])||null,tier2Price:Number(r[9])||null,active:true};
  });
  return ContentService.createTextOutput(JSON.stringify({products:products,variants:variants,updatedAt:new Date().toISOString()})).setMimeType(ContentService.MimeType.JSON);
}
