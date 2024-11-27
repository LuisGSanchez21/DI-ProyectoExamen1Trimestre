function cambiarVista() {
  const vista = document.querySelector(".grid-container-normal");
  if (vista) {
    vista.classList.remove("grid-container-normal");
    vista.classList.add("grid-container-modificado");
  } else {
    const vistaModificada = document.querySelector(".grid-container-modificado");
    if (vistaModificada) {
      vistaModificada.classList.remove("grid-container-modificado");
      vistaModificada.classList.add("grid-container-normal");
    }
  }
}

class Card extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const response = await fetch("https://products-foniuhqsba-uc.a.run.app/Cameras");
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const products = await response.json();
      this.renderProducts(products);
    } catch (error) {
      console.error("Error:", error);
      this.innerHTML = `<p>Error al cargar los artículos. Inténtelo nuevamente más tarde.</p>`;
    }
  }

  renderProducts(products) {
    const template = document.getElementById("product-template");
    this.innerHTML = ""; // Clear existing content

    products.forEach((product) => {
      const productContent = document.importNode(template.content, true);
      productContent.querySelector(".title").textContent = product.title;
      productContent.querySelector(".short_description").textContent = product.short_description;
      productContent.querySelector(".description").textContent = product.description;
      productContent.querySelector(".date").textContent = product.date;
      productContent.querySelector(".category").textContent = product.category;
      productContent.querySelector(".price").textContent = `$${product.price}`;
      productContent.querySelector(".id").textContent = product.id;
      productContent.querySelector(".img").src = product.image;

      const tagsContainer = productContent.querySelector(".tags");
      tagsContainer.innerHTML = "";
      product.tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.className = "inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2";
        tagElement.textContent = `#${tag}`;
        tagsContainer.appendChild(tagElement);
      });

      const add2Cart = productContent.querySelector(".add2cart");
      add2Cart.addEventListener("click", () => {
        const productsInCart = JSON.parse(localStorage.getItem("products") || "[]");
        productsInCart.push(product);
        localStorage.setItem("products", JSON.stringify(productsInCart));

        const customCart = document.querySelector("custom-cart");
        if (customCart) {
          customCart.render();
        }
      });

      this.appendChild(productContent);
    });
  }
}

customElements.define("product-card", Card);

class RelativeTime extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    setInterval(() => this.render(), 1000);
  }
  static get observedAttributes() {
    return ["time"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }
  render() {
    const timeValue = this.getAttribute("time");
    const time = timeValue ? new Date(Number(timeValue)).getTime() : Date.now();
    const now = Date.now();
    const diff = now - time;
    const seconds = Math.floor(diff / 1000) || 1;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    let aux = "...";
    if (months >= 12) {
      aux = `Hace ${years} año${years > 1 ? "s" : ""}`;
    } else if (days > 30 && months >= 1) {
      aux = `Hace ${months} mes${months > 1 ? "es" : ""}`;
    } else if (days >= 1) {
      aux = `Hace ${days} día${days > 1 ? "s" : ""}`;
    } else if (hours >= 1) {
      aux = `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
    } else if (minutes >= 1) {
      aux = `Hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
    } else if (seconds >= 1) {
      aux = `Hace ${seconds} segundo${seconds > 1 ? "s" : ""}`;
    }

    this.textContent = aux;
  }
}
customElements.define("relative-time", RelativeTime);

class CustomCart extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const cartItems = JSON.parse(localStorage.getItem('products')) || [];
    const template = document.getElementById("cart-template");
    this.innerHTML = ""; // Clear existing cart items

    cartItems.forEach(product => {
      const cartContent = document.importNode(template.content, true);
      cartContent.querySelector(".title").textContent = product.title;
      cartContent.querySelector(".price").textContent = product.price;
      cartContent.querySelector("img").src = product.image;

      // Add event listener to remove item from cart
      const removeButton = cartContent.querySelector(".remove");
      removeButton.addEventListener("click", () => {
        this.removeFromCart(item.id);
      });

      this.appendChild(cartContent);
    });
  }

  removeFromCart(id) {
    let cartItems = JSON.parse(localStorage.getItem('products')) || [];
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem('products', JSON.stringify(cartItems));
    this.render(); // Re-render the cart
  }
}

customElements.define("custom-cart", CustomCart);

async function camInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const camImg = document.querySelector('img');
  const camTitle = document.querySelector('.title');
  const camDesc = document.querySelector('.description');
  const camTags = document.querySelector('.tags');
  const camPrice = document.querySelector('.price');
  const comprar = document.querySelector('.add2cart');

  try {
    const response = await fetch(`https://products-foniuhqsba-uc.a.run.app/Cameras/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener la cámara');
    }
    const camera = await response.json();
    camImg.src = camera.image;
    camTitle.textContent = camera.title;
    camDesc.textContent = camera.description;

    camTags.innerHTML = ""; // Clear existing tags
    camera.tags.forEach(tag => {
      const element = document.createElement('p');
      element.textContent = tag;
      element.className = 'tag';
      camTags.appendChild(element);
    });

    camPrice.textContent = camera.price;

    comprar.addEventListener('click', () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const cameraData = {
        numArticulo: cart.length + 1,
        id: id,
        url: 'camera.html?id=' + id,
        image: camImg.src,
        title: camTitle.textContent,
        price: camPrice.textContent,
      };
      cart.push(cameraData);
      localStorage.setItem('cart', JSON.stringify(cart));
      loadCart();
    });

  } catch (error) {
    console.error('Error:', error);
    const div = document.createElement('div');
    div.innerHTML = `<p>Error al cargar la cámara. Inténtelo nuevamente más tarde.</p>`;
    document.body.appendChild(div);
  }
}

if (window.location.pathname.includes("camera.html")) {
  camInfo();
}

