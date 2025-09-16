import { defineStore } from "pinia";
import { getArticles , getArticlesByDateRange, getArticlesByPage, updateArticle, addArticle, deleteArticle, getArticleById} from "../../api/articles";

export const useArticlesStore = defineStore("articles", {
  state: () => ({
    totalArticlesCount: 0,
    monthlyArticleCounts: [], // 存储近一年每个月的文章数量
    monthLabels: [], // 存储月份标签
    nextId: null,
    article: {
      title: "",
      content: "",
      categoryId: "",
      author: "",
      date: "",
      status: "",
    },
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

     async getArticlesListByPage( page, limit,categoryId) {
      const res = await getArticlesByPage(page, limit, categoryId);
      return res;
     },

     async editArticle(data) {
      const res = await updateArticle(data);
      return res;
     },
     async createArticle(data) {
      const res = await addArticle(data);
      return res;
     },

     async deleteArticleById(id) {
      const res = await deleteArticle(id);
      return res;
     },

     async fetchArticleById(id) {
      const res = await getArticleById(id);
      return res;
     },

     resetArticle() {
      const article = {
        title: "",
        content: "",
        categoryId: "",
        authorId: "",
        status: "",
        createAt: ""
     }
     return article;
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

    //统计每个分类下文章的数量
    async getArticleCountsByCategory() {
      const res = await getArticles();
      const categories = {};
      res.forEach((article) => {
        const categoryId = article.categoryId; // 使用categoryId而不是category
        if (categories[categoryId]) {
          categories[categoryId]++;
        } else {
          categories[categoryId] = 1;
        }
      });
      
      // 返回分类ID和对应数量的对象
      return categories;
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