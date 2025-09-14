import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollHide() {
  const isHidden = ref(false)
  let lastScrollPosition = 0
  const isScrolling = ref(false)
  let scrollTimer = null

  const handleScroll = () => {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
    isScrolling.value = true
        
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }
    scrollTimer = setTimeout(() => {
      isScrolling.value = false
    }, 700)
    
    if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 15) {
      isHidden.value = true
    } else {
      isHidden.value = false
    }
    
    lastScrollPosition = currentScrollPosition
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimer) {
      clearTimeout(scrollTimer)
    }
  })

  return { isHidden , isScrolling }
}
