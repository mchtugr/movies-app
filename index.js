const BASE_URL = 'https://api.themoviedb.org/3/'
const API_KEY = 'e57b22727a4f4998116d5f5a3bf56dcc'
const DISCOVER_URL = `discover/movie?api_key=${API_KEY}`
const SEARCH_URL = `search/movie?api_key=${API_KEY}`

const fetchMovies = async (
  url,
  page = 1,
  query = 'the lord of the rings',
  sort_by = 'popularity.desc',
  language = 'en-US'
) => {
  const response = await fetch(
    BASE_URL +
      url +
      '&page=' +
      page +
      '&query=' +
      query +
      '&language=' +
      language +
      '&sort_by=' +
      sort_by
  )
  const data = await response.json()
  return data
}

const renderMovieCards = (data) => {
  const root = document.querySelector('.container')
  const resArr = data.results
  let movieCardHtml = ''

  resArr.forEach(
    ({ original_title, poster_path, release_date, vote_average }) => {
      const card = `
        <div class="movie_card" title='${original_title}'>
          <div class="img_container">
            <img
            src="https://image.tmdb.org/t/p/w500${poster_path}"
            onerror="this.onerror=null; this.src='img/default-img.jpg'"
            alt="${original_title}"
            />
          </div>
          <div class="card_text_container">
            <h4 class="movie_title">${original_title.slice(0, 40)}</h4>
            <div>${release_date.slice(0, 4)}</div> 
            <div class="movie_score_container">
              <h5 class="movie_score ${vote_average < 5 && 'text_red'} ${
        vote_average >= 5 && vote_average < 7 && 'text_blue'
      } ${vote_average >= 7 && 'text_green'}" >${vote_average}</h5>
            </div>            
          </div>
        </div>`
      movieCardHtml += card
    }
  )

  root.innerHTML = movieCardHtml
}

const paginate = (pageNum, url) => {
  // when pagination change, fetch new datas
  fetchMovies(url, pageNum)
    .then((data) => renderPagination(data, url))
    .then(renderMovieCards)
}

// creates pagination buttons
const renderPagination = async (data, url) => {
  const pagination = document.querySelector('#pagination')
  const currentPage = data.page
  const lastPage = data.total_pages
  // create available pages array
  const pages = [...Array(lastPage).keys()].map((num) => num + 1)
  const currentPageIndex = pages.indexOf(currentPage)
  // shows only first three pages if available
  let firstThree = pages.slice(currentPageIndex, currentPageIndex + 3)

  // first page & next page btns
  paginationHtml = `<button class="pagination_item" ${
    currentPage === 1 && 'disabled'
  } onclick='paginate(1, "${url}")'><i class="fas fa-fast-backward pagination_icon"></i></button>
  <button class="pagination_item" ${
    currentPage === 1 && 'disabled'
  } onclick='paginate(${
    currentPage - 1
  }, "${url}")'><i class="fas fa-step-backward pagination_icon"></i></button>`

  // render first three pages after current page
  firstThree.forEach((pageNum) => {
    paginationHtml += `<button class="pagination_item ${
      currentPage === pageNum && 'active'
    }" onclick='paginate(${pageNum}, "${url}")'>${pageNum}</button>`
  })
  // next page & last page btns
  paginationHtml += `
  <button class="pagination_item" ${
    currentPage === lastPage && 'disabled'
  } onclick='paginate(${
    currentPage + 1
  }, "${url}")'><i class="fas fa-step-forward pagination_icon"></i></button>
  <button class="pagination_item" ${
    currentPage === lastPage && 'disabled'
  } onclick='paginate(${lastPage}, "${url}")'><i class="fas fa-fast-forward pagination_icon"></i></button>`

  pagination.innerHTML = paginationHtml
  return data
}

// when page is first loaded, fetch the movies
document.addEventListener(
  'DOMContentLoaded',
  fetchMovies(DISCOVER_URL)
    .then((data) => renderPagination(data, DISCOVER_URL))
    .then(renderMovieCards)
)

// seaarchbar function
var timer
const handleSearch = () => {
  let keyword = document.querySelector('.search_box').value
  //search starts when user stops typing
  clearTimeout(timer)

  // search keyword should be at least 3 characters to start searching.
  if (keyword.length > 2) {
    timer = setTimeout(function () {
      fetchMovies(SEARCH_URL, 1, keyword).then((data) =>
        renderPagination(data, SEARCH_URL).then(renderMovieCards)
      )
    }, 400)
  }
  // if searchbox empty again, get random movies again
  if (keyword.length === 0) {
    timer = setTimeout(function () {
      fetchMovies(DISCOVER_URL).then((data) =>
        renderPagination(data, DISCOVER_URL).then(renderMovieCards)
      )
    }, 400)
  }
}

// add  '&language=tr-TR' query later

// sorting functionality added
handleSort = () => {
  let sortType = document.getElementById('sort').value
  fetchMovies(DISCOVER_URL, 1, null, sortType).then((data) =>
    renderPagination(data, DISCOVER_URL).then(renderMovieCards)
  )
}

const currentYear = new Date().getFullYear()

document.getElementById('copyright').innerHTML = '&copy; ' + currentYear
