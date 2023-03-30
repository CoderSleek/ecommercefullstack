const modal = document.getElementById('admin--modal');
const addbtn = document.getElementById('addproduct');
let pageNumber = 0;
let maxPageNumber = pageNumber;
const DISPLAY_LIMIT = 5;
let productDataArray = [];
const prevPage = document.getElementById('section--load-previous');
const nextPage = document.getElementById('section--load-more');

async function deleteproducthandler(event){
    await fetch('/changeproduct', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({id: event.target.parentElement.parentElement.dataset.id})
    });
}

function updateproducthandler(event){
    modal.classList.remove('hidden');
    const innerHTML = `
    <form class="modal--content" method="post" action="/changeproduct">
        <div class="modal--product">
            <span>Product name</span>
            <input type="text" name="name" placeholder="product name" />
        </div>
        <div class="modal--product">
            <span>Product category</span>
            <input type="text" name="category" placeholder="product category" />
        </div>
        <div class="modal--product">
            <span>Product description</span>
            <input type="text" name="description" placeholder="product description" />
        </div>
        <div class="modal--product">
            <span>Product price</span>
            <input type="text" name="price" placeholder="product price" />
        </div>
        <div class="modal--product">
            <span>Product quantity</span>
            <input type="text" name="quantity" placeholder="product quantity" />
        </div>
        <div class="modal--submit">
            <button type="submit" class="changebtn">Update product</button>
        </div>
        <input type="hidden" name="type" value="update" />
        <input type="hidden" name="id" value="${event.target.parentElement.parentElement.dataset.id}" />
    </form>
    `;
    
    modal.innerHTML = innerHTML;

	window.onclick = (event) => {
        if (event.target == modal) {
            modal.classList.add('hidden');
            window.onclick = null;
		}
	}
}

function addproducthandler(){
    modal.classList.remove('hidden');
    const innerHTML = `
    <form class="modal--content" action="/addproduct" method="post" enctype="multipart/form-data">
        <div class="modal--product">
            <span>Product name</span>
            <input type="text" name="name" placeholder="product name" />
        </div>
        <div class="modal--product">
            <span>Product category</span>
            <input type="text" name="category" placeholder="product category" />
        </div>
        <div class="modal--product">
            <span>Product description</span>
            <input type="text" name="description" placeholder="product description" />
        </div>
        <div class="modal--product">
            <span>Product price</span>
            <input type="text" name="price" placeholder="product price" />
        </div>
        <div class="modal--product">
            <span>Product quantity</span>
            <input type="text" name="quantity" placeholder="product quantity" />
        </div>
        <div class="modal--product">
            <span>Product image</span>
            <input type="file" name="product-image" accept="image/*" />
        </div>
        <div class="modal--submit">
            <button type="submit" class="changebtn">Add product</button>
        </div>
    </form>
    `;
    
    modal.innerHTML = innerHTML;

	window.onclick = (event) => {
        if (event.target == modal) {
            modal.classList.add('hidden');
            window.onclick = null;
		}
	}
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
    
	const viewDetails = document.createElement('button');
	viewDetails.textContent = 'Update';
	viewDetails.classList.add('changebtn');
	viewDetails.addEventListener('click', updateproducthandler);
    
	const addToCart = document.createElement('button');
	addToCart.textContent = 'Delete';
	addToCart.className = 'changebtn delete';
	addToCart.addEventListener('click', deleteproducthandler);
    
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

addbtn.addEventListener('click', addproducthandler);