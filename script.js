const products = [
  { id: 1, name: "Classic Dairy Milk",   cat: "milk",   price: 80,  p: "#8a4a32", c: "#5a2a20", desc: "Smooth, creamy milk chocolate." },
  { id: 2, name: "Milk Crunch",          cat: "milk",   price: 110, p: "#a8683f", c: "#4a2218", desc: "Milk chocolate with crisp rice." },
  { id: 3, name: "Dark 70% Cocoa",       cat: "dark",   price: 150, p: "#3a1610", c: "#6a3a2c", desc: "Rich, bold and slightly bitter." },
  { id: 4, name: "Orange Dark",          cat: "dark",   price: 170, p: "#4a2014", c: "#b8651f", desc: "Dark chocolate with orange zest." },
  { id: 5, name: "Ivory White",          cat: "white",  price: 120, p: "#f3e3c8", c: "#8a6a50", desc: "Sweet vanilla white chocolate." },
  { id: 6, name: "Ruby Berry",           cat: "white",  price: 190, p: "#e0457b", c: "#6a1d3a", desc: "Pink ruby chocolate, fruity finish." },
  { id: 7, name: "Hazelnut Praline",     cat: "filled", price: 160, p: "#7a4a2a", c: "#3d2a1a", desc: "Whole hazelnuts and praline." },
  { id: 8, name: "Caramel Crunch",       cat: "filled", price: 140, p: "#b9763a", c: "#5a3a1a", desc: "Gooey caramel centre." },
  { id: 9, name: "Truffle Box (6 pcs)",  cat: "filled", price: 350, p: "#2a1410", c: "#8a3a58", desc: "Assorted handmade truffles." }
];
let cart = {}; // id -> quantity

const $ = id => document.getElementById(id);
const money = n => "₹" + n.toLocaleString("en-IN");

// Hero bar: 24 squares, click one to take a bite
const bar = $("bar");
for (let i = 0; i < 24; i++) {
  const s = document.createElement("div");
  s.className = "sq";
  s.style.animationDelay = i * 40 + "ms";
  s.addEventListener("click", () => s.classList.add("bite"));
  bar.appendChild(s);
}

function renderProducts(filter = "all") {
  const list = filter === "all" ? products : products.filter(p => p.cat === filter);
  $("productGrid").innerHTML = list.map(p => `
    <article class="card">
      <div class="wrap" style="--c:${p.c}"><div class="mini" style="--p:${p.p}"></div></div>
      <div class="info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <span class="price">${money(p.price)}</span>
        <button class="add" data-id="${p.id}">Add to cart</button>
      </div>
    </article>`).join("");
}

function renderCart() {
  const ids = Object.keys(cart);
  $("cartCount").textContent = ids.reduce((s, id) => s + cart[id], 0);
  $("cartItems").innerHTML = ids.length
    ? ids.map(id => {
        const p = products.find(x => x.id == id);
        return `<li><span>${p.name}<br>${money(p.price * cart[id])}</span>
          <span class="qty"><button data-dec="${id}" aria-label="Remove one">-</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="Add one">+</button></span></li>`;
      }).join("")
    : "<li>Your cart is empty. Add a chocolate from the shop.</li>";
  $("cartTotal").textContent = money(ids.reduce((s, id) => s + products.find(x => x.id == id).price * cart[id], 0));
}

// Filters
document.querySelector(".filters").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  renderProducts(chip.dataset.filter);
});

// Add to cart
$("productGrid").addEventListener("click", e => {
  const btn = e.target.closest(".add");
  if (!btn) return;
  cart[btn.dataset.id] = (cart[btn.dataset.id] || 0) + 1;
  renderCart();
  btn.textContent = "Added";
  setTimeout(() => (btn.textContent = "Add to cart"), 900);
});

// Quantity buttons
$("cartItems").addEventListener("click", e => {
  const inc = e.target.dataset.inc, dec = e.target.dataset.dec;
  if (inc) cart[inc]++;
  if (dec && --cart[dec] <= 0) delete cart[dec];
  renderCart();
});

// Cart drawer
$("cartBtn").addEventListener("click", () => ($("drawer").hidden = false));
$("closeCart").addEventListener("click", () => ($("drawer").hidden = true));
document.addEventListener("keydown", e => { if (e.key === "Escape") $("drawer").hidden = true; });

$("checkout").addEventListener("click", () => {
  if (!Object.keys(cart).length) return alert("Your cart is empty.");
  alert("Order placed! Your chocolates will arrive in about 20 minutes.");
  cart = {};
  renderCart();
  $("drawer").hidden = true;
});

// Delivery checker: free within 20 km
$("distForm").addEventListener("submit", e => {
  e.preventDefault();
  const km = parseFloat($("km").value);
  const out = $("distResult");
  if (km <= 20) {
    out.className = "result ok";
    out.textContent = `Great news! At ${km} km you get free delivery in about 20 minutes.`;
  } else {
    out.className = "result bad";
    out.textContent = `Sorry, ${km} km is outside our 20 km free delivery area. Delivery charges apply.`;
  }
});

// Contact form
$("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  $("formMsg").textContent = `Thanks, ${$("name").value.trim()}. We will reply soon.`;
  e.target.reset();
});

renderProducts();
renderCart();
