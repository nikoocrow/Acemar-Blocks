import '@splidejs/splide/css';
import Splide from '@splidejs/splide';

(function() {
    function initSplide() {
        const sliders = document.querySelectorAll('.acemar-hero-slider .splide');
        
        if (sliders.length === 0) {
            console.log('Acemar: No se encontraron sliders');
            return;
        }

        console.log('Acemar: Inicializando ' + sliders.length + ' slider(s)');

        sliders.forEach(function(slider) {
            try {
                const slidesCount = slider.querySelectorAll('.splide__slide').length;
                
                console.log('Acemar: Detectados ' + slidesCount + ' slides');
                
                if (slidesCount === 1) {
                    slider.closest('.acemar-hero-slider').classList.add('single-slide');
                }
                
                const splideConfig = {
                    type: slidesCount > 1 ? 'loop' : 'slide',
                    autoplay: slidesCount > 1,
                    interval: 5000,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    speed: 800,
                    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                    arrows: slidesCount > 1,
                    pagination: slidesCount > 1,
                    drag: slidesCount > 1,
                    keyboard: slidesCount > 1,
                    trimSpace: false,
                    focus: 'center',
                    updateOnMove: true,
                };

                new Splide(slider, splideConfig).mount();
                
                console.log('Acemar: Slider inicializado correctamente');
            } catch (error) {
                console.error('Acemar: Error al inicializar slider:', error);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSplide);
    } else {
        initSplide();
    }
})();