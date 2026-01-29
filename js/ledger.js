/*
  নোট:
  - Income / Expense ledger
*/

let entries = JSON.parse(localStorage.getItem("ledger")) || [];
const form = document.getElementById("ledger-form");
const tbody = document.getElementById("ledger-body");

form.addEventListener("submit", e=>{
  e.preventDefault();
  entries.push({
    desc: desc.value,
    amount: +amount.value,
    type: type.value
  });
  localStorage.setItem("ledger", JSON.stringify(entries));
  render();
  form.reset();
});

function render(){
  tbody.innerHTML="";
  entries.forEach(e=>{
    tbody.innerHTML+=`<tr><td>${e.desc}</td><td>${e.amount}</td><td>${e.type}</td></tr>`;
  });
}
render();
