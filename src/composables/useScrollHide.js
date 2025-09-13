import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollHide() {
  const isHidden = ref(false)
  let lastScrollPosition = 0

  const handleScroll = () => {
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
    
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
  })

  return { isHidden }
}
