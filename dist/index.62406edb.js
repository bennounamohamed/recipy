const API_KEY = 'fa44fa6c-502e-4624-9e90-2f4c108b8361';
const recipeContainer = document.querySelector('.recipe');
const searchInput = document.querySelector('.search__field');
const searchBtn = document.querySelector('.search__btn');
const searchResultsDiv = document.querySelector('.results');
const timeout = function(s) {
    return new Promise(function(_, reject) {
        setTimeout(function() {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
const getData = async function(item) {
    try {
        const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${item}&key=${API_KEY}`);
        if (!res.ok) throw new Error('Failed to get data');
        const data = await res.json();
        const result = data.data.recipes;
        if (result.length === 0) throw new Error('Invalid search Term');
        return result;
    } catch (err) {
        alert(err);
    }
};
const renderSearch = function(searchResult) {
    if (!searchResult) return;
    searchResult.forEach((item)=>{
        const li = document.createElement('li');
        li.classList = 'preview';
        li.innerHTML = ` 
            <a class="preview__link preview__link--active" href="#23456">
              <figure class="preview__fig">
                <img src=${item.image_url} alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${item.title}</h4>
                <p class="preview__publisher">${item.publisher}</p>
              </div>
            </a>
           `;
        searchResultsDiv.appendChild(li);
    });
};
searchBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    const searchValue = searchInput.value.trim();
    if (searchValue === '') return alert('Search field cannot be empty.');
    try {
        const searchResult = await getData(searchValue);
        console.log(searchResult);
        renderSearch(searchResult);
    } catch (err) {
        console.error(err);
    }
});

//# sourceMappingURL=index.62406edb.js.map
