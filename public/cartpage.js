let pageNumber = 0;
let cartData = [];
const prevPage = document.getElementById('section--load-previous');
const nextPage = document.getElementById('section--load-more');

function appendProductsToPage(){
    const length = Math.min(pageNumber * 5 + 5, cartData.length);
    const parent = document.getElementById('section--productslist');
    parent.innerHTML = "";

    for(let i = pageNumber * 5; i < length; ++i){
        parent.appendChild(returnProductDom(cartData[i]));
    }

    if(length == cartData.length -1){
        return false;
    }
}

async function fetchProducts(){
    let data = await fetch('/getcartitems', {method: 'GET'});
    data = await data.json();

    cartData = data;
}

function returnProductDom(prop){
	const productDiv = window.document.createElement('div');
	productDiv.classList.add('singleProduct');
	productDiv.setAttribute('data-id', prop.id);

	const productImage = document.createElement('img');
	productImage.setAttribute('src', prop.image);
	productImage.classList.add('product-image');

	const productTitle = document.createElement('span');
	productTitle.textContent = prop.title;
	productTitle.classList.add('product-title');
	
    const deleteItem = document.createElement('button');
	deleteItem.textContent = 'Delete';
	deleteItem.className = 'product-details-btn dlt';
	deleteItem.addEventListener('click', (event)=>{
        fetch(`/deletefromcart?id=${event.target.parentElement.dataset.id}`, {method: 'POST'});
    });

	const incQuantity = document.createElement('button');
	incQuantity.textContent = '+';
	incQuantity.classList.add('inc-btn');
    
    const decQuantity = document.createElement('button');
	decQuantity.textContent = '-';
	decQuantity.classList.add('inc-btn');
    
	const quantityDiv = document.createElement('div');
	quantityDiv.className = 'product--quantity';

    const quantityText = document.createElement('span');
    quantityText.textContent = `Quantity: ${prop.quantity}`;
    quantityDiv.append(quantityText, decQuantity, incQuantity);

	incQuantity.addEventListener('click', inc);
	decQuantity.addEventListener('click', dec);

	productDiv.append(productImage, productTitle, quantityDiv, deleteItem);
	return productDiv;
}

async function initPage(){
    await fetchProducts();
    appendProductsToPage();
    prevPage.disabled = true;
}

function dec(event){
    const id = event.target.parentElement.parentElement.dataset.id;
    const ele = cartData.find( ele => ele.id == id);
    ele.quantity--;
    event.target.parentElement.firstElementChild.textContent = `Quantity: ${ele.quantity}`;
}

function inc(event){
    const id = event.target.parentElement.parentElement.dataset.id;
    const ele = cartData.find( ele => ele.id == id);
    ele.quantity++;
    event.target.parentElement.firstElementChild.textContent = `Quantity: ${ele.quantity}`;
}

initPage();

nextPage.addEventListener('click', async ()=>{
	++pageNumber;
	if(prevPage.disabled){
		prevPage.disabled = false;
	}

	const result = appendProductsToPage();

    if(result === false){
        nextPage.disabled = true;
    }
});

prevPage.addEventListener('click', ()=>{
	if(pageNumber == 0){
		prevPage.disabled = true;
		return;
	}
	if(nextPage.disabled){
		nextPage.disabled = false;
	}
	--pageNumber;
	appendProductsToPage();
});

document.getElementById('homepage').onclick = () => {
    window.location.href = '/';
}