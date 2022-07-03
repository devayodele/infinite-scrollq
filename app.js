const container = document.querySelector(".container");
const quotesEl = document.querySelector(".quotes");
const indicator = document.querySelector(".indicator");

let currentPage = 1;
const limit = 10;
let total = 0;

//Get qoutes

async function getQuotes(page, limit) {
  const url = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw Error(`an error occurred: ${response.status}`);
  }

  const results = await response.json();

  return results;
}

//check for qoutes

function hasMoreQuotes(page, limit, total) {
  const startIndex = (page - 1) * limit + 1;
  return total === 0 || startIndex < total;
}

//Show the quotes

function showQuotes(quotes) {
  quotes.forEach((quote) => {
    const quoteEl = document.createElement("blockquote");
    quoteEl.classList.add("quote");

    quoteEl.innerHTML = `<span>${quote.id})</span>
                            ${quote.quote} <span><i class="fa fa-quote-right" aria-hidden="true"></i></span>
                        
                            <br>
                            <footer class='quote-footer'>${quote.author}</footer> 
                            `;

    quotesEl.appendChild(quoteEl);
  });
}

//Load the quotes

async function loadQuotes(page, limit) {
  showLoader();

  setTimeout(async () => {
    try {
      if (hasMoreQuotes(page, limit, total)) {
        const response = await getQuotes(page, limit);
        console.log(response.data);
        showQuotes(response.data);

        total = response.total;
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      hideLoader();
    }
  }, 500);
}

function hideLoader() {
  indicator.classList.add("hidden");
}

function showLoader() {
  indicator.classList.remove("hidden");
}

window.addEventListener(
  "scroll",
  (event) => {
    // const { scrollY, innerHeight} = window;
    const { scrollHeight } = document.documentElement;

    if (
      scrollY + innerHeight >= scrollHeight &&
      hasMoreQuotes(currentPage, limit, total)
    ) {
      currentPage++;
      loadQuotes(currentPage, limit);
    }
  },

  { passive: true }
);

//initialize
loadQuotes(currentPage, limit);
