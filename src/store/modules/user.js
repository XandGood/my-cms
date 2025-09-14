import { defineStore } from "pinia";
import { getUser} from "@/api/user"

export const useUserStore = defineStore('user',{
  state: () => ({

  }),

  actions: {
    async getUserList() {
      const res = await getUser();
      return res;
    },
  },

  getters: {
  
  },
})