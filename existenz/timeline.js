       function all() {
        let paths = [
         {dir: '<img class="all" src="img/people/image', length: 51},
         {dir: '<img class="all" src="img/culture/photo', length: 94},
         {dir: '<img class="all lazy" data-src="img/maps/photo', length: 65},
         {dir: '<img class="all lazy" data-src="img/food/photo', length: 16},
         {dir: '<img class="all lazy" data-src="img/nature/photo', length: 32},
         {dir: '<img class="all lazy" data-src="img/animals/photo', length: 37},
         {dir: '<img class="all lazy" data-src="img/objects/photo', length: 82},
         {dir: '<img class="all lazy" data-src="img/architecture/photo', length: 110},
        ]

        let sectionHtml = "";
        for (let i =0; i < paths.length; i++) {
          for (let j = 1; j < paths[i].length; j++ ) {
            sectionHtml += paths[i].dir + j.toString()  + '.png">'
          }
        }
        let section = document.getElementById("all12");
        section.innerHTML = sectionHtml;
        }

      all();

    function sections(sectionNumber, pathToImage, lastImageId) {
        let section = document.getElementById(sectionNumber);
        let section1Html = "";
        for (let i = 1; i < lastImageId; i++) {
          section1Html += pathToImage + i.toString()  + '.png">'
        }
        section.innerHTML = section1Html;
    }
    
    sections('section1', '<img class="allTwo" src="img/people/image', 52);
    sections('section2', '<img class="allTwo lazy" data-src="img/animals/photo', 38);
    sections('section3', '<img class="allTwo lazy" data-src="img/food/photo', 17);
    sections('section4', '<img class="allTwo lazy" data-src="img/culture/photo', 95);
    sections('section5', '<img class="allTwo lazy" data-src="img/objects/photo', 83);
    sections('section6', '<img class="allTwo lazy" data-src="img/architecture/photo', 111);
    sections('section7', '<img class="allTwo lazy" data-src="img/nature/photo', 33);
    sections('section8', '<img class="allTwo lazy" data-src="img/maps/photo', 66);
    sections('section9', '<img class="allTwo lazy" data-src="img/albania/', 17);
    sections('section10', '<img class="allTwo lazy" data-src="img/austria/', 17);
    sections('section11', '<img class="allTwo lazy" data-src="img/belarus/', 17);
    sections('section12', '<img class="allTwo lazy" data-src="img/belgium/', 17);
    sections('section13', '<img class="allTwo lazy" data-src="img/bosniaandherzegovina/', 17);
    sections('section14', '<img class="allTwo lazy" data-src="img/bulgaria/', 17);
    sections('section15', '<img class="allTwo lazy" data-src="img/croatia/', 17);
    sections('section16', '<img class="allTwo lazy" data-src="img/czech/', 17);
    sections('section17', '<img class="allTwo lazy" data-src="img/denmark/', 17);
    sections('section18', '<img class="allTwo lazy" data-src="img/estonia/', 17);
    sections('section19', '<img class="allTwo lazy" data-src="img/finland/', 17);
    sections('section20', '<img class="allTwo lazy" data-src="img/france/', 17);
    sections('section21', '<img class="allTwo lazy" data-src="img/germany/', 17);
    sections('section22', '<img class="allTwo lazy" data-src="img/greece/', 17);
    sections('section23', '<img class="allTwo lazy" data-src="img/holand/', 17);
    sections('section24', '<img class="allTwo lazy" data-src="img/hungary/', 17);
    sections('section25', '<img class="allTwo lazy" data-src="img/iceland/', 17);
    sections('section26', '<img class="allTwo lazy" data-src="img/ireland/', 17);
    sections('section27', '<img class="allTwo lazy" data-src="img/italy/', 17);
    sections('section28', '<img class="allTwo lazy" data-src="img/latvia/', 17);
    sections('section29', '<img class="allTwo lazy" data-src="img/lithuania/', 17);
    sections('section30', '<img class="allTwo lazy" data-src="img/luxembourg/', 17);
    sections('section31', '<img class="allTwo lazy" data-src="img/macedonia/', 17);
    sections('section32', '<img class="allTwo lazy" data-src="img/malta/', 17);
    sections('section33', '<img class="allTwo lazy" data-src="img/moldova/', 17);
    sections('section34', '<img class="allTwo lazy" data-src="img/norway/', 17);
    sections('section35', '<img class="allTwo lazy" data-src="img/poland/', 17);
    sections('section36', '<img class="allTwo lazy" data-src="img/portugal/', 17);
    sections('section37', '<img class="allTwo lazy" data-src="img/romania/', 17);
    sections('section38', '<img class="allTwo lazy" data-src="img/russia/', 17);
    sections('section39', '<img class="allTwo lazy" data-src="img/serbia/', 17);
    sections('section40', '<img class="allTwo lazy" data-src="img/slovakia/', 17);
    sections('section41', '<img class="allTwo lazy" data-src="img/slovenia/', 17);
    sections('section42', '<img class="allTwo lazy" data-src="img/spain/', 17);
    sections('section43', '<img class="allTwo lazy" data-src="img/sweden/', 17);
    sections('section44', '<img class="allTwo lazy" data-src="img/switzerland/', 17);
    sections('section45', '<img class="allTwo lazy" data-src="img/uk/', 17);
    sections('section46','<img class="allTwo lazy" data-src="img/ukraine/', 17);

$(document).ready(function() { 
            $('.categoriesTrigger').click(function() {
                $(this).addClass("active");
                $(this).siblings().removeClass("active");
                $('.categoryView').addClass("active");
                $('.introduction').removeClass("active");
            });


             $('.introTrigger').click(function() {
                $(this).addClass("active");
                $(this).siblings().removeClass("active");
                $('.introduction').addClass("active");
                $('.categoryView').removeClass("active");
            });
        });

      document.addEventListener("DOMContentLoaded", function() {
      let lazyloadImages = document.querySelectorAll("img.lazy");    
      let lazyloadThrottleTimeout;
      
      function lazyload () {
        if(lazyloadThrottleTimeout) {
          clearTimeout(lazyloadThrottleTimeout)
        }    
        
        lazyloadThrottleTimeout = setTimeout(function() {
            let scrollTop = window.pageYOffset;
            lazyloadImages.forEach(function(img) {
                if(img.offsetTop < (window.innerHeight + scrollTop)) {
                  img.src = img.dataset.src;
                  img.classList.remove('lazy')
                }
            })
            if(lazyloadImages.length == 0) { 
              document.removeEventListener("scroll", lazyload)
              window.removeEventListener("resize", lazyload)
              window.removeEventListener("orientationChange", lazyload)
            }
        }, 20)
      }

      document.addEventListener("scroll", lazyload)
      window.addEventListener("resize", lazyload)
      window.addEventListener("orientationChange", lazyload)
    })

  $('a[href*=\\#]:not([href=\\#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
        || location.hostname == this.hostname) {

        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
           if (target.length) {
             $('html,body').animate({
                 scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }
});
