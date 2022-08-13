const getElement = (...queries) => document.querySelector(...queries);

const buttonDetails = document.querySelectorAll(".card__pokedex");

const openModal = () => container.classList.add(activeModalClass);
const closeModal = () => container.classList.remove(activeModalClass);

buttonDetails.forEach((card) => {
  card.addEventListener("click", openModal);
});

const container = getElement(".modal");
const modal = getElement(".modal__box");
const buttonClose = getElement(".modal__btn-close");

const activeModalClass = "modal__show";

buttonClose.addEventListener("click", closeModal);
container.addEventListener("click", (event) => {
  if (modal.contains(event.target)) return;

  closeModal();
});
let slide_hero = new Swiper(".slide__hero", {
  effect: "fade",
  pagination: {
    el: ".slide__hero .main-area .slide__hero__explorer .swiper-pagination",
  },
});

const btnSelectCustom = getElement(".js-open-select-pokemon");

btnSelectCustom.addEventListener("click", () => {
  btnSelectCustom.parentElement.classList.toggle("active");
});
