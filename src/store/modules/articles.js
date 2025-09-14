import { defineStore } from "pinia";
import { getArticles , getArticlesByDateRange} from "../../api/articles";

export const useArticlesStore = defineStore("articles", {
  state: () => ({
    totalArticlesCount: 0,
    monthlyArticleCounts: [], // 存储近一年每个月的文章数量
    monthLabels: [] // 存储月份标签
  }),
  actions: {
    async getArticlesList() {
      const res = await getArticles();
      return res;
    },

    async getArticlesByMonth(year, month) {
      const startDate = new Date(year, month - 1, 1); // 月份从0开始
      const endDate = new Date(year, month, 0); // 获取该月的最后一天
  
      const res = await getArticlesByDateRange(startDate, endDate);
      return res;
     },

     async getMonthlyArticleCounts() {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      
      // 初始化12个月的数据
      const monthlyCounts = new Array(12).fill(0);
      const labels = [];
      
      // 获取近一年每个月的文章数量
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 月份从1开始
        
        // 生成月份标签
        labels.push(`${year}-${month}`);
        
        // 获取该月的文章数量
        const articles = await this.getArticlesByMonth(year, month);
        monthlyCounts[11 - i] = articles.length;
      }
      
      // 保存到状态
      this.monthlyArticleCounts = monthlyCounts;
      this.monthLabels = labels;
      
      return {
        monthlyCounts,
        labels
      };
    },

     async getArticlesLength() {
      const res = await getArticles();
      this.totalArticlesCount = res.length;
      return res.length;
    }
  },
  getters: {
    gettotalArticlesCount: (state) => state.totalArticlesCount,
    getmonthlyCounts: (state) => state.monthlyArticleCounts,
    getmonthLabels: (state) => state.monthLabels
  },
})