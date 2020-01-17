const MessageReducer = (state={contacts:[],chat:'',sockets:{}},action)=>{
    switch (action.type){
        case 'update-contact':
            return {contacts:action.data.contacts,chat:[],sockets:state.sockets}

        case 'add-contact':
            var flag=1
            // console.log(state.contacts)
            for(var i=0;i<state.contacts.length;i++){
                if(state.contacts[i].phone===action.data.phone){
                    flag=0
                    break
                }
            }
            if(!flag)
                return state
            else
                return {contacts:state.contacts.concat(action.data),chat:state.chat,sockets:state.sockets}

            case 'swap-contact':
                // console.log(action.data)
                return{contacts:state.contacts,chat:action.data,sockets:state.sockets}
            case 'add-socket':
                var temp = state.sockets
                temp[action.id]=action.data
                return{contacts:state.contacts,chat:state.chat,sockets:temp}
            default:
                return state
    }

}

export default MessageReducer