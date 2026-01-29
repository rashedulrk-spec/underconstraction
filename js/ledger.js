// ================================
// LEDGER MANAGEMENT (FULL & FINAL)
// ================================

/*
  নোট:
  এই ফাইলের কাজ:
  - Daily Income / Expense হিসাব রাখা
  - Date, Category, Note সহ entry save করা
  - Income সবুজ রঙে দেখানো
  - Expense লাল রঙে দেখানো
  - Total Income / Expense / Balance হিসাব করা
*/

// -------------------------------
// LocalStorage থেকে আগের ডাটা লোড
// -------------------------------
let entries = JSON.parse(localStorage.getItem("ledger")) || [];

// -------------------------------
// DOM Elements
// -------------------------------
const form = document.getElementById("ledger-form");
const tbody = document.getElementById("ledger-body");

const dateInput = document.getElementById("l-date");
const categoryInput = document.getElementById("l-category");
const amountInput = document.getElementById("l-amount");
const noteInput = document.getElementById("l-note");
const typeInput = document.getElementById("l-type");

const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const totalBalanceEl = document.getElementById("total-balance");

// -------------------------------
// Ledger Form Submit
// -------------------------------
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const entry = {
    date: dateInput.value,
    category: categoryInput.value,
    note: noteInput.value || "-",
    amount: Number(amountInput.value),
    type: typeInput.value // income / expense
  };

  entries.push(entry);
  localStorage.setItem("ledger", JSON.stringify(entries));

  renderLedger();
  updateSummary();
  form.reset();
});

// -------------------------------
// Ledger Table Render
// -------------------------------
function renderLedger() {
  tbody.innerHTML = "";

  entries.forEach(e => {
    const tr = document.createElement("tr");

    const amountClass =
      e.type === "income" ? "amount-income" : "amount-expense";

    tr.innerHTML = `
      <td>${e.date}</td>
      <td>${e.category}</td>
      <td>${e.note}</td>
      <td class="${amountClass}">
        ${e.type === "income" ? "+" : "-"}৳${e.amount}
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// -------------------------------
// Summary Calculation
// -------------------------------
function updateSummary() {
  let income = 0;
  let expense = 0;

  entries.forEach(e => {
    if (e.type === "income") income += e.amount;
    else expense += e.amount;
  });

  totalIncomeEl.textContent = "৳" + income;
  totalExpenseEl.textContent = "৳" + expense;
  totalBalanceEl.textContent = "৳" + (income - expense);
}

// -------------------------------
// Initial Load
// -------------------------------
renderLedger();
updateSummary();
