const state = {
    background: "",
    money:"",
    step:1,
  }
  
  const mutations = {
    setBackground(state, val) {
      state.background=val
    },
    setStep(state, val){
      state.step=val
    },
  }
  
  const actions = {
    setBackground({ commit }, val) {
      commit('setBackground', val)
    },
    async setStep({ commit }, val) {
      commit('setStep', val)
    },
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  