/*
  নোট:
  - POS sale save
  - Reduce stock indirectly
*/

let sales = JSON.parse(localStorage.getItem("sales")) || [];

function sell(barcode, qty){
  sales.push({ barcode, qty, date: Date.now() });
  localStorage.setItem("sales", JSON.stringify(sales));
}
