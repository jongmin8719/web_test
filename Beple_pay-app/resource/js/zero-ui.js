$(function(){
    // 레이어팝업 호출 (신규 공통)
    function modalHandler(target){
        if(
            target.hasClass('js-popup-btn') ||
            target.parent().hasClass('js-popup-btn')
        ){
            if(target.hasClass('js-popup-btn')){
                callId = target.attr('data-modal');
            }else if(target.parent().hasClass('js-popup-btn')){
                callId = target.parent().attr('data-modal');
            }
            layerRoot = $('.js-popup-container[data-modal="' + callId + '"]');
            layerRoot.show();
        }

        // 닫힘버튼 클릭 시.
        if(
            // 팝업 닫힘
            target.parents('div').hasClass('js-popup-container') === true &&
            // 팝업 닫기버튼 클릭 시.
            target.hasClass('js-popup_close-btn') ||
            target.parent().hasClass('js-popup_close-btn')
        ){
            target.parents('.js-popup-container').hide();
        }
    }// modalHandler()

    // Dom 감시 
    function observer(){
        const ovTarget = document.querySelector('.wrap');
        const observer = new MutationObserver((mutations) => {
            // 팝업 호출시 back 스크롤 잠금/해제
            const jsPopupVisible = $('.js-popup-container:visible').length > 0;
            const layerBPopVisible = $('.layer_bPop:visible').length > 0;
            const layerOverlayVisible = $('.layer_overlay:visible').length > 0;

            if (!jsPopupVisible && !layerBPopVisible && !layerOverlayVisible) {
                $('body').css('overflow', '');
            } else {
                $('body').css('overflow', 'hidden');
            }
            // back 스크롤 잠금/해제
        });

        const config = { 
            attributes: true, 
            characterData: true,
            subtree : true
        };
        observer.observe(ovTarget, config);
    }// observer()

    observer();
    // Dom 감시

    // 레이어팝업 호출 및 페이지 로딩 시 팝업 감지.
    $(document).on({
        click : function(e){
            target = $(e.target),
            modalHandler(target);
        },
        ready : function(){
            if ($('.js-popup-container:visible').length > 0 || $('.layer_bPop:visible').length > 0 || $('.layer_overlay:visible').length > 0) {
            $('body').css('overflow', 'hidden');
            }
        }
    })

});