$(function(){
	bannerToggleBotSpace(); // 홍보배너 노출제어 및 하단 영역계산
	pageMoveTop() 			// 문서 최상단 이동 버튼
	favoriteBtn()			// 즐겨찾기 버튼
	mainBnrSlide();			// T200 - 메인배너 슬라이드
	moreBtnToggle() 		// 버튼 클릭 시 토글
	toggleSLide()			// 버튼 클릭 시 토글 - 슬라이드case

// [D] 즐겨찾기 추가/제거
	function favoriteBtn(){
		$('.favorite-btn').on({
			click : function(){
				if($(this).hasClass('added') === true) {
					$(this).removeClass('added');
				}else{
					$(this).addClass('added');
				}
			}
		})
	}// favoriteBtn

// 문서 최상단 이동 버튼
	function pageMoveTop(){
		$('.js-page-top').hide()

		// 페이지 특정 스크롤 값 이동(top 90)이상일 시 버튼 노출
		$(window).on({
			scroll:function(){
				if($(window).scrollTop() > 90){
					$('.js-page-top').fadeIn(300)
				}else{
					$('.page-top').fadeOut(300)
				}
			}
		})
		// 클릭 이벤트
		$('.js-page-top button').on({
			click: function(){
				$('html, body').stop().animate({scrollTop: 0}, 300);
			}
		})
		// 하단 버튼 존재 시 위로가기 버튼 위치 조정
		if($('.js-auto-bottom-space').css('display') === 'block'){
			$('.js-page-top').css('bottom', $('.js-auto-bottom-space').innerHeight() + 8)
		}
	}// pgeMoveTop

// 배너 슬라이드
	function mainBnrSlide(){
		const mainBnrWrap = $('.js-main_bnr-slide');

		// 가맹점 상세 상단 이미지 슬라이드
		if(mainBnrWrap.find('.swiper-slide').length >= 2){
			const swiper = new Swiper('.swiper-container',{
					slidesPerView: 1,
					spaceBetween: 20,
					centeredSlides: true,
					autoplay: false,
					loop : true,
					autoHeight: false,
					pagination: {
					el: ".swiper-pagination",
					type:"fraction",
					clickable: true
				},
			});
		}
	}

//  홍보배너 노출제어 및 하단 영역계산
	function bannerToggleBotSpace(){
		const btnWrap = $('.tiket .js-auto-bottom-space');// 하단 고정 영역
		const bannerView = $('.tiket .js-intro-container');// 배너
		
		$(window).on({
			touchstart : function(e){
				startY = e.originalEvent.touches[0].pageY; //현재 터치 값에 대한 y값을 저장
			},
			touchmove : function(e){
				moveY = e.originalEvent.touches[0].pageY; //현재 터치 값에 대한 y값을 저장
				if(startY < moveY){
					bannerView.slideDown(300);
				}else{
					bannerView.slideUp(300);
				}
				// [D] 하단 버튼영역 크기에 맞춰 여백추가
				setTimeout(function(){
					paddingCalc()
				}, 300)
			}
		});

		paddingCalc(); // 하단 버튼영역 계산 후 스크롤 영역 제어
		function paddingCalc(){
			wrapHeight = btnWrap.innerHeight();
			if(bannerView.css('display') === 'block'){
				$('.tiket').css('padding-bottom', wrapHeight);
			}else{
				$('.tiket').css('padding-bottom', wrapHeight + 32);
			}
		}
	}

	// 더보기 버튼 토글
	function moreBtnToggle(){
		const moreBtn = $('.js-more-btn');

		moreBtn.on({
			click : function(){
				if($(this).parents('.js-more-wrap').hasClass('view')){
					$(this).parents('.js-more-wrap').removeClass('view');
				}else {
					$(this).parents('.js-more-wrap').addClass('view');
				}
			}
		})
	}
	// 토글버튼 - slide
	function toggleSLide(){
		$('.js-toggle .trigger > a').on({
			click: function(){
				$(this).parent().parent().toggleClass('on');
				$(this).parent().next().slideToggle(300)
			}
		});
	}
})