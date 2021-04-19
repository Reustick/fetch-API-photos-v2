let a = 0;   // переменная для старта
let b = 5;   // переменная для лимита

async function getPhotos() {
    
    const createLi = (content) => {     
        let listItem = document.createElement('li');
        let myH4 = document.createElement('h4');
        myH4.textContent = content.title;
        listItem.appendChild(myH4);
        let myImg = document.createElement('img');
        myImg.src = content.url;
        listItem.appendChild(myImg);
        return listItem;
    };
    
    async function renderLi(content) {
        let list = document.querySelector('.posts');
        const render = (container, template) => {
            container.appendChild(template);
        };
        await content.forEach(element => {
            render(list, createLi(element));
        });
    }
    //функция задержки
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    //функция получения данных. Запросы и дальнейший рендеринг происходит при скролле в (почти) конец страницы
    let sendFetch = debounce(async function() {
        let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
        let clHeight = document.documentElement.clientHeight;
        if (windowRelativeBottom <= clHeight + 50 || a === 0) {
            let response = await fetch(`https://jsonplaceholder.typicode.com/photos?_start=${a}&_limit=${b}`);
            let content = await response.json();
            console.log(content);
            a+=5;
            b+=5;
            if (content) {
                await renderLi(content);
            }
        }
    }, 250);
    
    window.addEventListener('scroll', sendFetch);
    
    // этот блок выполняем для первичной отрисовки
    if (a === 0) {
        await sendFetch();
    }
    
};
getPhotos();
