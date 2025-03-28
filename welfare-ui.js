$(function(){

    // 클릭 이벤트 리스너
    $(document).on('click', function(e){
        let target = $(e.target);
        // 드롭다운 박스
        if(target.closest('.js-drop-trigger, .js-select-content').length > 0){
            dropDownHandler(target) // 드롭다운 메뉴
        }
        if(target.closest('.js-popup-select').length > 0){
            selectHandler(target)
        }

        tabHandler(target); // 탭

        // 팝업 핸들러
        activeModalHandler(target);
    })// 클릭 이벤트 리스너

    tabHandler(); // 탭
    formHandler(); // formHandler
    setTimeout(function(){
        containerBottomSpace(); // 컨테이너 하단 여백
    }, 150)

    // 디바이스 탐지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;

    // 스크롤 제어 관련 변수
    let isScrolling = false;
    let lastFocusedElement = null;
    let lastHeight = window.innerHeight;
    let scrollTimeout = null;

    // 윈도우 리사이즈(키보드 표시) 감지
    $(window).on('resize', function() {
        if (!isMobile) return; // 모바일 디바이스만 처리

        // 키보드가 활성화되면 윈도우 높이가 줄어듦
        const currentHeight = window.innerHeight;
        
        if (currentHeight < lastHeight) {
            // 키보드가 올라옴
            if (lastFocusedElement) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    scrollToElement(lastFocusedElement);
                    lastHeight = currentHeight; // 키보드가 올라온 상태의 높이 저장
                }, isIOS ? 500 : 300); // iOS는 키패드 표시가 더 느림
            }
        } else if (currentHeight > lastHeight) {
            // 키보드가 내려감
            lastHeight = currentHeight; // 키보드가 내려간 상태의 높이 저장
        }
    });

    // 안전한 스크롤 함수
    function scrollToElement(element) {
        if (isScrolling) return;
        
        isScrolling = true;
        const elementOffset = element.offset().top;
        
        // 플랫폼 별 오프셋 조정
        let scrollOffset = 72;
        if (isIOS) scrollOffset = 72;
        if (isAndroid) scrollOffset = 72;
        
        $('html, body').stop().animate(
            { scrollTop: elementOffset - scrollOffset }, 
            150, 
            function() {
                isScrolling = false;
            }
        );
    }

    // form
    function formHandler(){
        let formItem = $('.js-form-item');
        
        // 입력 요소에 focus 이벤트 직접 바인딩
        formItem.find('input, textarea').on('focus', function() {
            const $this = $(this);
            const $item = $this.closest('.js-form-item');
            
            // 활성 상태 설정
            formItem.removeClass('item--on');
            $item.addClass('item--on');
            
            // 현재 포커스된 요소 저장
            lastFocusedElement = $item;
            
            // 모바일 환경에서만 스크롤 조정
            if (isMobile) {
                // 키패드가 완전히 표시될 때까지 기다림
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    scrollToElement($item);
                }, isIOS ? 300 : 300); // iOS는 키패드 표시가 더 느림
            }
        });
        
        // 포커스 아웃 시 스타일 제거
        formItem.find('input, textarea').on('blur', function() {
            setTimeout(function() {
                // 다른 입력 필드로 포커스가 옮겨진 경우는 제외
                if (!formItem.find('input:focus, textarea:focus').length) {
                    formItem.removeClass('item--on');
                    lastFocusedElement = null;
                }
            }, 10);
        });

        // 컨테이너 클릭 시 입력 필드에 포커스
        formItem.on('click', function(e) {
            const $target = $(e.target);
            const $item = $(this);
            
            // 이미 포커스된 요소 다시 클릭 시 스크롤 방지
            if ($item.hasClass('item--on') && lastFocusedElement && $item.is(lastFocusedElement)) {
                return;
            }
            
            // 입력 영역 클릭 시
            if (
                $target.closest('.input-type--box').length > 0 ||
                $target.closest('.input-type--line').length > 0 ||
                $target.closest('.input-type--textbox').length > 0
            ) {
                // 입력 요소 찾기
                const $input = $target.closest('.input-type--box, .input-type--line, .input-type--textbox').find('input, textarea').first();
                
                if ($input.length) {
                    // 포커스 설정
                    $input.focus();
                    lastFocusedElement = $item;
                }
            }
        });

        // 텍스트박스 플레이스 홀더 제어
        formItem.find('.input-type--textbox').each(function() {
            const container = $(this);
            const textarea = container.find('textarea');
            const placeholder = container.find('.js-placeholder');

            // 입력 시 placeholder 제어
            textarea.on('input', function() {
                if (textarea.val().trim() === '') {
                    placeholder.show(); // 값이 없을 시 placeholder 표시
                } else {
                    placeholder.hide(); // 값 있을 시 placeholder 숨김
                }
            });

            // 초기화: 페이지 로드 시 상태 설정
            if (textarea.val().trim() === '') {
                placeholder.show();
            } else {
                placeholder.hide();
            }
        });
    }// formHandler()

    // 드롭박스
	function dropDownHandler(target){
		let dropBox = $('.js-drop-box');
		let dropContent = $('.js-drop-content');

        // 클린된 버튼이 드롭다운 트리거 일 경우 드롭다운 핸들러 작동.
        if(
            !target.closest(dropBox).hasClass('open') &&
            !target.closest(dropBox).find(dropContent).is(':visible')
        ){
            // 초기화
            target.closest(dropBox).siblings(dropBox).removeClass('open');
            target.closest(dropBox).siblings(dropBox).find(dropContent).slideUp(300);

            // 열림
            target.closest(dropBox).addClass('open')
            target.closest(dropBox).find(dropContent).slideDown(300);
        }else{
            // 닫힘
            target.closest(dropBox).removeClass('open')
            target.closest(dropBox).find(dropContent).slideUp(300);
        }

        // 목록 선택 시 드롭다운 닫기
        if (target.closest('.js-select-content').length > 0) {
            $('.js-select-content .select').removeClass('select')
            target.closest('button').parent().addClass('select');

            // 선택된 항목 처리
            if(target.text() == '직접입력'){
                $('.js-drop-trigger p').text(target.text());
            }else {
                $('.js-drop-trigger p').text('@' + target.text());
            }
        }
	}// dropBoxHandler()

    // 셀렉트 메뉴
    function selectHandler(target){
        // 목록 선택 시 드롭다운 닫기
        if (target.closest('.js-select-content').length > 0) {
            $('.js-select-content').removeClass('select')
            target.closest('button').addClass('select');
            target.closest('button').attr('aria-label', target.text().trim() + ' 선택됨');

            // 선택된 항목 처리
            $('.js-select--result').removeClass('fc-placeholder');
            $('.js-select--result').attr('aria-label', target.text().trim() + ' 설정됨');
            $('.js-select--result .target').text(target.text().trim());
        }
    }

    // 탭
    function tabHandler(target) {

        // 기본 활성화된 버튼으로 target 설정 (파라미터 없을 경우)
        target = target || $('.js-tab-container').find('.js-tab-button.active').first();

        // 문서 내 .js-tab-container 요소가 있는 경우에만 실행
        if (target.parents('.js-tab-container').length > 0) {
            // 현재 타겟이 속한 부모 및 형제 .js-tab-container 요소 가져오기
            let $tabContainer = target.parents('.js-tab-container').add(target.parents('.js-tab-container').siblings('.js-tab-container'));

            // 각 탭 컨테이너에 대해 처리
            $tabContainer.each((idx, box) => {
                let $tabButton = $(box).find('.js-tab-button'); // 해당 컨테이너의 모든 탭 버튼
                let $tabContent = $(box).find('.js-tab-content'); // 해당 컨테이너의 모든 탭 콘텐츠
                let $tabHeader = $(box).find('.js-tab-header');

                // 탭 셀렉터 생성
                let selectorWrap = $tabHeader.find('.tab-button-wrap');
                let tabSelector = `<div class="tab-selector js-tab-selector"><span class="blind" aria-hidden="true">생성된 버튼 셀렉터</span></div>`

                // 버튼 wrap에 셀렉터 없을 시 추가
                if(!selectorWrap.find('.js-tab-selector').length){
                    selectorWrap.append(tabSelector);
                }

                // 활성 탭 상태 초기화.
                $tabButton.filter('.active').each(function() {
                    if(!$tabContent.is(':hidden')){
                        $tabContent.hide(); // 시작단계 초기화
                    }

                    // 활성탭 셀렉터 및 컨텐츠 박스 활성화
                    $(this).siblings('.js-tab-selector').css('left', $tabButton.eq($(this).index()).position().left);
                    $(this).siblings('.js-tab-selector').css('width', $tabButton.eq($(this).index()).innerWidth());
                    $tabContent.eq($(this).index()).show();
                });

                // 클릭된 버튼을 타겟으로 설정
                let containerButtonTarget = target.closest($tabButton);
                let containerTarget = target.closest(box);

                if (containerButtonTarget.length > 0) {
                    // 활성 탭 중복 클릭 방지
                    if (!containerButtonTarget.hasClass('active')) {
                        $tabButton.removeClass('active'); // 기존 active 클래스 제거
                        $tabButton.attr('aria-selected', false); // 기존 aria-selected 'false'로 변경
                        $tabContent.hide(); // 모든 탭 콘텐츠 숨기기
                    }
                    containerButtonTarget.addClass('active'); // 현재 클릭된 버튼에 active 클래스 추가
                    containerButtonTarget.attr('aria-selected', true); // 현재 선택된 버튼 aria-selected 'true'로 변경

                    // js-effect-fade 클래스가 있을 경우 페이드 효과로 콘텐츠 표시
                    const targetIndex = containerButtonTarget.index();
                    if (containerTarget.hasClass('js-effect-fade')) {
                        $tabContent.eq(targetIndex).fadeIn(300);
                    } else {
                        // 선택된 콘텐츠를 바로 표시
                        $tabContent.eq(targetIndex).show();
                    }

                    // 선택된 버튼 위치로 셀렉터 배경 이동
                    $(box).find('.js-tab-selector').css('left', containerButtonTarget.position().left);
                    $(box).find('.js-tab-selector').css('width', containerButtonTarget.innerWidth());
                }
            });
        }
    }// tabHandler(target)

    // 팝업
	function activeModalHandler(target, callback){
		let modalOpenButton = target.closest('.js-popup-open'); // 팝업 호출 버튼 
		let modalCloseButton = target.closest('.js-popup-close'); // 팝업 닫기 버튼
		let modalAddress = $(`.js-popup-wrap[data-modal="${modalOpenButton.attr('data-modal')}"]`); // 팝업 주소
		let modalCloseAddress = modalCloseButton.closest('.active'); // 닫기버튼 누른 팝업 위치의 부모 요소 활성상태일 때 작동

		// 열기버튼 클릭 시 -> 팝업 열고, body 스크롤 잠금
		if(modalOpenButton.length > 0){
			$('body').css('overflow', 'hidden')

			setTimeout(() => {
				modalAddress.addClass('active')

                // 팝업 내 탭 존재 시.
                if($('.js-tab-container').length > 0){
                    tabHandler();
                }
			}, 50)
		}// if(modalOpenButton.length > 0)

		// 닫기버튼 클릭 시 -> 팝업 닫고, body 스크롤 잠금 해제
		if(modalCloseButton.length > 0){
			modalCloseAddress.removeClass('active');
			$('body').css('overflow', '')
		}

        // 팝업 컨테이너 외 영역 클릭 시 -> 팝업 닫고, body 스크롤 잠금 해제
        if ($('.js-popup-wrap.active').length > 0 && !target.closest('.popup-container').length) {
            target.closest('.active').removeClass('active');
			$('body').css('overflow', '')
        }

        // 콜백 실행
        if (typeof callback === 'function') {
            callback();
        }
	}// activeModalHandler(target)

    // 컨테이너 하단 여백 추가
    function containerBottomSpace(){
        // 메인버튼 하단 여백설정 -> 고객확인서
        let $containerWrap = $('.js-container-wrap');
        let $floatingContainer = $('.js-floating-container');

        if($floatingContainer.length && $floatingContainer.css('display') !== 'none'){
            $containerWrap.css('padding-bottom', $floatingContainer.innerHeight() + 32);
        }else {
            $containerWrap.css('padding-bottom', 32);
        }

        // 키패드 있을 시 하단 여백 조정
        if($floatingContainer.find('.payment__myinfo').length > 0){
            $containerWrap.css('padding-bottom', $floatingContainer.innerHeight() + 15);
            console.log('1234')
        }
    }// containerBottomSpace()

    // 데이트피커 호출 위치 뷰포트 넘침방지
    $('.date > input, .date > .btn_cal').on({
        click : function(){
            let btnTopPosition = $(this).offset().top;
            let calendarTopPosition = btnTopPosition - ($('.daterangepicker').innerHeight());

            if(calendarTopPosition < 10){
                $('.daterangepicker').css('top', 10);
            }
        }
    })

    // 비플 커스텀 키패드
    const bepleKeypadBox = $('.js-beple-keypad')
    let bepleKeypad = bepleKeypadBox.find('.keypad');
    let bepleKey = bepleKeypad.find('.key-item')

    // 키패드 클릭 동작
    const bepleKeyAction = () =>{
        bepleKey.on('click', function(){

            $(this).addClass('active')
    
            setTimeout(function(){
                bepleKey.removeClass('active')
            }, 100)
        })
    }// bepleKeyAction()
    // 비플 키패드 클릭 동작
    bepleKeyAction();

    function padInit() {
        const transKeypads = $('.transkey');

        // 각 키패드에 대해 초기화
        transKeypads.each((idx, transKeypad) => {
            const $transKeypad = $(transKeypad);

            // 키패드 초기화
            transkeyPadAction($transKeypad, () => {
                setTimeout(keypadBottomAr, 150)
            });
        });
    }

    function transkeyPadAction(transKeypad, callback) {
        const transKeypadWrap = transKeypad.find('.dv_transkey_div_2');
    
        const transKeypadBtn = transKeypadWrap.children();
        // 기존 클릭 이벤트 제거 (중복 방지)
        transKeypadBtn.off('click');
    
        // 클릭 이벤트 등록
        transKeypadBtn.each((idx, item) => {
            const $btn = $(item);

            $btn.on('click', () => {
                transkeyAction($btn);

                // 특수키는 추가 동작 제외
                if ($btn.attr("aria-label") === "확인" || $btn.attr("aria-label") === "삭제") {
                    return;
                }

                // 무작위 버튼 클릭 동작
                const visibleBtns = transKeypadBtn.filter(":visible").not("[aria-label='확인'], [aria-label='삭제']");
                const filteredBtns = visibleBtns.not($btn);
    
                if (filteredBtns.length > 0) {
                    const randomIndex = Math.floor(Math.random() * filteredBtns.length);
                    const randomBtn = filteredBtns.eq(randomIndex);
                    transkeyAction(randomBtn);
                }
            });
        });
    
        // 콜백 실행
        if (typeof callback === 'function') {
            callback();
        }
    }

    function transkeyAction(target) {
        target.addClass('on');
    
        setTimeout(() => {
            target.removeClass('on');
        }, 100);
    }

    function keypadBottomAr() {
        const transkeyWrap = $('.custom-transkey');
        const transKeys = $('.transkey');
    
        let visibleKeys = transKeys.filter(':visible');
    
        if (visibleKeys.length === 0) {
            // 모든 요소가 hidden이면
            transkeyWrap.find('.container-wrap').css('padding-bottom', 386);
        } else {
            // 하나라도 block이면 가장 높은 height + 28 적용
            let maxKeypadHeight = Math.max(...visibleKeys.map((_, el) => $(el).outerHeight()).get());
            // 최소 높이 382px 적용
            maxKeypadHeight = Math.max(maxKeypadHeight, 386);
            transkeyWrap.find('.container-wrap').css('padding-bottom', maxKeypadHeight + 28);
        }
    }

    function waitForTranskeyAndInit() {
        // requestAnimationFrame 사용하여 성능 최적화
        const checkTranskey = () => {
            if ($('.transkey').length > 0) {
                padInit();
                return;
            }
            requestAnimationFrame(checkTranskey);
        };
        checkTranskey();
    }

    $(document).on('ready', function(){
        if ($('body').hasClass('custom-transkey')) {
            waitForTranskeyAndInit();
        }
    })
});
