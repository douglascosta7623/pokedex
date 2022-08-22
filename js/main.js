const getElement = (...queries) => document.querySelector(...queries);

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

//Consumindo API

const areaPokemons = document.getElementById("js-list-pokemon");

function upperName(stringName) {
  return stringName[0].toUpperCase() + stringName.substring(1);
}

function createCardPokemon(code, type, nome, imagePokemon) {
  let card = document.createElement("button");
  card.classList = `card__pokedex ${type} js-open-details-pokemon`;

  areaPokemons.appendChild(card);
  let image = document.createElement("div");
  image.classList = "image__pokedex";
  card.appendChild(image);

  let imageSrc = document.createElement("img");
  imageSrc.classList = "thumb-img";
  imageSrc.setAttribute("src", imagePokemon);
  image.appendChild(imageSrc);

  let infoCardPokemon = document.createElement("div");
  infoCardPokemon.classList = "info__pokedex";

  card.appendChild(infoCardPokemon);

  let infoCardPokemonText = document.createElement("div");
  infoCardPokemonText.classList = "info__text";

  infoCardPokemon.appendChild(infoCardPokemonText);
  let idPokemon = document.createElement("span");

  idPokemon.textContent =
    code < 10 ? `#00${code}` : code < 100 ? `#0${code}` : `#${code}`;

  infoCardPokemonText.appendChild(idPokemon);

  let namePokemon = document.createElement("h3");
  namePokemon.textContent = upperName(nome);

  infoCardPokemonText.appendChild(namePokemon);

  let infoCardPokemonIcon = document.createElement("div");
  infoCardPokemonIcon.classList = "info__icon";
  infoCardPokemon.appendChild(infoCardPokemonIcon);

  let imageIconPokemon = document.createElement("img");
  imageIconPokemon.setAttribute("src", `/assets/icon-types/${type}.svg`);

  infoCardPokemonIcon.appendChild(imageIconPokemon);
}

function listPokemons(urlApi) {
  axios({
    method: "GET",
    url: urlApi,
  }).then((response) => {
    const countPokemon = document.getElementById("quantity-pokemon");
    const { results, next, count } = response.data;
    countPokemon.innerText = count;

    results.forEach((pokemon) => {
      let urlApiDetails = pokemon.url;

      axios({
        method: "GET",
        url: `${urlApiDetails}`,
      }).then((response) => {
        const { name, id, sprites, types } = response.data;
        const infoCard = {
          nome: name,
          code: id,
          image: sprites.other.dream_world.front_default,
          type: types[0].type.name,
        };

        createCardPokemon(
          infoCard.code,
          infoCard.type,
          infoCard.nome,
          infoCard.image
        );

        const buttonDetails = document.querySelectorAll(".card__pokedex");

        buttonDetails.forEach((card) => {
          card.addEventListener("click", openModal);
        });
      });
    });
  });
}

listPokemons("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0");

const openModal = () => container.classList.add(activeModalClass);
const closeModal = () => container.classList.remove(activeModalClass);

const container = getElement(".modal");
const modal = getElement(".modal__box");
const buttonClose = getElement(".modal__btn-close");

const activeModalClass = "modal__show";

buttonClose.addEventListener("click", closeModal);
container.addEventListener("click", (event) => {
  if (modal.contains(event.target)) return;

  closeModal();
});

const areaTypes = document.getElementById("js-type-area");
const areaTypesMobile = document.getElementById("js-drop-select");

axios({
  method: "GET",
  url: "https://pokeapi.co/api/v2/type",
}).then((response) => {
  const { results } = response.data;
  // console.log(results);
  results.forEach((type, index) => {
    if (index < 18) {
      let itemList = document.createElement("li");
      areaTypes.appendChild(itemList);

      let buttonItemList = document.createElement("button");
      buttonItemList.classList = `filter ${type.name}`;
      itemList.appendChild(buttonItemList);

      let iconFilter = document.createElement("div");
      iconFilter.classList = "filter__icon";
      buttonItemList.appendChild(iconFilter);

      let iconImageFilter = document.createElement("img");
      iconImageFilter.setAttribute(
        "src",
        `./assets/icon-types/${type.name}.svg`
      );
      iconFilter.appendChild(iconImageFilter);

      let filterLegend = document.createElement("span");
      filterLegend.classList = "filter__name";
      filterLegend.textContent = upperName(type.name);
      buttonItemList.appendChild(filterLegend);

      //Mobile

      let itemListMobile = document.createElement("li");
      areaTypesMobile.appendChild(itemListMobile);

      let buttonItemListMobile = document.createElement("button");
      buttonItemListMobile.classList = `filter ${type.name}`;
      itemListMobile.appendChild(buttonItemListMobile);

      let iconFilterMobile = document.createElement("div");
      iconFilterMobile.classList = "filter__icon";
      buttonItemListMobile.appendChild(iconFilterMobile);

      let iconImageFilterMobile = document.createElement("img");
      iconImageFilterMobile.setAttribute(
        "src",
        `./assets/icon-types/${type.name}.svg`
      );
      iconFilterMobile.appendChild(iconImageFilterMobile);

      let filterLegendMobile = document.createElement("span");
      filterLegendMobile.classList = "filter__name";
      filterLegendMobile.textContent = upperName(type.name);
      buttonItemListMobile.appendChild(filterLegendMobile);
    }
  });
});

//LoadMore
const loadBtn = document.getElementById("js-loadmore");
let countPagination = 9;

function showMorePokemon() {
  listPokemons(
    `https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPagination}`
  );
  console.log((countPagination += 9));
}

loadBtn.addEventListener("click", showMorePokemon);
