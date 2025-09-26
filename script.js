$(function() {
  const restaurants = [
    {
      id: 1,
      name: "Spice Villa",
      cuisine: "Indian",
      img: "https://picsum.photos/seed/indian/400/300",
      menu: [
        { id: 101, name: "Butter Chicken", price: 240 },
        { id: 102, name: "Paneer Tikka", price: 180 },
        { id: 103, name: "Garlic Naan", price: 40 }
      ]
    },
    {
      id: 2,
      name: "Sushi House",
      cuisine: "Japanese",
      img: "https://picsum.photos/seed/japanese/400/300",
      menu: [
        { id: 201, name: "Salmon Nigiri", price: 220 },
        { id: 202, name: "Miso Soup", price: 80 },
        { id: 203, name: "California Roll", price: 260 }
      ]
    },
    {
      id: 3,
      name: "La Pasta",
      cuisine: "Italian",
      img: "https://picsum.photos/seed/italian/400/300",
      menu: [
        { id: 301, name: "Carbonara", price: 230 },
        { id: 302, name: "Margherita Pizza", price: 270 },
        { id: 303, name: "Tiramisu", price: 120 }
      ]
    }
  ];

  let cart = {};
  let orders = [];

  function renderRestaurants() {
    const $row = $('#restaurantsRow').empty();
    restaurants.forEach(r => {
      const col = $(`
        <div class="col-md-4">
          <div class="card restaurant-card shadow">
            <img src="${r.img}" class="card-img-top">
            <div class="card-body">
              <h5>${r.name}</h5>
              <p class="small text-muted">${r.cuisine}</p>
              <div id="menu-${r.id}"></div>
            </div>
          </div>
        </div>
      `);

      r.menu.forEach(m => {
        col.find(`#menu-${r.id}`).append(`
          <div class="d-flex justify-content-between align-items-center my-1">
            <span>${m.name} - ₹${m.price}</span>
            <button class="btn btn-sm btn-primary add-to-cart" data-rid="${r.id}" data-id="${m.id}">Add</button>
          </div>
        `);
      });

      $row.append(col);
    });
  }

  function addToCart(rid, mid) {
    const r = restaurants.find(x => x.id == rid);
    const item = r.menu.find(m => m.id == mid);
    if (!cart[mid]) cart[mid] = { ...item, qty: 0 };
    cart[mid].qty++;
    renderCart();
  }

  function renderCart() {
    const $c = $('#cartItems').empty();
    let total = 0, count = 0;

    Object.values(cart).forEach(it => {
      const sub = it.qty * it.price;
      total += sub; count++;
      $c.append(`
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
          <div>${it.name} x${it.qty} = ₹${sub}</div>
          <button class="btn btn-sm btn-danger remove" data-id="${it.id}">Remove</button>
        </div>
      `);
    });

    $('#cartTotal').text(total);
    $('#checkoutBtn').prop('disabled', count === 0);
  }

  function removeItem(id) {
    delete cart[id];
    renderCart();
  }

  function checkout() {
    if (Object.keys(cart).length === 0) return;
    const order = {
      id: "ORD" + Date.now(),
      items: Object.values(cart),
      total: Object.values(cart).reduce((s, it) => s + it.qty * it.price, 0),
      status: "Preparing"
    };
    orders.unshift(order);
    cart = {};
    renderCart();
    renderOrders();
    alert("Order placed! ID: " + order.id);

    // Simulate status updates
    setTimeout(() => { order.status = "Out for delivery"; renderOrders(); }, 4000);
    setTimeout(() => { order.status = "Delivered"; renderOrders(); }, 8000);
  }

  function renderOrders() {
    const $o = $('#ordersList').empty();
    if (orders.length === 0) { $o.text("No orders placed yet."); return; }
    orders.forEach(or => {
      $o.append(`
        <div class="border rounded p-2 mb-2">
          <strong>${or.id}</strong> - ₹${or.total}
          <div class="small text-muted">${or.items.map(it => it.qty + "x " + it.name).join(", ")}</div>
          <div class="fw-bold text-primary">Status: ${or.status}</div>
        </div>
      `);
    });
  }

  // Event bindings
  $(document).on('click', '.add-to-cart', function() {
    addToCart($(this).data('rid'), $(this).data('id'));
  });
  $(document).on('click', '.remove', function() {
    removeItem($(this).data('id'));
  });
  $('#checkoutBtn').click(checkout);

  // Init
  renderRestaurants();
  renderCart();
  renderOrders();
});
