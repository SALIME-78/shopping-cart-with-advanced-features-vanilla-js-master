// Get users from local storage
users = JSON.parse(localStorage.getItem("users")) || [];

let bag = document.getElementById('bag')
let favorite = document.getElementById('favorite')
let bagContainer = document.getElementById('bag-container')
let productSection = document.getElementById('product-list')

users.find(user => {
  if (user.isLoggedIn) {
    document.getElementById("account").textContent = `Hi ${user.username}`;
    document.getElementById("profile").classList.remove('d-none')
    document.getElementById("profile").classList.add('d-block')
    document.getElementById("settings").classList.remove('d-none')
    document.getElementById("settings").classList.add('d-block')
    document.getElementById("signup").style.display = "none";
    document.getElementById("signin").style.display = "none";
    document.getElementById("logout").classList.add("d-block");
    document.getElementById("logout").classList.remove("d-none");
    document.getElementById("rights").classList.add("d-none");

    bag.textContent = `${user.cart.length}`
    favorite.textContent = `${user.wishList.length}`

  }
})

function goToCart() {
  if(users==[] || users.length < 1 || users == null) {
    alert("Please Login to show your cart !")
    window.location.href = "login.html"
}else{
  let user = users.find(user => user.isLoggedIn == true)
  if(!user){
    alert('Please Login First')
    window.location.href = "login.html"
    return
  }else {
    window.location.href = "cart.html"
  }
}
}

function showDesiredproducts(product){
  return `
  <div id="item-container" class="item-container">
  <div class="main-item" style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap">
      <img src=${product.imageUrl} width="100%" style="background: #eceaea; height: 115px" alt="pc" />
  </div>
  <h5 class="item-heading mt-2">
      ${product.title}
  </h5> 
  <div class="rating">
      <p class="desc" style="fontWeight: bold, textAlign: justify">Rating</p>
      <p style="font-weight: bold">${product.rating}</p>
  </div>
  <div class="d-flex justify-content-between">
  <div class="d-flex flex-column justify-content-center">
  <p class="item-price"><sup>$</sup>${product.price}</p>
  </div>
  <span class="d-flex flex-column justify-content-center">
   <i id="wish-item" class="fa-solid fa-heart wish-item" onclick="addToWishlist(${product.id})" style="cursor: pointer; font-size: 23px"></i>
   </span>
  </div>
  <button class="item-cart-btn" onclick="addToCart(${product.id})">Add To Cart</button>
</div>
  `
}

// Displaying The list of products in the DOM
function displayProducts() {
  // Clear product list
  productSection.innerHTML = ''

  products.forEach(product => {
      productSection.innerHTML += showDesiredproducts(product); 
  });
}

// adding a product to cart
function addToCart(productId) {

  if(users==[] || users == null || users.length < 1){
    alert('Please Login First')
    window.location.href = "login.html"
    return
  }

  let user = users.find(user => user.isLoggedIn == true)
  
  if(!user || user == null || user.isLoggedIn == false){
    alert('Please Login First !')
    window.location.href = "login.html"
    return
  }
  
  const success = document.getElementById("success");
  // Verify if a product is already in cart
  const existingProduct = user.cart.find((item) => item.id === productId);

  if (existingProduct) {
    alreadyInCart = document.getElementById('already-in-cart')
    
    // alert if the the product is added or already in cart
    setTimeout(() => {
      alreadyInCart.classList.remove('d-none')
    }, 500);

    setTimeout(() => {
      alreadyInCart.classList.add('d-block')
      alreadyInCart.transition = 'd-block 1s ease'
    }, 800);

    setTimeout(() => {
      alreadyInCart.classList.remove('d-block')
      alreadyInCart.classList.add('d-none')
      alreadyInCart.style.transition = 'd-none 1s ease'
    }, 1200);
    return 
  } else {
    // Find the product in the list of products
    const product = products.find((item) => item.id === productId);
    if (product) {
      user.cart.push({ ...product, quantity: 1 });
      bag.textContent = `${user.cart.length}`
      bag.style.cssText = 'transform: rotate(360deg) scale(1.3); transition: transform 1s'

      setTimeout(() => {
        success.classList.remove('d-none')
      }, 500);

      setTimeout(() => {
        success.classList.add('d-block')
        success.style.transition = 'd-block 1s ease'
      }, 800);

      setTimeout(() => {
        success.classList.remove('d-block')
        success.classList.add('d-none')
        success.style.transition = 'd-none 1s ease'
      }, 1200);

    }
  }

  localStorage.setItem("users", JSON.stringify(users));
}

let searchBar = document.getElementById('search-products')

// Search products by name
function searchProducts(s){
  let filtredProducts = products.filter((product)=>{
    return product.title.toLowerCase().startsWith(s.toLowerCase())
  });
 
    let searchedProducts = ""

    filtredProducts.forEach((product)=>{
      searchedProducts += showDesiredproducts(product)
    })

	document.getElementById("product-list").innerHTML = searchedProducts;  
}

const filterByCategory = ()=>{
  let selectElement = document.getElementById('select-by-category');

// Filter products by category
selectElement.addEventListener('change', function() {

  let selectedCategory = selectElement.value;

  let filteredProducts = products.filter((product)=>{
    return product.category === selectedCategory;
  });

  if(selectedCategory == "All"){
    filteredProducts = products
  }
  
  let searchedByCategory = ""

  filteredProducts.forEach((product)=>{
    searchedByCategory += showDesiredproducts(product)
  })
  
  filterByPrice()
  document.getElementById("product-list").innerHTML = searchedByCategory;
  
});
}

filterByCategory()

// Sort products
const sortProducts = () => {
  const sortOptions = document.getElementById('sort-options');

sortOptions.addEventListener('change', function() { 

  const sortBy = this.value

  products.sort((a, b) => {
    switch(sortBy) {
      case 'all':
        return a.id - b.id;
      case 'alphabetical-a-z':
        return a.title.localeCompare(b.title);
      case 'alphabetical-z-a':
        return b.title.localeCompare(a.title);
      case 'relevance':
        return a.id - b.id;
      case 'new':
        return b.manufactureDate - a.manufactureDate;
      case 'old':
        return a.manufactureDate - b.manufactureDate;
      case 'low':
        return a.price - b.price;
      case 'high':
        return b.price - a.price;
      default:
        return 0;
    }
  });
  
  displayProducts();
})
}
sortProducts()

const filterByPrice = ()=>{

  const minValue = parseFloat(document.getElementById('min').value)
  const maxValue = parseFloat(document.getElementById('max').value)

  let filtredProducts = products.filter(product => product.price>=minValue && product.price<=maxValue)

  let searchedProducts =""

  filtredProducts.forEach((product)=>{
    searchedProducts += showDesiredproducts(product)
  })

document.getElementById("product-list").innerHTML = searchedProducts; 

}

// add a product to wishlist
function addToWishlist(productId) {

  if(users==[] || users == null || users.length < 1){
    alert('Please Login First')
    return
  }

  let user = users.find(user => user.isLoggedIn == true);

  if(!user){
    alert('Please Login First')
    return
  }
  
  const alreadyInWishList = user.wishList.find((item) => item.id === productId);

  if (alreadyInWishList) {
    alert('Product Already In WishList !')
    return
  }else {

    const product = products.find((item) => item.id === productId);
    user.wishList.push(product)
    console.log(product)
  
    localStorage.setItem("users", JSON.stringify(users))

    favorite.textContent = `${user.wishList.length}`

    alert('Product Successfully Added To WishList !')

  }
  
}

displayProducts()


