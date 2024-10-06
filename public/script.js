const carouselContainer = document.querySelector('.carousel-container');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

let scrollPosition = 0;
const scrollAmount = 150; 
const itemWidth = 120 + 30; 
const totalItems = carouselContainer.children.length;

function cloneItems() {
    const items = Array.from(carouselContainer.children);
    const cloneCount = Math.ceil(window.innerWidth / itemWidth) + 1; 

    for (let i = 0; i < cloneCount; i++) {
        const clone = items[i % totalItems].cloneNode(true);
        carouselContainer.appendChild(clone);
    }
}

cloneItems();

rightBtn.addEventListener('click', () => {
    scrollPosition += scrollAmount;

    if (scrollPosition >= itemWidth * totalItems) {
        scrollPosition = 0; // Loop back to start
        carouselContainer.style.transition = 'none';
        carouselContainer.style.transform = `translateX(0)`;
        setTimeout(() => {
            carouselContainer.style.transition = 'transform 0.5s ease-in-out';
        }, 10);
    }

    carouselContainer.style.transform = `translateX(-${scrollPosition}px)`;
});

leftBtn.addEventListener('click', () => {
    scrollPosition -= scrollAmount;


    if (scrollPosition < 0) {
        scrollPosition = itemWidth * totalItems; 
        carouselContainer.style.transition = 'none';
        carouselContainer.style.transform = `translateX(-${scrollPosition}px)`;
        setTimeout(() => {
            scrollPosition = 0;
            carouselContainer.style.transition = 'transform 0.5s ease-in-out';
            carouselContainer.style.transform = `translateX(0)`;
        }, 10);
    }

    carouselContainer.style.transform = `translateX(-${scrollPosition}px)`;
});
