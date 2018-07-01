function displayMoney() {
   let money = document.getElementById('money');
   money.innerHTML = "&#xf154;"

   setTimeout(()=> {
       money.innerHTML = "&#xf155;"
   }, 1000);

   setTimeout(()=> {
        money.innerHTML = "&#xf156;"
    }, 2000);

    setTimeout(()=> {
        money.innerHTML = "&#xf157;"
    }, 3000);

    setTimeout(()=> {
        money.innerHTML = "&#xf153;"
    }, 4000);

    setTimeout(()=> {
        money.innerHTML = "&#xf158;"
    }, 5000);


    setTimeout(()=> {
        money.innerHTML = "&#xf15a;"
    }, 6000);

    setTimeout(()=> {
        money.innerHTML = "&#xf159;"
    }, 6000);
}

displayMoney();

setInterval(displayMoney, 2000);