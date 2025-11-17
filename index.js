// Section des Articles
// Use relative imports so modules load correctly in the browser when
// `index.js` is included as a module in the HTML page.
import { data } from "./data.js";
import { data as maritimeData } from "./maritime.js";
import { data as centraleData } from "./centrale.js";
import { generateDialogHTML, generateProductHTML } from "./functions.js";

// selection des elements
const productsContainer = document.querySelector(".produits");
const dialog = document.querySelector("dialog");
const cartNumber = document.querySelector(".nombre");

let currentItem = null;

// Items in cart
let cartItems = [];
// cartNumber.textContent = cartItems.length;
let produitAffciher = data;

// Generic renderer for a list of items into a container using product HTML
function renderItems(items, container) {
  if (!container) return;
  container.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("carte-produit");
    card.setAttribute("data-id", item.id);
    card.innerHTML = generateProductHTML(item);
    container.appendChild(card);
  });
  attachCardActions(container, items);
}

// Render default product list
renderItems(data, productsContainer);

// Recherche des produits
const input = document.querySelector(".recherche");
input.addEventListener("keyup", (e) => {
  console.log(e.target.value);
	const query = (e.target.value || "").toLocaleLowerCase().trim();
	const resultat = data.filter((p) =>
		(p.nom || "").toLocaleLowerCase().includes(query)
	);
  productsContainer.innerHTML = "";
  if (resultat.length > 0) {
    renderItems(resultat, productsContainer);
  } else {
    const vide = document.createElement("h3");
    vide.textContent = "Aucun produit trouvé";
    productsContainer.appendChild(vide);
  }
});
// Attach click actions to cards in a given container using the provided items array to resolve ids
function attachCardActions(container, items) {
  const cards = container.querySelectorAll(".carte-produit");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const dialogEl = document.querySelector("dialog");

      const dialogContent = document.querySelector(".dialog-menu");
      dialogContent && dialogContent.remove();
      dialogEl.showModal();
      dialogEl.scrollTo(0, 0);
      const section = document.createElement("section");
      section.classList.add("dialog-menu");
      const current = items.find((i) => i.id == card.dataset.id);
      section.innerHTML = generateDialogHTML(current);
      dialogEl.appendChild(section);

      // whatsapp button in dialog
      const btnWhatsapp = dialogEl.querySelector('.send-whatsapp');
      if (btnWhatsapp) {
        btnWhatsapp.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const link = btnWhatsapp.getAttribute('data-product-link');
          const productName = btnWhatsapp.getAttribute('data-product-name');
          const phoneNumber = '22890381883';
          const message = `Bonjour, je suis intéressé par ce produit:\n${productName}\n\n${link}`;
          const encodedMessage = encodeURIComponent(message);
          const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
          window.open(whatsappUrl, '_blank', 'noopener');
        });
      }
    });
  });
}

// Render maritime -> in the section .eglise and centrale -> .centrale to match user's request
const egliseContainer = document.querySelector('.eglise');
const centraleContainer = document.querySelector('.centrale');

renderItems(maritimeData, egliseContainer);
renderItems(centraleData, centraleContainer);
// Close popover
const btnClose = document.querySelector(".close");
btnClose.addEventListener("click", () => {
  dialog.close();
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('header[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 50,
            sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)


