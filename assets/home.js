window.addEventListener("load", () => {
    "strict mode";

    //======================//
    // * HOME PAGE EVENTS * //
    //======================//
    const homePageBtn = document.querySelector('.home-page');
    homePageBtn.click();
    homePageBtn.addEventListener("click", (event) => {
        document.querySelector(".coins-list").style.display = "none";
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".home-page-wrapper").style.display = "block";
    });
});