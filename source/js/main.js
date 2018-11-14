"use strict";

(function () {
  const links = document.querySelectorAll(".hero__menu-link");

  links.forEach(link => {
    link.addEventListener("click", evt => {
      evt.preventDefault();

      const id = evt.target.href.split("/").pop();
      const scrollToElement = document.querySelector(id);

      console.log(scrollToElement);
      scrollIt(scrollToElement);
    });
  });


  const utils = window.fizzyUIUtils;
  const sliderEl = document.querySelector(".hero__slider");
  const sliderHero = new Flickity(sliderEl, {
    contain: true,
    wrapAround: true,
    initialIndex: 1,
    pageDots: false,
    prevNextButtons: false,
  });

  let cellsButtonGroup = document.querySelector(".hero__controls");
  let cellsButtons = utils.makeArray(cellsButtonGroup.children);

  sliderHero.on("select", function () {
    let previousSelectedButton = cellsButtonGroup.querySelector(".hero__slider-control--current");
    let selectedButton = cellsButtonGroup.children[sliderHero.selectedIndex];
    previousSelectedButton.classList.remove("hero__slider-control--current");
    selectedButton.classList.add("hero__slider-control--current");
  });

  cellsButtonGroup.addEventListener("click", function (event) {
    if (!matchesSelector(event.target, ".hero__slider-control")) {
      return;
    }
    let index = cellsButtons.indexOf(event.target);
    sliderHero.select(index);
  });

  //replace image
  let btnPrev = document.querySelector(".similar__control--prev");
  let btnNext = document.querySelector(".similar__control--next");
  let similarContainer = document.querySelector(".similar");
  let similarEl = new Hammer(similarContainer);

  let showNextImage = evt => {
    evt.preventDefault();
    let imagesContainers = similarContainer.querySelectorAll(".similar__image-wrapper");
    let images = [];

    imagesContainers.forEach(imageEl => {
      let pictureEl = imageEl.children[0];
      images.push(pictureEl);
      pictureEl.remove();
    });

    let firstEl = images.shift();
    images = [...images, firstEl];

    imagesContainers.forEach((imageEl, index) => {
      imageEl.appendChild(images[index]);
    });
  };
  let showPreImage = evt => {
    evt.preventDefault();
    let imagesContainers = similarContainer.querySelectorAll(".similar__image-wrapper");
    let images = [];

    imagesContainers.forEach(imageEl => {
      let pictureEl = imageEl.children[0];
      images.push(pictureEl);
      pictureEl.remove();
    });

    let lastEl = images.pop();
    images = [lastEl, ...images,];

    imagesContainers.forEach((imageEl, index) => {
      imageEl.appendChild(images[index]);
    });
  };

  //panright
  btnPrev.addEventListener("click", showPreImage);
  similarEl.on("swiperight", showPreImage);

  //panleft
  btnNext.addEventListener("click", showNextImage);
  similarEl.on("swipeleft", showNextImage);
})();
