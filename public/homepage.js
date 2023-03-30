let pageNumber = 0;
let maxPageNumber = pageNumber;
const DISPLAY_LIMIT = 5;
let productDataArray = [];
const prevPage = document.getElementById('section--load-previous');
const nextPage = document.getElementById('section--load-more');

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

	const viewDetails = document.createElement('button');
	viewDetails.textContent = 'View Details';
	viewDetails.classList.add('product-details-btn');
	viewDetails.addEventListener('click', displayModal);

	const addToCart = document.createElement('button');
	addToCart.textContent = 'Add to Cart';
	addToCart.classList.add('product-add-cart');
	addToCart.addEventListener('click', addItemToUserCart);

	const buttonDiv = document.createElement('div');
	buttonDiv.className = 'product--btn-container';
	buttonDiv.append(addToCart, viewDetails);
	

	productDiv.append(productImage, productTitle, buttonDiv);
	return productDiv;
}

async function fetchProducts(){
	if(pageNumber !==0 && pageNumber <= maxPageNumber) return;
	const res = await fetch(`/getproducts?limit=${DISPLAY_LIMIT}&page=${pageNumber}`,
	{
		method: 'GET',
		headers: {'content-type': 'application/json'}
	});
	
	const body = await res.json();
	
	if(body.length == 0){
		return false;
	}
	productDataArray = [...productDataArray, ...body];
	maxPageNumber = Math.max(maxPageNumber, pageNumber);
}

function createProductModal(dataObj){

	const productModal = document.getElementById('product--modal');
	const innerHTML = `
		<div class="modal--content">
			<button class="modal--close" id="modal--close">X</button>
			<img class="modal--image" src="${dataObj.image}" />
			<span class="modal--title">${dataObj.title}</span><br>
			<span class="modal--type">${dataObj.category}</span><br>
			<span class="modal--cost">Price: $${dataObj.price}</span><br>
			<span class="modal--stock">Stock remaining: ${dataObj.stock}</span><br>
			<p class="modal--description">${dataObj.description}</p>
		</div>`;

	productModal.innerHTML = innerHTML;

	const closeBtn = productModal.querySelector('#modal--close');
	closeBtn.addEventListener('click', () => productModal.classList.add('hidden'));
}

function displayModal(event){
	const id = event.target.parentNode.parentNode.dataset.id;
	const modal = document.getElementById('product--modal');
	modal.classList.remove('hidden');
	
	const data = productDataArray.find( ele => ele.id == id);
	createProductModal(data);

	window.onclick = (event) => {
		if (event.target == modal) {
		  modal.classList.add('hidden');
		  window.onclick = null;
		}
	}
}

function appendProductsToPage(){
	const productParent = document.getElementById('section--productslist');
	productParent.innerHTML = "";

	for(let i = pageNumber * 5; i < pageNumber * 5 + 5; ++i){
		const productDom = returnProductDom(productDataArray[i]);
		productParent.append(productDom);
	}
}

async function initpage(){
	await fetchProducts();
	appendProductsToPage();
	prevPage.disabled = true;
}

async function addItemToUserCart(event){
	const id = event.target.parentNode.parentNode.dataset.id;

	fetch(`/additemtocart?id=${id}`, {
		method: 'POST'
	});
}

initpage();

nextPage.addEventListener('click', async ()=>{
	++pageNumber;
	if(prevPage.disabled){
		prevPage.disabled = false;
	}
	const hasMoreProducts = await fetchProducts();

	if(hasMoreProducts === false){
		nextPage.disabled = true;
		--pageNumber;
		return;
	}
	appendProductsToPage();
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

document.getElementById('cart-page').onclick = ()=>{
	window.location.href= '/mycart';
}