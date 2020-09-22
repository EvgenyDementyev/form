/* CONFIG */

const MIN_SEARCH_RESULTS_COUNT = 4;
const RESOURCES_COUNT = 3;

//



/* DATA */
/* 
 * Ввиду отсутсвия бэка данные были представлены моками.
 * Реализована имитация работы с несколькими источниками данных. 
 */
const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

const resourses = [];

let arrIndex = 0;
countries.forEach((item) => {
    if (arrIndex > RESOURCES_COUNT) {
        arrIndex = 0;
    }
    if (!resourses[arrIndex]) {
        resourses[arrIndex] = [];
    }
    resourses[arrIndex].push(item);
    arrIndex++;
});

//



/* SEARCH */

const searchResaultContainer = document.getElementById('searchResult');
const search = document.getElementById('search');

const hideSearchResults = () => {
  searchResaultContainer.style.visibility = 'hidden';
};

const showSearchResults = () => {
  searchResaultContainer.style.visibility = 'visible';
};

const removeSearchResults = () => {
  if (searchResaultContainer.firstChild) {
    searchResaultContainer.removeChild(searchResaultContainer.firstChild);
  }
};

const renderSearchResults = (searchResults) => {
  const searchResultsWrap = document.createElement('div');
  searchResults.forEach((data) => {
    const el = document.createElement('p');
    el.innerText = data;
    el.addEventListener('click', (e) => {
      search.value = e.target.innerText;
      removeSearchResults();
      hideSearchResults();
    })
    searchResultsWrap.appendChild(el);
  })
  searchResaultContainer.appendChild(searchResultsWrap);
  showSearchResults();
}

const getSearchResults = (value) => {
  const searchResults = [];
  for (let i = 0; i < resourses.length; i++) {
    resourses[i].forEach(item => {
      if (item.toUpperCase().includes(value)) {
        searchResults.push(item)
      }
    });
    if (searchResults.length > MIN_SEARCH_RESULTS_COUNT) {
      break;
    }
  }
  
  return searchResults;
}

search.addEventListener('blur', () => setTimeout(hideSearchResults, 100));
search.addEventListener('focus', showSearchResults);
search.addEventListener('input', (e) => {
  const value = e.target.value.toUpperCase();
  if (value) {
    removeSearchResults();
    const searchResults = getSearchResults(value);
    renderSearchResults(searchResults);
  } else {
    hideSearchResults();
  }
})

//



/* PHONE */

const setFocus = (el) => {
    const currFocusPosition = el.value.indexOf('_')
    el.setSelectionRange(currFocusPosition,currFocusPosition)
};

const phone = document.getElementById('phone');

phone.value = phone.dataset.mask;

phone.addEventListener('click', () => setFocus(phone))

let prevInputData = [phone.dataset.mask]

phone.addEventListener('keydown', (e) => {
    e.preventDefault();

    // Backspace
    if (e.keyCode === 8) {
        e.target.value = prevInputData.pop();
        setFocus(e.target);

        if (prevInputData.length === 0) {
        prevInputData.push(phone.dataset.mask)
        }
        return;
    }
    // Только цифры 1 - 9
    if (e.keyCode < 46 || e.keyCode > 57) {
        return;
    }
    const newValue = e.target.value.replace('_', e.key);
    if (newValue === e.target.value) {
        return;
    }
    prevInputData.push(e.target.value);
    e.target.value = newValue;

    setFocus(e.target)
})

//



/* ACTION BAR */

const savedSearch = localStorage.getItem('search');
if (savedSearch) {
    search.value = savedSearch;
}

const savedPhone = localStorage.getItem('phone');
if (savedPhone) {
    const phoneData = JSON.parse(savedPhone);
    phone.value = phoneData.value;
    prevInputData = phoneData.prevInputData;
}

const saveButton = document.getElementById('saveButton');
const clearButton = document.getElementById('clearButton');

let toastTimeout;

saveButton.addEventListener('click', () => {
    localStorage.setItem('search', search.value);
    /*
     * С текущей реализацией валидации нам необходимо хранить 
     * дополнительную мета-информацию о сохраненном номере.
     * В реальном проекте это был бы код страны для определения
     * используемой маски. 
     */
    const phoneData = {
        value: phone.value,
        prevInputData,
    };
    localStorage.setItem('phone', JSON.stringify(phoneData))
    
    const toast = document.getElementById('toast');
    toast.classList.add('showToast');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('showToast'), 2500);
})

clearButton.addEventListener('click', () => {
    search.value = '';
    phone.value = phone.dataset.mask;
    delete localStorage.search;
    delete localStorage.phone;
})

//