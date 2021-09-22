const fetchMovies = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
}

// when page is first loaded, fetch the movies
document.addEventListener(
  'DOMContentLoaded',
  fetchMovies(
    'https://api.themoviedb.org/3/discover/movie?api_key=e57b22727a4f4998116d5f5a3bf56dcc&sort_by=popularity.desc'
  )
)

// add  '&language=tr-TR' query later
