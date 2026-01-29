// ================================
// 📦 STOCK MANAGEMENT + LOW STOCK ALERT (FINAL)
// ================================

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 নোট (Data Source):
- products   → সব Product list (product.js থেকে আসে)
- stockLogs  → Stock In / Out history
- alerted    → কোন product এ alert দেয়া হয়েছে (duplicate alert আটকাতে)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
let products   = JSON.parse(localStorage.getItem("products"))   || [];
let stockLogs  = JSON.parse(localStorage.getItem("stockLogs"))  || [];
let alerted    = JSON.parse(localStorage.getItem("alerted"))    || {};


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 নোট (DOM Elements):
- stock-form → Stock In / Out form
- stock-body → Stock table body
- lowStockSound → Low stock alert sound
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
const stockForm = document.getElementById("stock-form");
const stockBody = document.getElementById("stock-body");
const sound     = document.getElementById("lowStockSound");


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 নোট:
আজকের তারিখ (DD/MM/YYYY) format এ return করবে
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
function today() {
  return new Date().toLocaleDateString("en-GB");
}


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 নোট:
নির্দিষ্ট barcode এর বর্তমান stock balance হিসাব করে
- stockLogs ঘেঁটে IN / OUT হিসাব করে
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
function getBalance(barcode) {
  let balance = 0;

  stockLogs.forEach(log => {
    if (log.barcode === barcode) {
      balance += log.action === "in" ? log.qty : -log.qty;
    }
  });

  return balance;
}


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 নোট:
Stock form submit হলে:
- product খুঁজে বের করবে
- stockLogs এ নতুন entry যোগ করবে
- localStorage update করবে
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
stockForm?.addEventListener("submit", e => {
  e.preventDefault();

  const barcode = document.getElementById("s-barcode").value.trim();
  const qty     = Number(document.getElementById("s-qty").value);
  const action  = document.getElementById("stock-action").value;

  const product = products.find(p => p.barcode === barcode);

  if (!product) {
    alert("❌ Product not found!");
    return;
  }

  stockLogs.push({
    date: today(),
    barcode,
    name: product.name,
    action,
    qty
  });

  localStorage.setItem("stockLogs", JSON.stringify(stockLogs));

  // stock refill হলে আগের alert reset হবে
  if (action === "in") {
    delete alerted[barcode];
    localStorage.setItem("alerted", JSON.stringify(alerted));
  }

  renderStock();
  stockForm.reset();
});


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 নোট:
Stock Table Render করবে
- Balance অনুযায়ী OK / LOW / OUT detect
- CSS class apply করবে
- প্রয়োজন হলে alert trigger করবে
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
function renderStock() {
  stockBody.innerHTML = "";

  products.forEach(product => {
    const balance = getBalance(product.barcode);

    let rowClass   = "";
    let badgeClass = "stock-ok";
    let statusText = "OK";

    if (balance <= 0) {
      rowClass   = "critical-stock";
      badgeClass = "stock-critical";
      statusText = "OUT";
      triggerAlert(product.barcode, product.name, balance);
    } 
    else if (balance <= 5) {
      rowClass   = "low-stock";
      badgeClass = "stock-low";
      statusText = "LOW";
      triggerAlert(product.barcode, product.name, balance);
    }

    const tr = document.createElement("tr");
    tr.className = rowClass;

    tr.innerHTML = `
      <td><span class="stock-badge ${badgeClass}">${balance}</span></td>
      <td>${today()}</td>
      <td>${product.barcode}</td>
      <td>${product.name}</td>
      <td>${statusText}</td>
      <td>-</td>
      <td>${balance}</td>
    `;

    stockBody.appendChild(tr);
  });
}


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 নোট:
Low / Critical stock হলে:
- Sound play করবে
- Popup alert দেখাবে
- একই product এ বারবার alert যাবে না
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
function triggerAlert(barcode, name, qty) {
  if (alerted[barcode]) return;

  if (sound) sound.play();

  alert(
    qty <= 0
      ? `🔴 ${name} OUT OF STOCK!`
      : `🟡 ${name} LOW STOCK (${qty})`
  );

  alerted[barcode] = true;
  localStorage.setItem("alerted", JSON.stringify(alerted));
}


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 নোট:
Page load হলেই stock table auto render হবে
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/
renderStock();
