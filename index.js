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
  console.log(data)
  return data
}

const paginate = (pageNum, url) => {
  // when pagination change, fetch new datas
  fetchMovies(url, pageNum).then((data) => createPagination(data, url))
}

// creates pagination buttons
const createPagination = (data, url) => {
  const pagination = document.querySelector('#pagination')
  const currentPage = data.page
  const lastPage = data.total_pages
  // create available pages array
  const pages = [...Array(lastPage).keys()].map((num) => num + 1)
  const currentPageIndex = pages.indexOf(currentPage)
  // shows only first three pages if available
  let firstThree = pages.slice(currentPageIndex, currentPageIndex + 3)

  // first page btn
  paginationHtml = `<button class="pagination_item" ${
    currentPage === 1 && 'disabled'
  } onclick='paginate(1, ${url})'>&laquo;</button>`
  // render first three pages after current page
  firstThree.forEach((pageNum) => {
    paginationHtml += `<button class="pagination_item" onclick='paginate(${pageNum}, "${url}")'>${pageNum}</button>`
  })
  // last page btn
  paginationHtml += `<button class="pagination_item" ${
    currentPage === lastPage && 'disabled'
  } onclick='paginate(${lastPage}, ${url})'>&raquo;</button>`

  pagination.innerHTML = paginationHtml
}

// when page is first loaded, fetch the movies
document.addEventListener(
  'DOMContentLoaded',
  fetchMovies(DISCOVER_URL).then((data) => createPagination(data, DISCOVER_URL))
)

// add  '&language=tr-TR' query later
