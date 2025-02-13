const movieContainer = document.getElementById("movie_container");
const input = document.getElementById("movie_search");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");

let currentPage = 1;
let totalPages = 1;
let timer;

// Debounce function
function debounce(func, delay) {
  clearTimeout(timer);
  timer = setTimeout(func, delay);
}

// Fetch movies from OMDB API
async function fetchMovies(query, page = 1) {
  if (!query) {
    movieContainer.innerHTML = ""; // Clear results if query is empty
    return;
  }

  try {
    // Show loading state
    movieContainer.innerHTML = "<p>Loading...</p>";

    // Fetch data from OMDB API
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/http://www.omdbapi.com/?i=tt3896198&apikey=10aa930b&s=${query}&page=${page}`
    );
    const data = await response.json();

    // Display results or show "No results found" message
    if (data.Search) {
      movieContainer.innerHTML = data.Search.map(
        (movie) => `
                <div class="movie-card">
                    <img src="${movie.Poster}" alt="${movie.Title}">
                    <h3>${movie.Title}</h3>
                </div>
            `
      ).join("");

      // Update pagination info
      totalPages = Math.ceil(data.totalResults / 10); // OMDB returns 10 results per page
      updatePagination();
    } else {
      movieContainer.innerHTML = "<p>No results found.</p>";
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    movieContainer.innerHTML = "<p>Something went wrong. Please try again.</p>";
  }
}

// Update pagination controls
function updatePagination() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// Event listener for search input
input.addEventListener("input", () => {
  currentPage = 1; // Reset to the first page on new search
  debounce(() => fetchMovies(input.value.trim(), currentPage), 500);
});

// Event listener for "Previous" button
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchMovies(input.value.trim(), currentPage);
  }
});

// Event listener for "Next" button
nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchMovies(input.value.trim(), currentPage);
  }
});
