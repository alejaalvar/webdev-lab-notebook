const moreInfoButtons = document.querySelectorAll(".more-info-button"); // the more info buttons in the history section
const closePopupButtons = document.querySelectorAll(".close-popup-button"); // the x buttons on the modal when you click more info

/*
This is essentially looping through each of those moreInfo buttons, adding a click event listener, 
going to the parent, and then going to the sibling, which the next sibling is the element with the 
class value popup-section-container, and then setting its display attribute to block
(it starts off as none)
*/
document.querySelectorAll("button[data-target]").forEach((button) => {
  button.addEventListener("click", (event) => {
    const popupSectionId = event.currentTarget.dataset.target;
    const popupSection = document.getElementById(popupSectionId);
    popupSection.style.display = "block";
  });
});

/*
This is essentially looping through the close buttons, adding a click event listener, going to the 
great-grandparent element, and then setting its display property back to none. So the functionality
provided to the user is essentially when they open the page, the modal is invisble, when they click
on the more info button, they can click on the x and then it will set the display back to none, hiding
it again, allowing the user to toggle back and forth

This way of modifying the display property seems very fragile as it depends entirely on the structure
of the DOM
*/
for (const closePopupButton of closePopupButtons) {
  closePopupButton.addEventListener("click", (event) => {
    console.log(event.target); // is it an issue to console.log the internal structure of the dom in production?
    const popupSection =
      event.currentTarget.parentElement.parentElement.parentElement;
    popupSection.style.display = "none";
  });
}

/*
This is the spinning loading icon that shows up on first visit
and on subsequent reloads
*/
const createLoadingContainer = function () {
  const loadingContainer = document.querySelector(".loading-container");
  const loader = document.createElement("img");
  loader.src = "../../images/loader.gif";
  loader.alt = "loader gif while the data loads";
  loader.width = 60;
  loader.height = 60;
  /*
  this will cause loader images to accumulate
  */
  loadingContainer.append(loader); // adds the child elem (img) to the loading container node in the dom
};

/*
I believe we have an uncaught exception here? The load new cat facts functionality
is not actually functional. We might be trying to do something on a null value
*/
const fetchCatFacts = async function () {
  const catFactsList = document.getElementById("cat-facts-list");
  catFactsList.replaceChildren();

  /*
  remove display-none so we can see the loading icon on subsequent reloads
  */
  const loading = document.querySelector(".loading-container");
  loading.classList.remove("display-none");
  createLoadingContainer();

  try {
    const response = await fetch("https://catfact.ninja/facts?limit=10");
    const data = await response.json();

    data.data.forEach((element) => {
      const catFactItem = document.createElement("p");
      catFactItem.setAttribute("class", "cat-fact-list-item");
      catFactItem.textContent = element.fact;
      catFactsList.append(catFactItem);
    });
  } catch (error) {
    console.error("Error fetching cat facts:", error);
  } finally {
    const loading = document.querySelector(".loading-container");
    //loading.setAttribute("class", "display-none"); // this is the culprit for the null problem
    loading.classList.add("display-none"); // this will preserve the existing loading-container class
    loading.replaceChildren();
  }
};

fetchCatFacts();

document
  .querySelector(".reload-cat-facts")
  .addEventListener("click", fetchCatFacts);
