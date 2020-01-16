const MessageReducer = (state={contacts:[],chat:''},action)=>{
    switch (action.type){
        case 'update-contact':
            return {contacts:action.data.contacts,chat:[]}

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

            case 'swap-contact':
                console.log(action.data)
                return{contacts:state.contacts,chat:action.data}
        
            default:
                return state
    }

}

export default MessageReducer