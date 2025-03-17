// script.js - ANOV 웹사이트 모듈 로딩 및 초기화

// HTML 모듈 로드 함수
async function loadHTML(selector, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load ' + url);
    const content = await response.text();
    document.querySelector(selector).innerHTML = content;
    
    // 콘텐츠 로드 후 AOS 리프레시
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
    
    // 모듈 로드 상태 업데이트
    updateLoadStatus();
    
    return true;
  } catch (error) {
    console.error(`Error loading ${url}:`, error);
    document.querySelector(selector).innerHTML = `<p>Error loading ${url}</p>`;
    
    // 에러가 발생해도 로드 상태는 업데이트
    updateLoadStatus();
    return false;
  }
}

// 모든 모듈 목록
const modules = [
  { selector: '#nav-placeholder', url: 'nav.html' },
  { selector: '#hero-placeholder', url: 'hero.html' },
  { selector: '#about1-placeholder', url: 'about1.html' },
  { selector: '#services1-placeholder', url: 'services1.html' },
  { selector: '#core-values-placeholder', url: 'core-values.html' },
  { selector: '#case-studies-placeholder', url: 'case-studies.html' },
  { selector: '#services-placeholder', url: 'services.html' },
  { selector: '#process-placeholder', url: 'process.html' },
  { selector: '#pricing-placeholder', url: 'pricing.html' },
  { selector: '#business-services-placeholder', url: 'business-services.html' },
  { selector: '#faq-placeholder', url: 'faq.html' },
  { selector: '#footer-placeholder', url: 'footer.html' }
];

// 로드된 모듈 카운트
let loadedModules = 0;

// 모듈 로드 상태 업데이트 및 완료 확인
function updateLoadStatus() {
  loadedModules++;
  
  // 모든 모듈이 로드되었는지 확인
  if (loadedModules >= modules.length) {
    console.log('All modules loaded successfully');
    initializeAfterLoad();
  }
}

// 모든 모듈이 로드된 후 초기화할 기능
function initializeAfterLoad() {
  // 현재 URL에 해시가 있는 경우 해당 섹션으로 스크롤
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      setTimeout(() => {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        window.scrollTo({
          top: targetElement.offsetTop - navbarHeight,
          behavior: 'smooth'
        });
      }, 500); // 약간의 지연을 두어 모든 것이 준비되도록 함
    }
  }
  
  // 스크롤 이벤트 발생시켜 현재 위치에 맞는 네비게이션 항목 활성화
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 600);
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
  try {
    // AOS 애니메이션 초기화
    AOS.init({
      duration: 800,
      once: true,
      offset: 100, // 애니메이션 트리거 오프셋
      delay: 100, // 애니메이션 시작 지연
      disable: 'mobile' // 모바일에서는 비활성화 (선택 사항)
    });
    
    // 모든 모듈 병렬 로드 (Promise.all 사용)
    Promise.all(modules.map(module => loadHTML(module.selector, module.url)))
      .then(results => {
        console.log(`Loaded ${results.filter(Boolean).length}/${modules.length} modules`);
      })
      .catch(error => {
        console.error('Error loading modules:', error);
      });
    
    // 스크롤 이벤트 감지 (선택 사항)
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      
      // 고정 네비게이션바 효과 (스크롤 시 배경 변경)
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (scrollPosition > 50) {
          navbar.style.padding = '10px 0';
          navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        } else {
          navbar.style.padding = '20px 0';
          navbar.style.boxShadow = 'none';
        }
      }
    });
    
  } catch (error) {
    console.error('초기화 오류:', error);
  }
});