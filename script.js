// Random quotes

const apiUrl = "https://api.quotable.io/random";

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

// console.log(quoteSection, userInput);

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Display random quotes

const renderNewQuote = async () => {
  // Fetching contents from url

  const response = await fetch(apiUrl);

  // Storing response

  let data = await response.json();

  quote = data.content;
  //   console.log(quote);

  // Arary of characters in the quote

  let arr = quote.split("").map((value) => {
    // wrap the characters in the span

    return "<span class='quote-chars'>" + value + "</span>";
  });
  // join array for displaying

  quoteSection.innerHTML += arr.join("");

  //   console.log(arr);
};

// Logic for comparing input text with quote

// Start Test

const startTest = () => {
  mistakes = 0;
  timer = "";
  timeReduce();
  userInput.disabled = false;
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";

  userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    // console.log(quoteChars);

    // create an array from received span tags

    quoteChars = Array.from(quoteChars);
    //   console.log(quoteChars);

    // array of user input characters

    let userInputChars = userInput.value.split("");

    // Loop through each character

    quoteChars.forEach((char, index) => {
      // check if char(quote character) =  userInputChars

      if (char.innerText == userInputChars[index]) {
        char.classList.add("success");
      }
      // if user has entered anything or backspaced
      else if (userInputChars[index] == null) {
        // Remove class if any
        if (char.classList.contains("success")) {
          char.classList.remove("success");
        } else {
          char.classList.remove("fail");
        }
      }
      // If user entered wrong character
      // Checks if we already have fail class
      else {
        if (!char.classList.contains("fail")) {
          // increment and display mistakes
          mistakes += 1;
          char.classList.add("fail");
        }
        document.getElementById("mistakes").innerText = mistakes;
      }

      // Returns true if all the characters are correct

      let check = quoteChars.every((element) => {
        return element.classList.contains("success");
      });

      //  End test if all the character are correct

      if (check) {
        console.log("ok");
        displayResult();
      }
    });
  });
};

// Update Timer

function updateTimer() {
  if (time == 0) {
    // End test if timer reaches 0

    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

// sets timer

const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

// End Test

const displayResult = () => {
  document.getElementById("exampleModal").style.display = "block";

  // display result div

  document.querySelector(".result").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";

  userInput.disabled = true;

  userInput.onkeydown = "return false";
  let timeTaken = 1;
  if (time != 0) {
    timeTaken = (60 - time) / 100;
  }
  document.getElementById("wpm").innerText =
    (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";
  document.getElementById("accuracy").innerText =
    Math.round(
      ((userInput.value.length - mistakes) / userInput.value.length) * 100
    ) + "%";
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};
