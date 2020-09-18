let cart = [];
let modalQt = 1;
let modalKey = 0;

/*(dqs)=> mesmo que function*/
const qs = (dqs) => document.querySelector(dqs);
const qss = (dqs) => document.querySelectorAll(dqs);

//Listagem das Pizzas
pizzaJson.map(function(item, index) {
    //clonar uma estrutura html
    let pizzaItem = qs('.models .pizza-item').cloneNode(true); // pega cada parte redondinha das pizas e clona
    
    pizzaItem.setAttribute('data-key', index); // insere em cada parte redondinha os dados de seu index
    // inserir informações na pizza 
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.desc;
    
    // clica no item e abre modal
    pizzaItem.querySelector('a').addEventListener('click', (evento)=>{
        evento.preventDefault();// nao REcarrega a pagina ao clicar em link
        let key = evento.target.closest('.pizza-item').getAttribute('data-key'); // procura o elemento mais proximo pizza-item
        modalQt = 1;
        modalKey = key;

        // preencher modal com as informações
        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].desc;
        qs('.pizzaInfo--actualPrice').innerHTML =  `R$ ${pizzaJson[key].price.toFixed(2)}`;// formatar campo Dinheiro
       
       qs('.pizzaInfo--size.selected').classList.remove('selected');
       qss('.pizzaInfo--size').forEach((size, sizeIndex)=>{    
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        qs(".pizzaInfo--qt").innerHTML = modalQt;

        //Abre modal com animação de opacidade css + js
        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';// abre a modal do item
        setTimeout(()=> {
            qs('.pizzaWindowArea').style.opacity = 1;
        },200);
    });

    //Pega um elemento html e joga na tela
    qs('.pizza-area').append(pizzaItem); // adicionar mais itens onde ja existe
});

// Eventos do Modal

function closeModal(){
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() =>{
        qs('.pizzaWindowArea').style.display = 'none';
    },500);
};

// faz botões cancelar e voltar chamarem a função closeModal();
qss(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item) => {
    item.addEventListener("click", closeModal);
});

// adicionar evento nos botões de quantidade
qs('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt >= 1){
        modalQt--;
        qs(".pizzaInfo--qt").innerHTML = modalQt;
    }
});

qs(".pizzaInfo--qtmais").addEventListener('click', () => {
    modalQt++;
    qs(".pizzaInfo--qt").innerHTML = modalQt;
});

// Adicionar funcionalidade nos botões de quantidade
qss('.pizzaInfo--size').forEach((size, sizeIndex)=>{    
    size.addEventListener('click', (evento)=>{
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// Adicionar Itens selecionado ao carrinho
qs('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(qs(".pizzaInfo--size.selected").getAttribute("data-key"));
    let id = `${pizzaJson[modalKey].id}@${size}`;
    let key = cart.findIndex((item) => item.idCode == id);
    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            idCode: id,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        })
    }
    closeModal();
    updateCart();
});

//atualizar carrinho
function updateCart(){
    if (cart.length > 0) {   // caso tenha itens no carrinho ele é mostrado
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';
        let subTotal = 0;
        let total = 0;
        let desconto = 0;
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);
            subTotal += pizzaItem.price * cart[i].qt;
            let cartItem =  qs('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'Peq.';
                    break;
                
                case 1:
                    pizzaSizeName = 'Méd.'
                    break;
                
                case 2:
                    pizzaSizeName = 'Gran.'
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;

                } else {
                    cart.splice(i, 1)
                }
                updateCart();
            });
            
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click", () => {
                cart[i].qt++;
                updateCart();
            });

            qs('.cart').append(cartItem);
        }

        desconto = subTotal * 0.1;
        total = subTotal - desconto;
        qs('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        
    } else { // se não tiver itens o carrinho não fica na tela
        qs('aside').classList.remove('show');
        qs("aside").style.left = "100vw";
    }
}

// -----------------PRÓXIMO DESAFIO É CRIAR UMA PÁGINA DE PEDIDO FINALIZADO -------------------------------

qs(".cart--finalizar").addEventListener('click', () => {
    for(let i in cart){
        let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);
        let subTotal = 0;
        let total = 0;
        let desconto = 0;
        subTotal += pizzaItem.price * cart[i].qt;
        desconto = subTotal * 0.1;
        total = subTotal - desconto;
        qs('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        alert('Calma, to desenvolvendo isso! \n Mas o que tu deve para o restaurante por iss é: \n R$: ' + total.toFixed(2) +' Reais.');
        }
    });

