const URL = 'https://pixabay.com/api/';

function searchImg(searchImg) {
  fetch(`${URL}${searchImg}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
