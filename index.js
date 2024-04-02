import { menuArray } from "./data.js";

const menuItemListEl = document.getElementById("menu-item-list");
const cartItemListEl = document.getElementById("cart-item-list");
const totalPriceEl = document.getElementById("total-price");
const submitBtnEl = document.getElementById("submit-btn");
const modalEl = document.getElementById("modal");
const nameInputEl = document.getElementById("name-input");
const cardNumberInputEl = document.getElementById("card-number-input");
const cvvInputEl = document.getElementById("cvv-input");
const payBtnEl = document.getElementById("pay-btn");
const dismissBtnEl = document.getElementById("dismiss-btn");
const yourOrderSectionEl = document.getElementById("your-order-section");

let updatedTotalPrice = 0;
let allItemsInCartArr = [];
let cartItemsList = [];

document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    addItem(e.target.dataset.add);
  } else if (e.target.dataset.remove) {
    removeItem(e.target.dataset.remove);
  }
});

function addItem(itemId) {
  const selectedItem = menuArray.find(function (item) {
    return item.id == itemId;
  });
  allItemsInCartArr.push(selectedItem);
  yourOrderSectionEl.style.visibility = "visible";
  updatedTotalPrice = calculateTotalPrice();
  renderCartItemList();
}

function removeItem(itemId) {
  const selectedItem = allItemsInCartArr.find((item) => item.id == itemId);
  removeItemfromAllItemsInCartArr(selectedItem);

  if (allItemsInCartArr.length < 1) {
    yourOrderSectionEl.style.visibility = "hidden";
  }
  updatedTotalPrice = calculateTotalPrice();
  renderCartItemList();
}

submitBtnEl.addEventListener("click", function () {
  modalEl.style.display = "block"; // Vis modalen når knappen klikkes
});

payBtnEl.addEventListener("click", function (e) {
  if (
    nameInputEl.value === "" ||
    cardNumberInputEl.value === "" ||
    cvvInputEl.value === ""
  ) {
    e.preventDefault(); // Forhindrer at skjemaet sendes
    document.getElementById("error-message").innerText =
      "Vennligst fyll ut alle feltene.";
  } else {
    const name = nameInputEl.value;
    yourOrderSectionEl.style.height = "20px";
    renderMessage(name);
  }
});

dismissBtnEl.addEventListener("click", function () {
  modalEl.style.display = "none"; // Vis modalen når knappen klikkes
});

function renderMessage(name) {
  yourOrderSectionEl.style.visibility = "visible";
  yourOrderSectionEl.innerHTML = `Takk, ${name}! Din bestilling er på vei!`;
  modalEl.style.display = "none";
}

function getNumberOfOccurencesArr(arr) {
  let occurrences = {};

  // Gå gjennom hvert element i arrayen
  arr.forEach(function (element) {
    // Konverter objektet til en streng for å bruke det som nøkkel i occurrences
    let key = JSON.stringify(element);
    // Hvis elementet allerede finnes i occurrences, øk antallet
    if (occurrences[key]) {
      occurrences[key]++;
    } else {
      // Ellers, legg til elementet i occurrences med antall 1
      occurrences[key] = 1;
    }
  });

  // Bruk Object.values() for å hente ut bare verdiene av occurrences
  return Object.values(occurrences);
}

function updateCartItemsList(arr) {
  cartItemsList = getUniqueCartItemsArr(arr);
}

function getUniqueCartItemsArr(arr) {
  return [...new Set(arr)];
}

function removeItemfromAllItemsInCartArr(item) {
  const index = allItemsInCartArr.indexOf(item);
  allItemsInCartArr.splice(index, 1);
  {
    return allItemsInCartArr;
  }
}

function getCartItemListHtml(arr) {
  const numberOfOccurencesArr = getNumberOfOccurencesArr(arr);
  updateCartItemsList(arr);
  const arrayOfUniqueIds = cartItemsList.map((item) => item.id);
  const totalPricePerItemTypeArr = arrayOfUniqueIds.map(function (id) {
    const totalPricePerItem = arr.reduce(function (total, cur) {
      if (cur.id === id) {
        return total + cur.price;
      } else return total;
    }, 0);
    return totalPricePerItem;
  });
  return cartItemsList
    .map(function (item, index) {
      const itemNameWithLowerCase = item.name.toLowerCase();
      const itemNameWithDashes = replaceSpacingWithDash(itemNameWithLowerCase);
      return `
      <div class="item-in-cart">
        <div class="item-in-cart-left-content">
          <p class="body-text"> ${item.name} </p>
        <div class="quantity-and-remove-btn">
          <p class="body-text" id="number-of-${itemNameWithDashes}"> x ${numberOfOccurencesArr[index]} </p>
          <button class="remove-btn" data-remove="${item.id}" >fjern</button>
        </div>
      </div>
      <p class="p-price">kr ${totalPricePerItemTypeArr[index]}</p>
      </div>`;
    })
    .join(" ");
}

function calculateTotalPrice() {
  return allItemsInCartArr.reduce(function (total, cur) {
    return total + cur.price;
  }, 0);
}

function getMenuItemListHtml(arr) {
  return arr
    .map(function (item) {
      let ingredients = item.ingredients.join(", ");
      return `
      <div class="div-menu-item">

        <div class="div-menu-item-content-right-side">
          <div class="div-emoji">
            <p class="emoji">
            ${item.emoji}
            </p>
          </div>
          <div class="div-item-details">
            <h2>${item.name}</h2>
            <p class="p-ingredients">${ingredients}</p>
            <p class="p-price">kr ${item.price}</p>
          </div>
        </div>

        <button class="add-btn" data-add="${item.id}">+</button>

      </div>
      `;
    })
    .join(" ");
}

renderMenuItemList();

function renderMenuItemList() {
  menuItemListEl.innerHTML = getMenuItemListHtml(menuArray);
  menuItemListEl.lastElementChild.style.borderBottom = "none";
}

function renderCartItemList() {
  cartItemListEl.innerHTML = getCartItemListHtml(allItemsInCartArr);
  totalPriceEl.innerHTML = `kr ${updatedTotalPrice}`;
  renderNumberOfOccurences(allItemsInCartArr);
}

function renderNumberOfOccurences(arr) {
  const numberOfOccurencesArr = getNumberOfOccurencesArr(arr);
  numberOfOccurencesArr.forEach(function (number, index) {
    const dynamicPartOfId = cartItemsList.map(function (item) {
      const nameOfItem = item.name.toLowerCase();
      return replaceSpacingWithDash(nameOfItem);
    });
    const id = "number-of-" + dynamicPartOfId[index];

    if (number >= 2) {
      document.getElementById(id).style.visibility = "visible";
      document.getElementById(id).style.display = "block";
    }
  });
}

function replaceSpacingWithDash(str) {
  return str.replace(/\s+/g, "-");
}
