
import { ref, onMounted, onUnmounted} from 'vue';

/**
 * 监听全局滚动的无限滚动 Hook（适用于整个页面滚动）
 * @param {Function} fetchFn - 加载数据的函数，需返回 Promise，resolve 数据数组
 * @param {Object} options - 配置项
 * @param {number} options.threshold - 距离底部多少 px 触发加载（默认 100）
 * @param {boolean} options.immediate - 初始化时是否立即加载第一页（默认 true）
 * @returns {Object} 
 *   - list: 合并后的列表数据
 *   - isLoading: 是否正在加载
 *   - hasMore: 是否还有更多数据
 *   - loadMore: 手动触发加载的函数
 *   - reset: 重置列表（用于搜索、筛选等场景）
 */
export function useWindowInfiniteScroll(fetchFn, {
  threshold = 150,
  immediate = true
} = {}) {
  // 列表数据
  const list = ref([]);
  // 加载状态（防止重复请求）
  const isLoading = ref(false);
  // 是否还有更多数据
  const hasMore = ref(true);
  // 当前页码（可根据实际接口调整，也可由外部传入）
  const currentPage = ref(1);

  // 核心：判断是否需要加载更多（全局滚动逻辑）
  const checkScroll = () => {
    // 加载中或无更多数据时，不执行
    if (isLoading.value || !hasMore.value) return;

    // 全局滚动的关键计算
    const scrollY = window.scrollY; // 已滚动的距离（顶部隐藏部分）
    const clientHeight = document.documentElement.clientHeight; // 视口高度
    const scrollHeight = document.documentElement.scrollHeight; // 页面总高度
    // 当“已滚动距离 + 视口高度” >= “页面总高度 - 阈值”时，触发加载
    if (scrollY + clientHeight >= scrollHeight - threshold) {
      loadMore();
    }
  };

  // 防抖处理（避免 scroll 事件频繁触发）
  const debouncedCheck = (() => {
    let timer = null;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(checkScroll, 100); // 100ms 防抖
    };
  })();

  // 加载更多数据
  const loadMore = async () => {
    if (isLoading.value || !hasMore.value) return;

    isLoading.value = true;
    try {
      // 调用外部传入的接口函数，传入当前页码（可根据实际需求调整参数）
      const data = await fetchFn(currentPage.value);
      if (data.length === 0) {
        // 没有更多数据
        hasMore.value = false;
      } else {
        // 合并新数据
        list.value = [...list.value, ...data];
        // 页码自增
        currentPage.value++;
      }
    } catch (error) {
      console.error('数据加载失败：', error);
      // 失败时不关闭加载状态，允许用户再次触发（或根据需求调整）
    } finally {
      isLoading.value = false;
    }
  };

  // 重置列表（用于搜索、筛选等场景，重新从第1页加载）
  const reset = () => {
    list.value = [];
    currentPage.value = 1;
    hasMore.value = true;
    // 重置后立即加载第一页
    loadMore();
  };

  // 监听窗口大小变化（窗口 resize 时可能需要重新计算）
  const handleResize = () => {
    // 窗口大小改变时，重新检查一次滚动位置
    debouncedCheck();
  };

  // 挂载时监听全局滚动和窗口 resize
  onMounted(() => {
    window.addEventListener('scroll', debouncedCheck);
    window.addEventListener('resize', handleResize);

    // 初始化时是否立即加载
    if (immediate) {
      loadMore();
    }
  });

  // 卸载时移除事件监听（避免内存泄漏）
  onUnmounted(() => {
    window.removeEventListener('scroll', debouncedCheck);
    window.removeEventListener('resize', handleResize);
  });

  return {
    list,
    isLoading,
    hasMore,
    loadMore,
    reset
  };
}
