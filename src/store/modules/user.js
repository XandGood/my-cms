import { defineStore } from "pinia";
import { getUser,  updateUser, deleteUser } from "@/api/user"
import { getUserById, getUserByPage, searchUser } from "../../api/user";


export const useUserStore = defineStore('user',{
  state: () => ({

  }),

  actions: {
    async getUserList() {
      const res = await getUser();
      return res;
    },

    async fetchUpdateUser(data) {
      const res = await updateUser(data);
      return res;
    },

    async fetchDeleteUser(id) {
      const res = await deleteUser(id);
      return res;
    },
    
    async fetchGetUserByPage(page,size) {
      const res = await getUserByPage(page, size);
      return res;
    },

    async fetchSearchUser(keyword){
      const res = await searchUser(keyword);
      return res;
    },

    async fetchGetUser(id) {
      const res = await getUserById(id);
      return res;
    }
  },
  getters: {
  
  },
})