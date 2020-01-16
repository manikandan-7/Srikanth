const ChatReducer = (state={chat:[]},action)=>{
    switch (action.type){
        case 'update-chat':
            return {chat:['hiiiii']}
        case 'add-contact':
            var flag=1
            console.log(state.contacts)
            for(var i=0;i<state.contacts.length;i++){
                if(state.contacts[i].phone===action.data.phone){
                    flag=0
                    break
                }
            }
            if(!flag)
                return state
            else
                return {contacts:state.contacts.concat(action.data),chat:state.chat}
        default:
            return state
    }

}

export default ChatReducer