setupNavbar();

function setupNavbar(){
    let navbarDropdowns = document.querySelectorAll(".nav__dropdown-name");
    for(let x = 0; x < navbarDropdowns.length; x++){
        navbarDropdowns[x].addEventListener('click', event => {
            toggleGroup(navbarDropdowns[x],"nav__active_visible");
            toggleGroup(navbarDropdowns[x],"nav__active_block");
          }
        );
    }

    let navbarGroups = document.querySelectorAll(".nav__dropdown-group-name");
    for(let x = 0; x < navbarGroups.length; x++){
        navbarGroups[x].addEventListener('click', event => {
            toggleGroup(navbarGroups[x],"nav__active_block");
          }
        );
    }

    let navbarBtn = document.querySelector(".navBtn");
    let home = document.querySelector(".nav_homeBtn");
    navbarBtn.addEventListener('click', event => {
        toggleClass(home,"nav__active_block");
        }
    );
}

function toggleClass(object, className){
    if(object.classList.contains(className)){
        object.classList.remove(className);
    }
    else{
        object.classList.add(className);
    }
}

function toggleGroup(object, className){
    if(object.classList.contains(className)){
        object.classList.remove(className);
    }
    else{
        removeClass(object, className);
        object.classList.add(className);
    }
}

function removeClass(object, className){
    console.log(object.parentNode.parentNode);
    let parentGroup = object.parentNode.parentNode;
    let group = parentGroup.querySelectorAll(`.${className}`);
    console.log(group);
    for(let x = 0; x < group.length; x++){
        group[x].classList.remove(className);
    }
}