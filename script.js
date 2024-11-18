class ProductViewer extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.loadproducts();
    }
  
    async loadproducts() {
      try {
        const response = await fetch('https://products-foniuhqsba-uc.a.run.app/Cameras');
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const products = await response.json();
        this.renderproducts(products);
      } catch (error) {
        console.error('Error:', error);
        this.innerHTML = `<p>Error al cargar los artículos. Inténtelo nuevamente más tarde.</p>`;
      }
    }
  
    renderproducts(products) {
      const template = document.getElementById('product-template');
      
      // Limpiar contenido existente
      this.innerHTML = '';
  
      products.forEach(product => {
        // Clonar el contenido de la plantilla
        const productContent = document.importNode(template.content, true);
        
        productContent.querySelector('.title').textContent = product.title;
        productContent.querySelector('.short_description').textContent = product.short_description;
 //       productContent.querySelector('.description').textContent = product.description;
 //       productContent.querySelector('.date').textContent = product.date;
  //      productContent.querySelector('.category').textContent = product.category;
 //       productContent.querySelector('.rating').textContent = product.rating;
       productContent.querySelector('.price').textContent = product.price;
        
        // Asignar la imagen al atributo src del <img>
        productContent.querySelector('.img').src = product.image;
        
        // Añadir el artículo al componente
        this.appendChild(productContent);
      });
    }
  }
  
  // Definir el elemento personalizado
  customElements.define('product-viewer', ProductViewer);

  class RelativeTime extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      setInterval(() => this.render(), 1000);
    }
    static get observedAttributes() {
      return ['time'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
    render() {
      const timeValue = this.getAttribute('time')
      const time = timeValue ? new Date(Number(timeValue)).getTime() : Date.now();
      const now = Date.now();
  
      const diff = now - time;
      const seconds = Math.floor(diff / 1000) || 1;
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(months / 12);
  
      let aux = '...';
      if (months >= 12) {
        aux = `Hace ${years} año${years > 1 ? 's' : ''}`
      } else if (days > 30 && months >= 1) {
        aux = `Hace ${months} mes${months > 1 ? 'es' : ''}`
      } else if (days >= 1) {
        aux = `Hace ${days} día${days > 1 ? 's' : ''}`
      } else if (hours >= 1) {
        aux = `Hace ${hours} hora${hours > 1 ? 's' : ''}`
      } else if (minutes >= 1) {
        aux = `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
      } else if (seconds >= 1) {
        aux = `Hace ${seconds} segundo${seconds > 1 ? 's' : ''}`
      }
  
      this.textContent = aux;
    } 
  }
  customElements.define('relative-time', RelativeTime);
  