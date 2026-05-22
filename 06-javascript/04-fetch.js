const pokemonColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#ea7ce8",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const createNewElement = function (data) {
  const { name: pokemonName, types } = data;
  const { front_default: pokemonImage } =
    data.sprites.other["official-artwork"];

  const pokemonTypesArr = types.map((item) => item.type.name);

  const card = document.createElement("div");
  const h2 = document.createElement("h2");
  const img = document.createElement("img");
  const typesDiv = document.createElement("div");

  h2.textContent = pokemonName;
  img.src = pokemonImage;
  img.alt = `image of ${pokemonName}`;
  img.width = "240";
  img.height = "240";

  card.setAttribute("class", "pokemonCard");

  card.append(h2);
  card.append(img);

  pokemonTypesArr.map((item) => {
    const span = document.createElement("span");
    span.textContent = item;
    span.style.backgroundColor = pokemonColors[item];
    span.setAttribute("class", "pokemonType");
    typesDiv.append(span);
  });

  card.append(typesDiv);

  return card;
};

const fetchData = async function () {
  const url = "https://pokeapi.co/api/v2/pokemon/bulbasaur";

  const pokeList = document.querySelector(".poke-list");

  try {
    const response = await fetch(url);
    const bodyData = await response.json();

    console.log(bodyData);
    const elem = createNewElement(bodyData);
    pokeList.append(elem);
  } catch (error) {
    console.error("Error fetch data form the PokeAPI", error);
    const errorElement = document.createElement("p");
    errorElement.textContent("Error fetch data from the PokeAPI");
    errorElement.setAttribute("class", "errorMessage");
    pokeList.append(errorElement);
  } finally {
    console.log("executes either way");
    const loading = document.querySelector(".loading-container");
    loading.setAttribute("class", "display-none");
  }
};

const fetchDataAll = async function () {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=25&offset=0";

  const pokeList = document.querySelector(".poke-list");

  try {
    const response = await fetch(url);
    const bodyData = await response.json();

    const pokemonList = bodyData.results;

    console.log(bodyData.results);
    const promises = pokemonList.map((pokemon) => {
      return fetch(pokemon.url)
        .then((res) => res.json())
        .catch((error) => console.error("an error occurred"));
    });

    const pokemonData = await Promise.all(promises);

    console.log(pokemonData);
    pokemonData.forEach((pokemon) => {
      const elem = createNewElement(pokemon);
      pokeList.append(elem);
    });
  } catch (error) {
    console.error("Error fetch data form the PokeAPI", error);
    const errorElement = document.createElement("p");
    errorElement.textContent("Error fetch data from the PokeAPI");
    errorElement.setAttribute("class", "errorMessage");
    pokeList.append(errorElement);
  } finally {
    console.log("executes either way");
    const loading = document.querySelector(".loading-container");
    loading.setAttribute("class", "display-none");
  }
};

fetchDataAll();
