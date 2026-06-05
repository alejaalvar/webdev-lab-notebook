## Code Review Exercise

### Issue #1: Accessibility

The accessibility issue is the "empty button" issue, meaning that the button is either empty or has no text value text. A button should always have a value, but sometimes, we might use a glyphicon such as "x" to indicate this button is meant to close the modal. To fix this issue, we can add an "aria-label" attribute. It's also a good idea to add the "title" attribute, which will show the "title" of the image as a tooltip when the user hovers over the image.

<img src="../images/10-debugging/bug-1.png" height=200 alt="screenshot showing an aaccessibility issue on the close button of the modal">

Initial code:

```html
<button class="close-popup-button">
  <i class="fa-solid fa-xmark"></i>
</button>
```

Updated code:

```html
<button
  class="close-popup-button"
  title="close popup button"
  aria-label="close popup button"
>
  <i class="fa-solid fa-xmark"></i>
</button>
```

### Issue #2: fetchCatFacts null reference bug on reload

When `fetchCatFacts` finishes loading, the `finally` block used `setAttribute("class", "display-none")` to hide the loading spinner. `setAttribute` replaces the **entire** class attribute, so the element loses its `"loading-container"` class — its class becomes just `"display-none"`. On the next call to `fetchCatFacts`, `createLoadingContainer` runs `document.querySelector(".loading-container")`, which no longer matches any element and returns `null`. Calling `.append()` on `null` throws a `TypeError`. Because `createLoadingContainer` is called before the `try/catch` block, this exception is unhandled, and clicking "Load New Cat Facts" silently fails.

The fix has three parts: use `classList.add` instead of `setAttribute` so the `"loading-container"` class is preserved; remove `"display-none"` at the start of each fetch so the spinner is visible again; and call `replaceChildren()` on the loading container in `finally` to prevent loader images from accumulating on each reload.

Initial code:

```js
const fetchCatFacts = async function () {
  const catFactsList = document.getElementById("cat-facts-list");
  catFactsList.replaceChildren();

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
    loading.setAttribute("class", "display-none");
  }
};
```

Updated code:

```js
const fetchCatFacts = async function () {
  const catFactsList = document.getElementById("cat-facts-list");
  catFactsList.replaceChildren();

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
    loading.classList.add("display-none");
    loading.replaceChildren();
  }
};
```

### Issue #3: form buttons outside of the form element

The `<input type="submit">` and `<input type="reset">` buttons appear
after the closing `</form>` tag. Buttons outside a form have no association with it --
clicking Submit won't submit the form (assuming there was a backend), and clicking Reset
won't reset the fields. This is a semantic and functional bug.

The actual fix for the code was very simple: move the `<input>` tags inside the `<form>` element.

Initial Code:

```html


      </form>
      <div
        class="form space-evenly-distributed-row-container form-buttons-container"
      >
        <input class="form-button" type="submit" value="submit" />
        <input class="form-button" type="reset" value="reset" />
      </div>
    </div>

    <footer class="footer">
      Copyright Ⓒ 2023 Yiming Lin. All rights reserved.
    </footer>
  </body>
</html>



```

Updated Code:

```html

        <!-- immediately following the closing textarea tag  -->

        <div
          class="form space-evenly-distributed-row-container form-buttons-container"
        >
          <input class="form-button" type="submit" value="submit" />
          <input class="form-button" type="reset" value="reset" />
        </div>
      </form>
    </div>

    <footer class="footer">
      Copyright Ⓒ 2023 Yiming Lin. All rights reserved.
    </footer>


```

### Issue #4: `<a>` elements used for actions instead of `<button>`

The "More Info" buttons in the History section and the "Load New Cat Facts" element were all `<a>` tags with no `href` attribute. Anchor elements are meant for navigation — they represent a hyperlink to another location. When an `<a>` has no `href`, it is not keyboard-focusable by default (no tab stop), which is an accessibility problem. Since these elements trigger JavaScript actions rather than navigate anywhere, the correct semantic element is `<button>`. This change was applied to all four occurrences.

Initial code:

```html
<a class="more-info-button">More Info</a>
```

```html
<a class="reload-cat-facts">Load New Cats Facts</a>
```

Updated code:

```html
<button class="more-info-button">More Info</button>
```

```html
<button class="reload-cat-facts">Load New Cats Facts</button>
```

### Issue #5: `<span>` used instead of `<label>` for form field labels

The form field labels for Name, Username, Email, and Phone Number were written as `<span class="form-label">` elements. A `<span>` is a generic inline container with no semantic meaning. The correct element is `<label>`, which programmatically associates the label text with its corresponding input control. Screen readers use this association to announce the label when a user focuses the input. The inputs had `aria-label` attributes as a fallback, but proper `<label>` elements are the semantic standard and should be preferred. This change was applied to all four field labels.

Initial code:

```html
<span class="form-label">Name</span>
<input
  aria-label="name"
  class="form-input-box"
  type="text"
  id="name"
  name="name"
/>
```

Updated code:

```html
<label class="form-label">Name</label>
<input
  aria-label="name"
  class="form-input-box"
  type="text"
  id="name"
  name="name"
/>
```

### Issue #6: `<div>` used instead of `<fieldset>` and `<legend>` for checkbox group

The group of breed checkboxes was wrapped in a `<div class="form-fieldset">` with a `<p>` as its heading. The correct semantic HTML for grouping related form controls is a `<fieldset>` element with a `<legend>`. Screen readers announce the `<legend>` text when a user focuses any control inside the group, giving context for what the group of checkboxes represents. Using a plain `<div>` and `<p>` provides no such association.

Initial code:

```html
<div class="form-fieldset form-element-container">
  <p class="form-label">What breeds would you like to learn?</p>
  <div>
    <input type="checkbox" id="siamese" name="breed1" value="siamese" />
    <label for="siamese">Siamese Cat</label>
  </div>
  ...
</div>
```

Updated code:

```html
<fieldset class="form-fieldset form-element-container">
  <legend class="form-label">What breeds would you like to learn?</legend>
  <div>
    <input type="checkbox" id="siamese" name="breed1" value="siamese" />
    <label for="siamese">Siamese Cat</label>
  </div>
  ...
</fieldset>
```
