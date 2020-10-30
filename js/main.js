
'use strict';
// DAY 1

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector (".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');


let login = localStorage.getItem('gloDelivery');

const cart = [];

const getData = async function(url){
  const response = await fetch(url);
  if (!response.ok){
    throw new Error(`Ошибка по адресу ${url}, 
      статус ошибка ${response.status}!`)//сбрасывает выполнение функции и создает ошибку
  } //${} - интерполяция - вставка кода внутри строки
  return await response.json();
};

getData('./db/partners.json');


console.log(login);

function toggleModal(){
  modal.classList.toggle("is-open");
}

//console.dir(modalAuth);  Эта функция выведет modalAuth в виде объекта

function toogleModalAuth() {
  modalAuth.classList.toggle('is-open');
}

function autorized(){

  function logOut(){
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  console.log('Авторизован');

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut)
};

function notAutorized(){
  console.log('Не авторизован');

  function logIn(event){
    event.preventDefault(); //метод preventDefault если имеет значение тру - отменяет стандартные действия браузера для event (события)
    login = loginInput.value;
    localStorage.setItem('gloDelivery', login);
    toogleModalAuth();
    buttonAuth.removeEventListener('click', toogleModalAuth);
    closeAuth.removeEventListener('click', toogleModalAuth);
    logInForm.removeEventListener('submit', logIn)
    logInForm.reset();
    checkAuth();
  }

  buttonAuth.addEventListener('click', toogleModalAuth);
  closeAuth.addEventListener('click', toogleModalAuth);
  logInForm.addEventListener('submit', logIn)  //submit - отправка данных

};

function checkAuth(){
  if(login){
    autorized();
  }else{
    notAutorized();    
    toogleModalAuth();
    alert("Не авторизован")
    
  }
};



function createCardRestaurant(restaurant){

  console.log(restaurant);

  const { 
    image, 
    kitchen, 
    name, 
    price, 
    stars, 
    products, 
    time_of_delivery: timeOfDelivery } = restaurant;


  const card = `
                                    <a class="card card-restaurant wow animate__animated animate__fadeInUp" data-products="${products}" >
                                        <img src="${image}" alt="image" class="card-image">
                                        <div class="card-text">
                                            <div class="card-heading">
                                                <h3 class="card-title">${name}</h3>
                                                <span class="card-tag.tag">${timeOfDelivery}</span>
                                            </div>
                                            <div class="card-info">
                                                <div class="rating">
                                                    ${timeOfDelivery}
                                                </div>
                                                <div class="price">${price}</div>
                                                <div class="category">${kitchen}</div>
                                            </div>                            
                                        </div>
                                    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card); // вставляет в DOM дерево проанализорванный код


}


function createCardHeader({ id, stars, kitchen, name, price }){
  
  

  const cardHeader = document.createElement('div');
  cardHeader.className = 'cardHeader';
  cardHeader.insertAdjacentHTML('beforebegin', `            
              <h2 class="section-title restaurant-title">${name}</h2>
              <div class="card-info">
                <div class="rating">
                  ${stars}
                </div>
                <div class="price">От ${price} ₽</div>
                <div class="category">${kitchen}</div>
              </div>
  `);


  
  cardsMenu.insertAdjacentElement('beforeend', card);
}




function createCardGood({ description, id, stars, kitchen, image, name, price }){
  
  

  const card = document.createElement('div');
  //const cardHeader = document.createElement('div');
  card.className = 'card';
 
  // cardHeader.className = 'cardHeader';
  // cardHeader.insertAdjacentHTML('beforebegin', `            
  //             <h2 class="section-title restaurant-title">${name}</h2>
  //             <div class="card-info">
  //               <div class="rating">
  //                 ${stars}
  //               </div>
  //               <div class="price">От ${price} ₽</div>
  //               <div class="category">${kitchen}</div>
  //             </div>
  // `);


  card.insertAdjacentHTML('beforeend', `  
						<img src="${image}" alt="image" class="card-image" />
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<!-- /.card-heading -->
							<div class="card-info">
								<div class="ingredients">${description}</div>
							</div>
							<!-- /.card-info -->
							<div class="card-buttons">
								<button class="button button-primary button-add-cart" id="${id}">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price card-price-bold">${price} ₽</strong>
							</div>
						</div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event){
  console.log(event); //показывает в консоли какое событие и ег освойства были произведены
  const target = event.target;

  const restaurant = target.closest('.card-restaurant'); //метод .closest поднимается выше по родительским элементам пока не найдет по селектору в скобочках
  
  if(login){
    if (restaurant){

      console.log(restaurant);

      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      getData(`./db/${restaurant.dataset.products}`).then(function(data){
        data.forEach(createCardGood);
      });
    }
  }else{
    toogleModalAuth();
  }
}

function addToCart(event){
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if(buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function(item){
      return item.id === id;
    })
    if (food) {
      food.count = food.count +1; 
    }else{
      cart.push({
        id,
        title,
        cost,
        count: 1
    });
    }


    console.log(food);

    cart.push({
      id: id,
      title: title,
      cost: cost,
      count: 1
    })
    console.log(title, cost, id);
  }


  console.log(target);



function init(){
    getData('./db/partners.json').then(function(data){
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener('click', toggleModal);

  cardsMenu.addEventListener('click', addToCart);

  close.addEventListener('click', toggleModal);

  /**Еще один вариант решения открытия - закрытия модального окна


  cartButton.addEventListener('click', function(event){
    modal.classList.add("is-open");
  })

  close.addEventListener('click', function (event) {
    modal.classList.remove("is-open");
  })
  }**/

  cardsRestaurants.addEventListener('click', checked);

function checked(){
    if (login){
      openGoods(event)
    }else{
      toogleModalAuth()
    }
  }
  logo.addEventListener('click', function(){
    containerPromo.classList.remove('hide')
      restaurants.classList.remove('hide')
      menu.classList.add('hide')
  })


  checkAuth();

  new Swiper('.swiper-container', {
    loop:true,
    sliderPerView:1,
    //autoplay: true
  });
}


init();
new WOW().init();
