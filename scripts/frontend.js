const typeWriter = (spanElement, words, waitingTime = 3000)=>{
    this.spanElement = spanElement;
    this.words = words;
    this.text = '';
    this.wordIndex = 0;
    this.waitTime = waitingTime;//converting it to base 10
    this.type = function () {
        const currentWord = this.wordIndex % this.words.length;
        //get full text of currentWord
        const fullWord = this.words[currentWord];

        //check if we're deleting
        if(this.isDeleting){
            //remove a character
            this.text = fullWord.substring(0, this.text.length - 1);
        }

        else{
            //add a character
            this.text = fullWord.substring(0, this.text.length + 1);
        }

        if(this.text.substring(0, 2) === "Am"){
            this.spanElement.innerHTML = `<span>${this.text.substring(0,2)}<span id="adjectives" class="text">${this.text.substring(2)}</span></span>`;
        }
        else{
            this.spanElement.innerHTML = `<span>${this.text.substring(0,7)}<span id="adjectives" class="text">${this.text.substring(7)}</span></span>`;
        }
        document.getElementById("adjectives").style.animationDuration = '.7s';

        //insert text into element
        let typeSpeed = 200;
        //delete faster
        if(this.isDeleting){
            typeSpeed /= 2;
        }

        //is word complete?
        if(!this.isDeleting && this.text === fullWord){
            typeSpeed = this.waitTime;//make a pause when finished
            this.isDeleting = true; //bc we finished typing
            document.getElementById("adjectives").style.animationDuration = '1s';
        }
        else if(this.isDeleting && this.text === ''){
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 2000;//take a pause before typing again
            document.getElementById("adjectives").style.animationDuration = '1s';
        }
        setTimeout(() => this.type(), typeSpeed);
    };
};

function startTyping() {
    const text = document.querySelector('.typing-carousel');
    const words = JSON.parse(text.getAttribute('data-words'));
    const wait = text.getAttribute('data-wait');
    //initialize the Typewriter
    typeWriter(text, words, wait);
    this.type();
}

function scrollAnchors(e, respond = null) {
    const distanceToTop = el => Math.floor(el.getBoundingClientRect().top);
    e.preventDefault();
    let targetID = (respond) ? respond.getAttribute('href') : this.getAttribute('href');
    const targetAnchor = document.querySelector(targetID);
    if (!targetAnchor) return;
    const originalTop = distanceToTop(targetAnchor);
    window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
    const checkIfDone = setInterval(function() {
        const atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
        if (distanceToTop(targetAnchor) === 0 || atBottom) {
            targetAnchor.tabIndex = '-1';
            window.history.pushState('', '', targetID);
            clearInterval(checkIfDone);
            targetAnchor.style.outline = '0';
        }
    }, 100);
}

const scrollTo = () => {
    const links = document.querySelectorAll('.scroll');
    links.forEach(link =>(link.onclick = scrollAnchors));
};

const navSlide = () =>{
    const burger = document.querySelector(".burger-menu");
    const nav = document.querySelector("nav ul");
    const navLinks = document.querySelectorAll("nav ul li");

    burger.addEventListener('click', ()=>{
        nav.classList.toggle("nav-active");
        navLinks.forEach((link, index) =>{
            if (link.style.animation){
                link.style.animation = '';
            }
            else{
                link.style.animation = `linksFade 500ms ease forwards ${index/7 + 0.5}s`;
            }
        });
        burger.classList.toggle('toggle');
    });

};

const introOptions = {rootMargin: "-150px 0px 0px 0px"/*the observer activates 150px before reaching the next section*/};

const introObserver = new IntersectionObserver((sections)=>{
    let navigationBar = document.getElementById('navBar');//we're going to change its background-color
    sections.forEach((section)=>{//must use the loop
        if (section.isIntersecting){//if the intro section is in the screen
            navigationBar.classList.remove('nav-background-color');//we remove the background color
        }
        else{
            navigationBar.classList.add('nav-background-color');//we add it
        }
    })
}, introOptions);

const sectionOptions = {
    rootMargin: "0px"/*when we're completely in a section, we activate*/,
    threshold: 0.8
};

const sectionsObserver = new IntersectionObserver((sections)=>{
    const navLinks = document.querySelectorAll("nav ul li a");

    sections.forEach((section)=>{
        if (section.isIntersecting){
            switch (section.target.id) {
                case "intro":
                    navLinks[0].classList.add('nav-item-active');
                    navLinks[1].classList.remove('nav-item-active');
                    navLinks[2].classList.remove('nav-item-active');
                    navLinks[3].classList.remove('nav-item-active');
                    navLinks[4].classList.remove('nav-item-active');
                    //window.history.pushState("#intro", "intro", "/");
                    break;
                case "about":
                    navLinks[1].classList.add('nav-item-active');
                    navLinks[0].classList.remove('nav-item-active');
                    navLinks[2].classList.remove('nav-item-active');
                    navLinks[3].classList.remove('nav-item-active');
                    navLinks[4].classList.remove('nav-item-active');
                    break;
                case "services":
                    navLinks[2].classList.add('nav-item-active');
                    navLinks[0].classList.remove('nav-item-active');
                    navLinks[1].classList.remove('nav-item-active');
                    navLinks[3].classList.remove('nav-item-active');
                    navLinks[4].classList.remove('nav-item-active');
                    break;

                case "skills":
                    navLinks[3].classList.add('nav-item-active');
                    navLinks[0].classList.remove('nav-item-active');
                    navLinks[1].classList.remove('nav-item-active');
                    navLinks[2].classList.remove('nav-item-active');
                    navLinks[4].classList.remove('nav-item-active');
                    break;

                case "contact-section":
                    navLinks[4].classList.add('nav-item-active');
                    navLinks[0].classList.remove('nav-item-active');
                    navLinks[1].classList.remove('nav-item-active');
                    navLinks[2].classList.remove('nav-item-active');
                    navLinks[3].classList.remove('nav-item-active');
                    break;
                default:
            }
        }
    })
}, sectionOptions);

const charts = () =>{
    let charts = document.querySelectorAll('.chart');
    charts.forEach((chart)=> {
        new EasyPieChart(chart, {
            scaleColor: "#ecf0f1",
            lineWidth: 10,
            lineCap: 'round',
            barColor: '#39fd12',
            trackColor: '#ecf0f1',
            size: 100,
            animate: 850,
        });
    });
};

window.onload = () => {
    scrollTo();

    introObserver.observe(document.getElementById('intro'));

    navSlide();

    const sections = document.querySelectorAll('section');
    sections.forEach((section)=>{
        sectionsObserver.observe(section);
    });

    startTyping();

    charts();
};