$(function(){
    const viewport = $(window);
    const floatingContainer = $('.js-floating-wrap');   // 플로팅 섹션
    const DEFAULT_SPACE = 32;   // 여백 기본값
    const DEFAULT_ROOT = $(document).find('.container');
    const toastCall = $('.js-toast-call');


    containerBoxHeight();   // 화면 버튼 대응 높이값.
    slideContainer();       // 슬라이드 컨테이너
    dropDownTemp();         // 드롭박스 템플릿
    calendarhandler();      // 캘린더
    toggleHandler();        // 토글
    toolTipHandler();       // 툴팁
    tabHandler();           // 탭
    dataTableSizeTransform(); // 데이터테이블 높이 가변처리
    toastHandler();         // 토스트 호출

    // 목록 추가(동적 리스트) 시 기능(토글, 드롭박스 등)이 필요할경우 해당 컨테이너 추가할 것
    if(
        DEFAULT_ROOT.hasClass('history-container')  || // 결제내역
        DEFAULT_ROOT.hasClass('history-container-2')  // 정산내역
    ){
        $(window).scroll(function(){
            if($(window).scrollTop()+10 >= $(document).height() - $(window).height()){
                setTimeout(function(){
                    dropDownTemp();     // 드롭박스 템플릿
                }, 100)
            }
        })

        // 월선택 캘린더 호출
        $(document).on({
            click : function(e){
                target = $(e.target);
                if(target.parents('button').hasClass('js-calendar-call')){
                    setTimeout(function(){
                        monthCalendarHandler();
                    }, 50)
                }
                if(
                    target.parent().hasClass('prev') ||
                    target.parent().hasClass('next')
                ){
                    dropDownTemp();     // 드롭박스 템플릿
                }
            }
        })
    }// if

    // 옵저버
    $(document).ready(function(observerTarget){
        observerTarget = $('.tel-number-input');

        if(observerTarget.hasClass('tel-number-input') === true){
            observer(observerTarget);
        }
        inputHandler();// 인풋박스
    })// document

    // 레이어팝업 호출 (공통)
    $(document).on({
        click : function(e){
            target = $(e.target),
            modalHandler(target);
        }
    })

    // 검색박스 닫힘버튼 클릭 시 input 포커스 해제 (floating-wrap 클래스와 container 에 search-container 클래스가 일치해야 작동함.)
    if(
        $('.wrap').hasClass('floating-wrap')                        &&
        $('.wrap').find('.container').hasClass('search-container')  
    ){
        $('.hd-btn.close').on({
            click : function(){
                $('.form-item input').focusout();
            }
        })// $('.hd-btn.close')
        $('.btn-floating.on').on({
            click : function(){
                $('.form-item input').focusout();
            }
        })// $('.btn-floating.on')
    }

    // 화면 버튼 대응 높이값.
    function containerBoxHeight(){
        // 기본세팅
        const wrap = $('.js-wrap');                         // 최상위 wrap
        const containerWrap = $('.js-container-wrap');      // 컨테이너 묶음

        floatingSpace();

        floatingContainer.find('.btn-default').on({
            click : function(){
                // wrap.hide();
                // $(this).parents(wrap).next().show();

                setTimeout(function(){
                    if($('body').find('.js-wrap').css('display') === 'none'){
                        floatingSpace();
                    }
                }, 100)
            }
        })// floatingContainer

        // wrap 하단 영역 계산
        function floatingSpace(){
            for(let wrapIndex = 0; wrapIndex < wrap.length; wrapIndex++){
                const floatingContinerHeight = floatingContainer.eq(wrapIndex).innerHeight(); // 플로팅 섹션 높이
                const floatingSpaceCalc = floatingContinerHeight + DEFAULT_SPACE;

                if(wrap.eq(wrapIndex).find('section').hasClass('js-floating-wrap') === true){
                    wrap.eq(wrapIndex).addClass('active');
                    wrap.eq(wrapIndex).find(containerWrap).css('padding-bottom', floatingSpaceCalc);

                    // 플로팅 영역 미노출 시 display 제어
                    setTimeout(() => {
                        if(wrap.eq(wrapIndex).find('.js-floating-wrap').css('display') === 'none'){
                            wrap.eq(wrapIndex).find(containerWrap).css('padding-bottom', DEFAULT_SPACE);
                        }
                    },150)
                }else{
                    wrap.eq(wrapIndex).find(containerWrap).css('padding-bottom', DEFAULT_SPACE);
                    // end container 마지막에 올 때.
                    if(
                        // 완료 실패 등 
                        containerWrap.find('.container-content').next().hasClass('js-end-container') === true ||
                        // 안내문구 있을 시
                        containerWrap.find('.container-content').find('div:last-child').hasClass('infomation-box') === true ||
                        containerWrap.find('.container-content').last().hasClass('infomation-box') === true
                    ){
                        wrap.eq(wrapIndex).find(containerWrap).css('padding-bottom', 0);
                    }// if

                }// else
            }// for
        }// floatingSpace();

        // 화면 최소높이 지정(디바이스 높이값)
        wrap.css('min-height', viewport.height());
    }// endContainerBoxHeight

    // 슬라이드 컨테이너
    function slideContainer(){

        for(let i=0; i < $('.js-slide-container').length;i++){
            $('.js-slide-container').eq(i).append('<div class="swiper-pagination"></div>')

            if($('.js-slide-container').eq(i).find('.js-slide').length > 1){
                $('.js-slide-container').eq(i).addClass('swiper-container');
                $('.js-slide-container').eq(i).find('.js-slide-wrapper').addClass('swiper-wrapper');
                $('.js-slide-container').eq(i).find('.js-slide').addClass('swiper-slide');
            }else {
                $('.js-slide-container').eq(i).removeClass('swiper-container');
                $('.js-slide-container').eq(i).removeClass('swiper-container-horizontal');
                $('.js-slide-container').eq(i).removeClass('swiper-container-android');
                $('.js-slide-container').eq(i).find('.js-slide-wrapper').removeClass('swiper-wrapper');
                $('.js-slide-container').eq(i).find('.js-slide').removeClass('swiper-slide');
                $('.js-slide-container').eq(i).find('.swiper-pagination').hide();
            } 
        }

        bannerSlideContainer();

        function bannerSlideContainer(){
            // 자주묻는 질문일 경우
            if($('.cs-faq-container').find('div').hasClass('js-slide-container')){
                swipeSlideContainer = new Swiper('.js-slide-container.swiper-container',{
                    slidesPerView: 'auto',
                    initialSlide: 0,
                    spaceBetween: 12,
                    autoplay: false,
                    loop : false,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                        bullets: true,
                    },
                }); 
            }else{
                swipeSlideContainer = new Swiper('.js-slide-container.swiper-container',{
                    slidesPerView: 'auto',
                    initialSlide: 0,
                    spaceBetween: 8,
                    autoplay: false,
                    loop : false,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                        bullets: true,
                    },
                });
            }
        }
    }// slideContainer()

    // 드롭박스 템플릿
    function dropDownTemp(){
        // 드롭박스 템플릿용
        const dropTrigger = $('.trigger');
        const dropCon = $('.js-drop-con');

        for(let i=0; i < $('.js-drop-box').length; i++){
            if($('.js-drop-box').eq(i).hasClass('open') === false){
                setTimeout(function(){
                    $('.js-drop-box').find('.js-drop-con').hide(0);
                }, 100)
            }// if
        }// for

        // 드롭박스 템플릿용
        dropTrigger.off('click').on({
            click : function(){
                triggerRoot = $(this).parents('.js-drop-box');

                if(triggerRoot.hasClass('open')){
                    triggerRoot.removeClass('open');
                    triggerRoot.find(dropCon).slideUp(300);
                }else {
                    // 1개만 열려야 하는 유형의 페이지 인 경우
                    if(
                        // 자주찾는 질문
                        $(this).parents().hasClass('cs-faq-wrap') ||
                        // 직원설정
                        $(this).parents().hasClass('employee-main')
                    ){
                        dropCon.stop().slideUp();
                        $('.js-drop-box').removeClass('open');
                    }

                    triggerRoot.addClass('open');
                    triggerRoot.find(dropCon).slideDown(300);
                }
            }
        })// dropTrigger
    }// dropDownTemp();

    // 캘린더 컨트롤러
    function calendarhandler(){
        const calendarDayBtnListJq = $('.day-container .day > button'); //날짜 버튼

        calendarDayBtnListJq.on({
            click: function(){
                const targetBtn = $(this).parent();
                calendarDayBtnListJq.parent().removeClass('select');
    
                if(
                    targetBtn.hasClass('select') ||
                    targetBtn.hasClass('sold-out') ||
                    targetBtn.hasClass('holiday')
                ){
                    targetBtn.removeClass('select');
                }else {
                    targetBtn.addClass('select');
                };
            }
        });
    }// calendarControl();

    // 토글
    function toggleHandler(){
        $('.js-toggle button').on({
            click : function(){
                $(this).parent().toggleClass('on')
            }// click
        })
    }// toggleHandler()

    //툴팁
    function toolTipHandler(){
        const winW = $(window).width();						            // 문서 넓이
        const toolTipBtn = $('.js-tooltip-box .tooltip-btn');	        // 버튼
        const toolTipCon = $('.js-tooltip-box .tooltip-con');		// 툴팁 컨텐츠

        $(window).on({
            click : function(e){
                if($(e.target).hasClass('tooltip-btn')){
                    // clearTimeout(timer) // 타이머

                    // 클릭 시 노출관련 제어
                    if(!$(e.target).parents('.js-tooltip-box').hasClass('view')){
                        $(e.target).parents('.js-tooltip-box').addClass('view');
                        // 툴팁 노출 시 위치제어
                        if($('.js-tooltip-box').length > 0){
                            for(let i = 0; i < $('.js-tooltip-box').length; i++){
                                // 버튼 위치
                                btnPo = toolTipBtn.eq(i).offset().left;					                // 버튼 left 위치
                                btnW = toolTipBtn.eq(i).innerWidth();						            // 버튼 넓이
                                // 툴 팁 컨텐츠 위치
                                tooltipPo = toolTipCon.eq(i).offset().left;				                // 툴 팁 컨텐츠 left 위치
                                toolTipW = toolTipCon.eq(i).innerWidth();					            // 툴 팁 컨텐츠 넓이

                                // 정렬 계산
                                toolTipCenterPo = (btnW - 8) - toolTipW / 2 // 툴 팁 컨텐츠 가운데정렬
                                tooltipRightPo = Math.floor(tooltipPo + toolTipW + toolTipCenterPo);	// 툴 팁 오른쪽 끝 위치값

                                //문서 우측 끝 과 툴 팁 컨텐츠 우측 끝 거리 계산
                                docSpace = winW - tooltipRightPo;

                                // 툴 팁 위치 조정
                                if(docSpace >= 10){
                                    toolTipCon.eq(i).css('left', toolTipCenterPo);
                                }else{
                                    toolTipCon.eq(i).css('left', winW - (toolTipW + tooltipPo));
                                }
                            }// for
                        }// if
                    }else {
                        $(e.target).parents('.js-tooltip-box').removeClass('view');
                        toolTipCon.css('left', 'auto');
                    }
                }
                // 툴팁 닫기
                if($(e.target).hasClass('close-btn')){
                    $('.js-tooltip-box').removeClass('view');
                    toolTipCon.css('left', 'auto');
                }
            }
        })
        
    }// toolTipHandler();

    // 탭
    function tabHandler(){
        const tabContainer = $('.js-tab-container');
        const tabBtnBox = $('.js-tab_btn-box');
        const tabItem = tabContainer.find('.js-tab-content');

        setTimeout(function(){
            tabItem.hide();
            tabItem.eq(0).show();
            tabBtnBox.find('.tab-item').eq(0).addClass('on');
        }, 100)

        tabBtnBox.find('.tab-btn').on({
            click : function(){
                tabBtnNumber = $(this).parent().index();        // 선택한 탭 버튼 번호
                tabNumber = tabItem.eq(tabBtnNumber).index();    // 탭 컨텐츠 번호

                // 탭 버튼 활성화
                tabBtnBox.find('.tab-btn').parent().removeClass('on');
                $(this).parent().addClass('on');

                // 탭 노출 제어
                tabItem.hide();
                tabItem.css('visibility', 'hidden');
                tabItem.eq(tabBtnNumber).css('visibility', 'visible');
                tabItem.eq(tabBtnNumber).show();
            }// click
        })
    }// tabHandler();

    function monthCalendarHandler(){
        for(let i=0; i < $('.js-calendar_slide-container').length;i++){
            $('.js-calendar_slide-container').eq(i).addClass('swiper-container');
            $('.js-calendar_slide-container').eq(i).find('.js-slide-wrapper').addClass('swiper-wrapper');
            $('.js-calendar_slide-container').eq(i).find('.item').addClass('swiper-slide');
        }

        // 화면 로딩 시
        $(document).ready(function(){
            if($('.js-popup-container').find('.popup-content > section').hasClass('month-calendar-container')){
                var yearSelectIndex = $('.js-year_front-container').find('.select').index();
                var monthSelectIndex = $('.js-month_front-container').find('.select').index();
    
                yearSlideContainer(yearSelectIndex);
                monthSlideContainer(monthSelectIndex);
            }
        })

        $('.js-year_front-container, .js-year_back-container').on({
            touchstart : function(){
                startActiveElIndex = $('.js-year_front-container').find('.select').index();
            },
            touchend : function(){
                setTimeout(function(){
                    endActiveElIndex = $('.js-year_front-container').find('.swiper-slide-active').index();

                    if(startActiveElIndex !== endActiveElIndex){
                        $('.js-year_front-container').find('.swiper-slide').removeClass('select');
                        $('.js-year_front-container').find('.swiper-slide').eq(endActiveElIndex).addClass('select');
                    }
                }, 50)
            }
        })
        $('.js-month_front-container, .js-month_back-container').on({
            touchstart : function(){
                startActiveElIndex = $('.js-month_front-container').find('.select').index();
            },
            touchend : function(){
                setTimeout(function(){
                    endActiveElIndex = $('.js-month_front-container').find('.swiper-slide-active').index();

                    if(startActiveElIndex !== endActiveElIndex){
                        $('.js-month_front-container').find('.swiper-slide').removeClass('select');
                        $('.js-month_front-container').find('.swiper-slide').eq(endActiveElIndex).addClass('select');
                    }
                }, 50)
            }
        })

        function yearSlideContainer(idx){
            var frontSlideContainer = new Swiper('.js-year_front-container',{
                initialSlide: idx,
                direction: 'vertical',
                slidesPerView: 'auto',
                centeredSlides: true,
                autoplay: false,
                loop : false,
            });

            var backSlideContainer = new Swiper('.js-year_back-container',{
                initialSlide: idx,
                direction: 'vertical',
                slidesPerView: 'auto',
                centeredSlides: true,
                autoplay: false,
                loop : false,
            });

            frontSlideContainer.controller.control = backSlideContainer;
            backSlideContainer.controller.control = frontSlideContainer;
        }// yearSlideContainer(idx)

        function monthSlideContainer(idx){
            var frontSlideContainer = new Swiper('.js-month_front-container',{
                initialSlide: idx,
                direction: 'vertical',
                slidesPerView: 'auto',
                centeredSlides: true,
                autoplay: false,
                loop : false,
            });

            var backSlideContainer = new Swiper('.js-month_back-container',{
                initialSlide: idx,
                direction: 'vertical',
                slidesPerView: 'auto',
                centeredSlides: true,
                autoplay: false,
                loop : false,
            });

            frontSlideContainer.controller.control = backSlideContainer;
            backSlideContainer.controller.control = frontSlideContainer;
        }// monthSlideContainer(idx)
    }// monthCalendarHandler()

    function inputHandler(){
        // 인풋박스 동작 - 포커스 out, 데이터 유/무, 입력, 클릭 등
        $('.form-box .form-item').on({
            click : function(e){
                target = $(e.target)
                target.find('input').focus();
                targetHandler(target)

                // 플로팅 버튼영역 제어
                if(
                    $(document).find('section').hasClass('js-floating-wrap') === true &&
                    $('.js-floating-wrap').css('display') !== 'none'
                ){
                    $('.js-floating-wrap').hide(); 
                    containerBoxHeight();
                }
            },
            input : function(){
                targetHandler(target)
            },
            focusout : function(){
                $('.form-wrap').removeClass('on');
                $('.form-box').removeClass('on');

                for(let i=0; i < $('.form-box').length; i++){
                    if($('.form-box').eq(i).find('input').val() !== ''){
                        $('.form-box').eq(i).removeClass('on');
                        $('.form-box').eq(i).addClass('ipt');
                    }
                }

                setTimeout(function(){
                    // 플로팅 버튼영역 제어
                    if(
                        $(document).find('section').hasClass('js-floating-wrap') === true &&
                        !$('.form-wrap').hasClass('on')                                   &&
                        !$('.form-box').hasClass('on')
                    ){
                        $('.js-floating-wrap').show();
                        containerBoxHeight();
                    };
                }, 300)
            }
        });

        function targetHandler(target){
            target.parents('.form-box').removeClass('ipt');
            // form-wrap 으로 감싸고 있을 때
            if( 
                target.parents('div').hasClass('form-wrap') === true &&
                target.parents('.form-wrap').hasClass('on') !== true
            ){
                $('.form-wrap').removeClass('on');
                $('.form-box').removeClass('on');
                target.parents('.form-wrap').addClass('on');
            }
            target.parents('.form-box').addClass('on');
        }// targetHandler(target)
    }// inputHandler()

    // 대표번호설정 인풋박스 dom 변화 감지
    function observer(observerTarget){
        let target = observerTarget[0];

        let observer = new MutationObserver((mutations) => {
            inputHandler();
        })

        let option = {
            attributes: true,
            childList: true,
            characterData: true
        };

        observer.observe(target, option);
    }

    // 데이터테이블 높이 가변처리
    function dataTableSizeTransform(){
        const DATAITEMSIZE = 32; // 데이터테이블 높이 기본값.
        const dataTable = $('.table-data');
        let tableItem = dataTable.find('tr');
        
    
        for(let i = 0; i < tableItem.length; i++){
            itemChild = tableItem.eq(i).children();
    
            if(itemChild.innerHeight() > DATAITEMSIZE){
                itemChild.css('padding-top', 8);
                itemChild.css('padding-bottom', 8);
            }
        }// for
    }// dataTableSizeTransform()

    // 레이어팝업 호출 (공통)
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
            $('body').css('overflow', 'hidden')
            layerRoot.show();
        }

        // 닫힘버튼 클릭 시.
        if(
            // 팝업 닫힘
            target.parents('section').hasClass('js-popup-container') === true &&
            // 팝업 닫기버튼 클릭 시.
            target.hasClass('js-popup_close-btn') ||
            target.parent().hasClass('js-popup_close-btn')
        ){
            target.parents('section').hide();

            // 모든 팝업이 닫혔을 때
            if ($('.js-popup-container').filter(':visible').length === 0) {
                $('body').css('overflow', '');
                // 팝업 닫힘 시 하단 여백 계산해서 스크롤영역 추가
                containerBoxHeight();
            }
        }
    }// modalHandler()

    function toastHandler(){
		var timer1, timer2, timer3;
		toastCall.on({
			click : function(){
				clearTimeout(timer1)
				clearTimeout(timer2)
				clearTimeout(timer3)

                if($(this).hasClass('js-mail-copy')){
                    $('.js-toast-wrap').find('.toast-item > .toast-text').text('메일 주소가 복사되었습니다.');
                }

				// 컨테이너 노출
				$('.toast-wrap').addClass('view');
				// 메세지 노출
				timer1 = setTimeout(function(){
					$('.toast-item').addClass('visible');
				}, 10)
				// 메세지 제거
				timer2 = setTimeout(function(){
					$('.toast-item').removeClass('visible');
				}, 1100)
				// 컨테이너 제거
				timer3 = setTimeout(function(){
					$('.toast-wrap').removeClass('view')
				}, 2000)
			}
		})
    }

});