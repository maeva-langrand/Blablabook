const btn_edit = document.querySelector(".section_info_button");
const container_edit = document.querySelector(".section_info_data");
const icon_edit = document.querySelector(".section_info_button_edit");

// edit profil with button changes if you edit or cancel editing

function editProfil(){
 container_edit.classList.toggle("editing");

 if(container_edit.classList.contains("editing")){
    icon_edit.src = "/img/icons/hugeicons--cancel-square.svg";
    icon_edit.alt = "annuler l'édition";
 }else {
    icon_edit.src = "/img/icons/typcn--edit.svg";
    icon_edit.alt = "editer le profil"
 }
}

 btn_edit.addEventListener("click", editProfil)


// carousel profil

// Fonction pour initialiser un carrousel
function initCarousel(wrapperSelector) {
    const wrapper = document.querySelector(wrapperSelector); 
    
    if (!wrapper) return; 
    
    const prevBtn = wrapper.querySelector(".carousel_btn.prev"); 
    const nextBtn = wrapper.querySelector(".carousel_btn.next"); 
    const container = wrapper.querySelector(".section_books_container, .section_info_library");

    if (!prevBtn || !nextBtn || !container) return;
    
    let currentIndex = 0; 
    const items = container.querySelectorAll('.section_books_div, .section_info_article'); ;
    const totalItems = items.length 
    
   if (totalItems === 0) return;

    function scrollToIndex(index) {
        const scrollAmount = container.offsetWidth * index;
        
        container.scrollLeft = scrollAmount;
    }
    
    nextBtn.addEventListener('click', () => {
      currentIndex++;
      if( currentIndex >= totalItems) {
         currentIndex = 0 ;
      }


        scrollToIndex(currentIndex);
    });
    

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
         currentIndex = totalItems - 1;
         
        }
        scrollToIndex(currentIndex);
    });
}

// 6. Initialiser les 2 carrousels au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier qu'on est en mobile (width < 920px)
    if (window.innerWidth <= 920) {
        // Initialiser le carrousel des derniers livres consultés
        initCarousel('.section_books .section_wrapper');
        
        // Initialiser le carrousel de la bibliothèque
        initCarousel('.section_library .section_wrapper');
    }
});
