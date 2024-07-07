const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const customAlert = document.getElementById('customAlert');
const searchInput = document.getElementById('search-input');

// Event listeners
searchBtn.addEventListener('click', getMealList);
searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        getMealList();
    }
});
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Function to get meal list based on ingredient
function getMealList() {
    let searchInputTxt = searchInput.value.trim();
    if (searchInputTxt === '') {
        customAlert.textContent = "Please enter an ingredient to get recipes.";
        customAlert.classList.add('alert-visible');
        mealList.innerHTML = ''; // Clear any existing meal list
        return;
    }
    
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
            customAlert.classList.remove('alert-visible');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            customAlert.textContent = "Error fetching data. Please try again later.";
            customAlert.classList.add('alert-visible');
        });
}

// Function to get recipe details for a meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals))
            .catch(error => console.error('Error fetching recipe:', error));
    }
}

// Function to display recipe details in a modal with bullet points
function mealRecipeModal(meal) {
    meal = meal[0];

    // Clean and split instructions into an array of steps
    let instructions = meal.strInstructions
        .replace(/^\d+\.\s*/gm, '') // Remove leading numbers
        .replace(/^\d+\s+/gm, '') // Remove stray numbers
        .split('\n')
        .filter(step => step.trim() !== '');

    // Convert each step into a list item
    let stepsHtml = instructions.map(step => `<li>${step.trim()}</li>`).join('');

    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <ul>${stepsHtml}</ul>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}


