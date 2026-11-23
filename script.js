// HomeBase Essentials | Storefront interactions
const items=[['Paper Towels — 6 Roll Pack','Paper Products',9.99,'🧻','Everyday household absorbent towels'],['Toilet Tissue — 12 Roll Pack','Paper Products',11.99,'🧻','Bathroom tissue multipack'],['Everyday Napkins — 250 Count','Paper Products',4.49,'📄','Convenient everyday table napkins'],['Facial Tissue — 3 Boxes','Paper Products',5.99,'📦','Soft household tissues'],['Laundry Detergent — 64 oz','Laundry & Cleaning',8.99,'🧺','Liquid laundry detergent'],['Dishwashing Liquid — 28 oz','Laundry & Cleaning',3.99,'🫧','Everyday dish cleaning'],['Multi-Surface Cleaner','Laundry & Cleaning',4.99,'🧽','Household surface cleaner'],['Fabric Softener — 50 oz','Laundry & Cleaning',6.99,'🧴','Laundry care essential'],['Liquid Hand Soap — 2 Pack','Soap & Hygiene',5.49,'🧴','Hand soap for kitchen and bath'],['Bar Soap — 6 Pack','Soap & Hygiene',5.99,'🧼','Daily cleansing soap'],['Hand Sanitizer — 16 oz','Soap & Hygiene',3.99,'🧴','Hand hygiene essential'],['Trash Bags — 30 Count','Household Essentials',7.99,'🗑️','Kitchen-size household liners'],['Aluminum Foil — 75 sq ft','Household Essentials',4.49,'📦','Cooking and food storage'],['Cleaning Sponges — 6 Pack','Household Essentials',3.99,'🧽','Multi-purpose cleaning sponges'],['Disposable Gloves — 50 Count','Household Essentials',6.49,'🧤','General household use'],['Tape Measure — 25 ft','Tools & Hardware',7.99,'📏','Everyday measuring tool'],['Screwdriver Set — 6 Piece','Tools & Hardware',10.99,'🪛','Basic home maintenance set'],['Duct Tape — 2 Pack','Tools & Hardware',6.99,'🧰','Utility and repair tape']].map((x,i)=>({id:i,name:x[0],category:x[1],price:x[2],emoji:x[3],desc:x[4]}));
let cart={},language='en';
try{cart=JSON.parse(localStorage.getItem('homebase_cart')||'{}');
language=localStorage.getItem('homebase_lang')==='es'?'es':'en'}catch(e){}
const esCats={'Paper Products':'Productos de papel','Laundry & Cleaning':'Lavandería y limpieza','Soap & Hygiene':'Jabón e higiene','Household Essentials':'Artículos para el hogar','Tools & Hardware':'Herramientas y ferretería'};

const esNames=['Toallas de papel — paquete de 6 rollos','Papel higiénico — paquete de 12 rollos','Servilletas — 250 unidades','Pañuelos faciales — 3 cajas','Detergente para ropa — 64 oz','Jabón para platos — 28 oz','Limpiador multiusos','Suavizante de ropa — 50 oz','Jabón líquido para manos — paquete de 2','Jabón en barra — paquete de 6','Desinfectante de manos — 16 oz','Bolsas de basura — 30 unidades','Papel aluminio — 75 pies cuadrados','Esponjas de limpieza — paquete de 6','Guantes desechables — 50 unidades','Cinta métrica — 25 pies','Juego de destornilladores — 6 piezas','Cinta adhesiva resistente — paquete de 2'];

const esDescs=['Toallas absorbentes para uso diario','Paquete de papel para baño','Servilletas prácticas para la mesa','Pañuelos suaves para el hogar','Detergente líquido para ropa','Limpieza diaria de platos','Limpiador para superficies del hogar','Producto esencial para lavandería','Jabón para cocina y baño','Jabón para higiene diaria','Producto esencial para manos','Bolsas para basura de cocina','Para cocinar y almacenar alimentos','Esponjas de uso múltiple','Para uso general en el hogar','Herramienta para medir','Juego básico para reparaciones','Cinta para reparaciones'];

function t(en,es){return language==='es'?es:en}
function showSection(s){try{localStorage.setItem('homebase_tab',s)}catch(e){}document.getElementById('home').classList.toggle('hidden',s!=='home');
document.getElementById('business').classList.toggle('hidden',s!=='business');
document.getElementById('homeTab').classList.toggle('active',s==='home');
document.getElementById('businessTab').classList.toggle('active',s==='business');
window.scrollTo({top:0,behavior:'smooth'})}
function toggleLanguage(){language=language==='en'?'es':'en';
try{localStorage.setItem('homebase_lang',language)}catch(e){}document.documentElement.lang=language;
document.getElementById('langbtn').textContent=language==='en'?'Español':'English';
document.querySelectorAll('[data-en]').forEach(el=>{el.textContent=el.getAttribute('data-'+language)});
document.querySelectorAll('[data-placeholder-en]').forEach(el=>{el.placeholder=el.getAttribute('data-placeholder-'+language)});
document.querySelectorAll('[data-i18n]').forEach(el=>{let k=el.dataset.i18n;el.textContent=(deliveryTranslations[k]||{})[language]||el.textContent});
renderProducts();
renderCart()}
const deliveryTranslations={fulfillment:{en:'How would you like your order?',es:'¿Cómo quieres recibir tu pedido?'},pickup:{en:'Pickup (details confirmed after ordering)',es:'Recoger (detalles por confirmar)'},delivery:{en:'Local delivery (availability and fee to be confirmed)',es:'Entrega local (disponibilidad y costo por confirmar)'},deliveryaddress:{en:'Delivery address',es:'Dirección de entrega'},deliverynote:{en:'Delivery areas, minimum orders and fees have not been finalized.',es:'Las zonas de entrega, los pedidos mínimos y las tarifas aún no se han definido.'},fulfillmentquote:{en:'Preferred fulfillment',es:'Método de entrega preferido'},pickupshort:{en:'Pickup',es:'Recoger'},deliveryshort:{en:'Delivery (subject to confirmation)',es:'Entrega a domicilio (sujeta a confirmación)'},bannerTitle:{en:'Local delivery options',es:'Opciones de entrega local'},bannerText:{en:'Need supplies brought to you? Select delivery in your cart or request it with a business quote. Service areas and fees will be confirmed before launch.',es:'¿Necesitas que llevemos los productos? Selecciona entrega en el carrito o solicítala en una cotización comercial. Las zonas y tarifas se confirmarán antes del lanzamiento.'}};

function renderProducts(){let q=document.getElementById('search').value.toLowerCase(),cat=document.getElementById('filter').value;
let filtered=items.filter(x=>(cat==='all'||x.category===cat)&&((language==='es'?esNames[x.id]:x.name).toLowerCase().includes(q)));
document.getElementById('products').innerHTML=filtered.length?filtered.map(x=>`<article class="product"><div class="visual">${x.emoji}</div><div class="details"><span class="category">${language==='es'?esCats[x.category]:x.category}</span><h3>${language==='es'?esNames[x.id]:x.name}</h3><p>${language==='es'?esDescs[x.id]:x.desc}</p><span class="price">$${x.price.toFixed(2)}</span><button class="add" onclick="addCart(${x.id})">${t('Add to cart','Agregar al carrito')}</button></div></article>`).join(''):`<p>${t('No products found.','No se encontraron productos.')}</p>`}
function addCart(id){cart[id]=(cart[id]||0)+1;
renderCart()}
function changeQty(id,delta){cart[id]=Math.max(0,(cart[id]||0)+delta);
if(!cart[id])delete cart[id];
renderCart()}
function renderCart(){try{localStorage.setItem('homebase_cart',JSON.stringify(cart))}catch(e){}let keys=Object.keys(cart).filter(k=>cart[k]>0);
document.getElementById('cartcount').textContent=keys.reduce((a,k)=>a+cart[k],0);
document.getElementById('cartitems').innerHTML=keys.length?keys.map(k=>`<div class="cartline"><div><strong>${language==='es'?esNames[k]:items[k].name}</strong><br><small>${t('Qty','Cant.')} ${cart[k]} × $${items[k].price.toFixed(2)}</small></div><div style="display:flex;gap:7px;align-items:center"><button onclick="changeQty(${k},-1)" aria-label="Decrease quantity">−</button><b>${cart[k]}</b><button onclick="changeQty(${k},1)" aria-label="Increase quantity">+</button></div></div>`).join(''):`<p>${t('Your cart is empty.','Tu carrito está vacío.')}</p>`;
document.getElementById('total').textContent=t('Subtotal: $','Subtotal: $')+keys.reduce((a,k)=>a+cart[k]*items[k].price,0).toFixed(2)}
function toggleCart(){document.getElementById('drawer').classList.toggle('open')}
function updateFulfillment(){document.getElementById('deliveryfields').classList.toggle('hidden',document.querySelector('input[name="fulfill"]:checked').value!=='delivery')}
function prepareQuote(e){e.preventDefault();
let org=document.getElementById('org').value,contact=document.getElementById('contact').value,email=document.getElementById('email').value,type=document.getElementById('orgtype').value,needs=document.getElementById('needs').value,delivery=document.getElementById('quoteDelivery').value;
let subject='HomeBase Essentials - '+t('Bulk Supply Quote Request','Solicitud de cotización')+' - '+org;
let body=`${t('Organization','Organización')}: ${org}\n${t('Contact','Contacto')}: ${contact}\n${t('Email','Correo')}: ${email}\n${t('Type','Tipo')}: ${type}\n${t('Fulfillment','Entrega')}: ${delivery}\n\n${t('Requested items and quantities','Productos y cantidades solicitadas')}:\n${needs}`;
document.getElementById('quoteStatus').textContent=t('Quote prepared. Copy the details below and send them once a business email is published.','Cotización preparada. Copia la información y envíala cuando se publique el correo comercial.');
const old=document.getElementById('draft');
if(old)old.remove();
let box=document.createElement('textarea');
box.id='draft';
box.readOnly=true;
box.style.width='100%';
box.style.minHeight='150px';
box.value='Subject: '+subject+'\n\n'+body;
document.getElementById('quoteStatus').after(box)}
function demoCheckout(){alert(t('Online checkout is not connected yet. Delivery is a request option only; no order has been placed.','El pago en línea todavía no está disponible. La entrega es solo una opción de solicitud; no se ha realizado ningún pedido.'))}
document.querySelector('#drawer .goldbtn').onclick=demoCheckout;

renderProducts();
renderCart();

async function copyText(value,field){try{await navigator.clipboard.writeText(value);
document.getElementById(field).textContent=t('Copied! You can paste this into an email or message.','¡Copiado! Puedes pegarlo en un correo o mensaje.')}catch(e){const a=document.createElement('textarea');
a.value=value;
a.style.width='100%';
a.style.minHeight='110px';
a.readOnly=true;
document.getElementById(field).replaceWith(a);
a.select();
}}
function copyOrder(){const keys=Object.keys(cart).filter(k=>cart[k]>0);
if(!keys.length){document.getElementById('orderstatus').textContent=t('Add at least one item first.','Primero agrega al menos un producto.');
return;
}const fulfillment=document.querySelector('input[name="fulfill"]:checked').value;
const address=document.getElementById('deliveryaddress').value.trim();
if(fulfillment==='delivery'&&!address){document.getElementById('orderstatus').textContent=t('Enter a delivery address before copying your request.','Ingresa la dirección de entrega antes de copiar la solicitud.');
return;
}const subtotal=keys.reduce((s,k)=>s+cart[k]*items[k].price,0);
const lines=[t('HomeBase Essentials — Product Inquiry','HomeBase Essentials — Consulta de productos'),''];
keys.forEach(k=>lines.push(`${cart[k]} × ${language==='es'?esNames[k]:items[k].name} — $${(cart[k]*items[k].price).toFixed(2)}`));
lines.push('',`${t('Estimated sample subtotal','Subtotal estimado de muestra')}: $${subtotal.toFixed(2)}`,`${t('Requested method','Método solicitado')}: ${fulfillment==='delivery'?t('Local delivery','Entrega local'):t('Pickup','Recoger')}`);
if(address)lines.push(`${t('Delivery address','Dirección de entrega')}: ${address}`);
lines.push('',t('This is an inquiry only. Prices, inventory, delivery, fees and fulfillment require confirmation. No order or payment has been placed.','Esta es solo una consulta. Los precios, inventario, entrega, tarifas y disponibilidad requieren confirmación. No se ha realizado ningún pedido ni pago.'));
copyText(lines.join('\n'),'orderstatus')}
const originalPrepareQuote=prepareQuote;

prepareQuote=function(e){originalPrepareQuote(e);
const draft=document.getElementById('draft');
if(draft){const btn=document.getElementById('copyQuote')||document.createElement('button');
btn.id='copyQuote';
btn.type='button';
btn.className='secondarybtn';
btn.textContent=t('Copy quote details','Copiar detalles de cotización');
btn.onclick=()=>copyText(draft.value,'quoteStatus');
draft.after(btn)}};

window.addEventListener('DOMContentLoaded',()=>{renderCart();if(language==='es'){language='en';toggleLanguage()}try{if(localStorage.getItem('homebase_tab')==='business')showSection('business')}catch(e){}});

