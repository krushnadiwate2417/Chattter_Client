import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name : "user",
    initialState : {
        user : null,
        allUsers : [],
        allChats : [],
        selectedChat : null,
        messages : [],    
    },
    reducers : {
        setUser : (state,action)=>{state.user = action.payload},
        setAllUsers : (state,action)=>{state.allUsers = action.payload},
        setAllChats : (state,action)=>{state.allChats = action.payload},
        setSelectedChat : (state,action)=>{state.selectedChat = action.payload},
        setMessages: (state,action)=>{state.messages = action.payload},
    }
})

export const { setUser, setAllUsers, setAllChats, setSelectedChat, setMessages } = userSlice.actions;
export default userSlice.reducer;