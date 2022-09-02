const getElement = (...queries) => document.querySelector(...queries);

let slide_hero = new Swiper('.slide__hero', {
  effect: 'fade',
  pagination: {
    el: '.slide__hero .main-area .slide__hero__explorer .swiper-pagination',
  },
});

const btnSelectCustom = getElement('.js-open-select-pokemon');

btnSelectCustom.addEventListener('click', () => {
  btnSelectCustom.parentElement.classList.toggle('active');
});

//Consumindo API

const areaPokemons = document.getElementById('js-list-pokemon');

function upperName(stringName) {
  return stringName[0].toUpperCase() + stringName.substring(1);
}

function createCardPokemon(code, type, nome, imagePokemon) {
  let card = document.createElement('button');
  card.classList = `card__pokedex ${type} js-open-details-pokemon`;
  card.setAttribute('code-pokemon', code);

  areaPokemons.appendChild(card);
  let image = document.createElement('div');
  image.classList = 'image__pokedex';
  card.appendChild(image);

  let imageSrc = document.createElement('img');
  imageSrc.classList = 'thumb-img';
  imageSrc.setAttribute('src', imagePokemon);
  image.appendChild(imageSrc);

  let infoCardPokemon = document.createElement('div');
  infoCardPokemon.classList = 'info__pokedex';

  card.appendChild(infoCardPokemon);

  let infoCardPokemonText = document.createElement('div');
  infoCardPokemonText.classList = 'info__text';

  infoCardPokemon.appendChild(infoCardPokemonText);
  let idPokemon = document.createElement('span');
  idPokemon.classList = 'id__pokemon';

  idPokemon.textContent =
    code < 10 ? `#00${code}` : code < 100 ? `#0${code}` : `#${code}`;

  infoCardPokemonText.appendChild(idPokemon);

  let namePokemon = document.createElement('h3');
  namePokemon.classList = 'name__pokemon';
  namePokemon.textContent = upperName(nome);

  infoCardPokemonText.appendChild(namePokemon);

  let infoCardPokemonIcon = document.createElement('div');
  infoCardPokemonIcon.classList = 'info__icon';
  infoCardPokemon.appendChild(infoCardPokemonIcon);

  let imageIconPokemon = document.createElement('img');
  imageIconPokemon.classList = 'info__icon__image';
  imageIconPokemon.setAttribute('src', `/assets/icon-types/${type}.svg`);

  infoCardPokemonIcon.appendChild(imageIconPokemon);
}

function listPokemons(urlApi) {
  axios({
    method: 'GET',
    url: urlApi,
  }).then((response) => {
    const countPokemon = document.getElementById('quantity-pokemon');
    const { results, next, count } = response.data;
    countPokemon.innerText = count;

    results.forEach((pokemon) => {
      let urlApiDetails = pokemon.url;

      axios({
        method: 'GET',
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

        const buttonDetails = document.querySelectorAll('.card__pokedex');

        buttonDetails.forEach((card) => {
          card.addEventListener('click', openModal);
        });
      });
    });
  });
}

listPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');

function openModal() {
  container.classList.add(activeModalClass);

  let codePokemonDetails = this.getAttribute('code-pokemon');

  let imagePokemon = this.querySelector('.thumb-img');
  const imageDetailsPokemon = document.getElementById(
    'js-image-pokemon-details'
  );

  imageDetailsPokemon.src = imagePokemon.src;

  let iconPokemon = this.querySelector('.info__icon__image');
  const iconPokemonModal = document.getElementById('js-icon-pokemon-details');

  iconPokemonModal.src = iconPokemon.src;

  let namePokemon = this.querySelector('.name__pokemon');
  const namePokemonModal = document.getElementById('js-modal-namePokemon');
  namePokemonModal.textContent = namePokemon.textContent;

  let codePokemon = this.querySelector('.id__pokemon');
  const codePokemonModal = document.getElementById('js-modal-idPokemon');
  codePokemonModal.textContent = codePokemon.textContent;

  const modalDetails = document.getElementById('js-modal-details');

  modalDetails.setAttribute('typemodal', this.classList[1]);

  axios({
    method: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon/${codePokemonDetails}`,
  }).then((response) => {
    let data = response.data;
    console.log(data);
    let infoPokemon = {
      mainAbilitie: upperName(data.abilities[0].ability.name),
      abilities: data.abilities,
      typesPokemon: data.types,
      heightPokemon: data.height,
      weightPokemon: data.weight,
      stats: data.stats,
      urlType: data.types[0].type.url,
    };

    function listingTypesPokemon() {
      const areaTypesModal = document.getElementById('js-modal-types');
      areaTypesModal.innerHTML = '';

      let arrayTypes = infoPokemon.typesPokemon;

      arrayTypes.forEach((itemType) => {
        let listItemType = document.createElement('li');
        areaTypesModal.appendChild(listItemType);

        let listNameType = document.createElement('span');
        listNameType.className = `tag-type ${itemType.type.name}`;
        listNameType.textContent = itemType.type.name;
        console.log(listNameType);
        listItemType.appendChild(listNameType);
      });

      let heightPokemonContent = document.getElementById('js-strong-height');
      heightPokemonContent.innerHTML = `${infoPokemon.heightPokemon / 10} m`;

      let weightPokemonContent = document.getElementById('js-strong-weight');
      weightPokemonContent.innerHTML = `${infoPokemon.weightPokemon / 10} kg`;

      let abilitiePokemonContent = document.getElementById(
        'js-strong-abilities'
      );

      abilitiePokemonContent.textContent = upperName(infoPokemon.mainAbilitie);
    }

    function listingWeaknesses() {
      const areaWeaknesses = document.getElementById('js-weaknesses-pokemon');
      areaWeaknesses.innerHTML = '';
      axios({
        method: 'GET',
        url: `${infoPokemon.urlType}`,
      }).then((response) => {
        weaknesses = response.data.damage_relations.double_damage_from;
        weaknesses.forEach((weaknessesType) => {
          let listItemWeak = document.createElement('li');
          areaWeaknesses.appendChild(listItemWeak);

          let listNameWeak = document.createElement('span');
          listNameWeak.className = `tag-type ${weaknessesType.name}`;
          listNameWeak.textContent = upperName(weaknessesType.name);

          listItemWeak.appendChild(listNameWeak);
        });
      });
    }
    console.log(infoPokemon.stats);

    const hpStats = document.getElementById('js-stats-hp');
    const attackStats = document.getElementById('js-stats-attack');
    const defenseStats = document.getElementById('js-stats-defense');
    const spAttackStats = document.getElementById('js-stats-sp_attack');
    const spDefenseStats = document.getElementById('js-stats-sp_defense');
    const speedStats = document.getElementById('js-stats-speed');

    function statsVerication(statsValidations) {
      if (statsValidations > 100) {
        return 100;
      }
      return statsValidations;
    }

    hpStats.style.width = `${statsVerication(infoPokemon.stats[0].base_stat)}%`;
    attackStats.style.width = `${statsVerication(
      infoPokemon.stats[1].base_stat
    )}%`;
    defenseStats.style.width = `${statsVerication(
      infoPokemon.stats[2].base_stat
    )}%`;
    spAttackStats.style.width = `${statsVerication(
      infoPokemon.stats[3].base_stat
    )}%`;
    spDefenseStats.style.width = `${statsVerication(
      infoPokemon.stats[4].base_stat
    )}%`;
    speedStats.style.width = `${statsVerication(
      infoPokemon.stats[5].base_stat
    )}%`;

    listingWeaknesses();

    listingTypesPokemon();
  });
}

function closeModal() {
  container.classList.remove(activeModalClass);
}

const container = getElement('.modal');
const modal = getElement('.modal__box');
const buttonClose = getElement('.modal__btn-close');

const activeModalClass = 'modal__show';

buttonClose.addEventListener('click', closeModal);
container.addEventListener('click', (event) => {
  if (modal.contains(event.target)) return;

  closeModal();
});

function openDetailsModal() {}

const areaTypes = document.getElementById('js-type-area');
const areaTypesMobile = document.getElementById('js-drop-select');

axios({
  method: 'GET',
  url: 'https://pokeapi.co/api/v2/type',
}).then((response) => {
  const { results } = response.data;
  // console.log(results);
  results.forEach((type, index) => {
    if (index < 18) {
      let itemList = document.createElement('li');
      areaTypes.appendChild(itemList);

      let buttonItemList = document.createElement('button');
      buttonItemList.classList = `filter ${type.name}`;
      buttonItemList.setAttribute('code-type', index + 1);

      itemList.appendChild(buttonItemList);

      let iconFilter = document.createElement('div');
      iconFilter.classList = 'filter__icon';
      buttonItemList.appendChild(iconFilter);

      let iconImageFilter = document.createElement('img');
      iconImageFilter.setAttribute(
        'src',
        `./assets/icon-types/${type.name}.svg`
      );
      iconFilter.appendChild(iconImageFilter);

      let filterLegend = document.createElement('span');
      filterLegend.classList = 'filter__name';
      filterLegend.textContent = upperName(type.name);
      buttonItemList.appendChild(filterLegend);

      //Mobile

      let itemListMobile = document.createElement('li');
      areaTypesMobile.appendChild(itemListMobile);

      let buttonItemListMobile = document.createElement('button');
      buttonItemListMobile.classList = `filter ${type.name}`;
      buttonItemListMobile.setAttribute('code-type', index + 1);
      itemListMobile.appendChild(buttonItemListMobile);

      let iconFilterMobile = document.createElement('div');
      iconFilterMobile.classList = 'filter__icon';
      buttonItemListMobile.appendChild(iconFilterMobile);

      let iconImageFilterMobile = document.createElement('img');
      iconImageFilterMobile.setAttribute(
        'src',
        `./assets/icon-types/${type.name}.svg`
      );
      iconFilterMobile.appendChild(iconImageFilterMobile);

      let filterLegendMobile = document.createElement('span');
      filterLegendMobile.classList = 'filter__name';
      filterLegendMobile.textContent = upperName(type.name);
      buttonItemListMobile.appendChild(filterLegendMobile);
      const allTypes = document.querySelectorAll('.filter');

      allTypes.forEach((type) => {
        type.addEventListener('click', filterByTypes);
      });
    }
  });
});

//LoadMore
const loadBtn = document.getElementById('js-loadmore');
let countPagination = 9;

function showMorePokemon() {
  listPokemons(
    `https://pokeapi.co/api/v2/pokemon?limit=9&offset=${countPagination}`
  );
  console.log((countPagination += 9));
}

loadBtn.addEventListener('click', showMorePokemon);

//filtrar por tipo

function filterByTypes() {
  let codTypePokemon = this.getAttribute('code-type');
  const areaPokemons = document.getElementById('js-list-pokemon');
  const btnLoadMore = document.getElementById('js-loadmore');
  const allTypesFilter = document.querySelectorAll('.filter');
  const countPokemonFilter = document.getElementById('quantity-pokemon');

  areaPokemons.innerHTML = '';
  btnLoadMore.style.display = 'none';

  const sectionPokemons = document.querySelector('.info__all');
  const topSectionPokemons = sectionPokemons.offsetTop;
  window.scrollTo({
    top: topSectionPokemons + 260,
    behavior: 'smooth',
  });

  allTypesFilter.forEach((type) => {
    type.classList.remove('active');
  });

  this.classList.add('active');

  if (codTypePokemon) {
    axios({
      method: 'GET',
      url: `https://pokeapi.co/api/v2/type/${codTypePokemon}`,
    }).then((response) => {
      const { pokemon } = response.data;
      countPokemonFilter.textContent = pokemon.length;

      pokemon.forEach((pok) => {
        const { url } = pok.pokemon;
        axios({
          method: 'GET',
          url: `${url}`,
        }).then((response) => {
          const { name, id, sprites, types } = response.data;
          const infoCard = {
            nome: name,
            code: id,
            image: sprites.other.dream_world.front_default,
            type: types[0].type.name,
          };

          if (infoCard.image != null) {
            createCardPokemon(
              infoCard.code,
              infoCard.type,
              infoCard.nome,
              infoCard.image
            );
          }

          const buttonDetails = document.querySelectorAll('.card__pokedex');

          buttonDetails.forEach((card) => {
            card.addEventListener('click', openModal);
          });
        });
      });
    });
  } else {
    areaPokemons.innerHTML = '';
    listPokemons('https://pokeapi.co/api/v2/pokemon?limit=9&offset=0');
    btnLoadMore.style.display = 'block';
  }
}

const inputSearch = document.getElementById('js-input-search');
const btnSearch = document.getElementById('js-btn-search');
btnSearch.addEventListener('click', searchPokemon);
inputSearch.addEventListener('keyup', (event) => {
  if (event.code === 'Enter') {
    searchPokemon();
  }
});

function searchPokemon() {
  let valueInput = inputSearch.value.toLowerCase();
  const typeFilter = document.querySelectorAll('.filter');
  typeFilter.forEach((type) => {
    type.classList.remove('active');
  });

  axios({
    method: 'GET',
    url: `https://pokeapi.co/api/v2/pokemon/${valueInput}`,
  })
    .then((response) => {
      areaPokemons.innerHTML = '';
      loadBtn.style.display = 'none';
      const countPokemonSearch = document.getElementById('quantity-pokemon');
      countPokemonSearch.textContent = 1;
      const { name, id, sprites, types } = response.data;
      const infoCard = {
        nome: name,
        code: id,
        image: sprites.other.dream_world.front_default,
        type: types[0].type.name,
      };

      if (infoCard.image != null) {
        createCardPokemon(
          infoCard.code,
          infoCard.type,
          infoCard.nome,
          infoCard.image
        );
      }

      const buttonDetails = document.querySelectorAll('.card__pokedex');

      buttonDetails.forEach((card) => {
        card.addEventListener('click', openModal);
      });
    })
    .catch((error) => {
      if (error.response) {
        const countPokemonSearch = document.getElementById('quantity-pokemon');
        countPokemonSearch.textContent = 0;
        areaPokemons.innerHTML = '';
        loadBtn.style.display = 'none';

        alert('Não encontramos nenhum resultado para esse Pokemon.');
      }
    });
}

//card de info por pokemon
