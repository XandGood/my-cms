import { defineStore } from "pinia";
import { getCategoryList } from "@/api/category";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    
  }),
  actions: {
    async fetchCategoryList() {
      const res = await getCategoryList();
      return res;
    },
      
  },
  getters: {
      
  }
});