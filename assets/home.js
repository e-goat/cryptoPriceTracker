window.addEventListener("load", () => {
    "use strict";

    //======================//
    // * HOME PAGE EVENTS * //
    //======================//
    const roidCatImg  = document.getElementsByClassName('roid-cat-img')[0],
        homePageBtn   = document.querySelector('.home-page'),
        myRepo        = 'https://github.com/e-goat/jquery-gecko-api',
        homePageTitle = document.getElementsByClassName('home-page-title')[0];

    homePageBtn.click();
    // DEFAULT UPPER CASE SET TO THE PAGE TITLE
    homePageTitle.textContent = homePageTitle.textContent.toLocaleUpperCase();

    homePageBtn.addEventListener("click", (event) => {
        document.querySelector(".coins-list").style.display = "none";
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".home-page-wrapper").style.display = "block";
    });

    roidCatImg.addEventListener('click', () => {
        return window.open(myRepo);
    });

});