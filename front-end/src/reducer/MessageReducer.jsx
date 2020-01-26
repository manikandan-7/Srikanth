const MessageReducer = (state={contacts:[],chat:'',messages:{},sockets:{},host:'http://127.0.0.1:8080'},action)=>{
    switch (action.type){
        case 'update-contact':
            return {contacts:action.data.contacts, chat:state.chat, messages:state.messages ,sockets:state.sockets,host:state.host}

        case 'add-contact':
            var flag=1
            console.log('reciving ......',action)
            for(var i=0;i<state.contacts.length;i++){
                if(action.data.phone){
                    if(state.contacts[i].phone===action.data.phone){
                        flag=0
                        break
                    }
                }
                else{
                    if(state.contacts[i].name===action.data.name){
                        flag=0
                        break
                    }
                }
            }
            if(!flag)
                return state
            else
                return {contacts:state.contacts.concat(action.data), chat:state.chat, messages:state.messages, sockets:state.sockets,host:state.host}

        case 'swap-contact':
            // console.log(action.data)
            return {contacts:state.contacts, chat:action.data, messages:state.messages, sockets:state.sockets,host:state.host}


        case 'add-socket':
            let temp = state.sockets
            temp[action.id]=action.data
            return {contacts:state.contacts,chat:state.chat, messages:state.messages, sockets:temp, host:state.host}

        case 'set-messages':
            return {contacts:state.contacts,chat:state.chat, messages:action.data, sockets:state.sockets,host:state.host}

        case 'add-message':
            let temp1 = state.messages;
            temp1[action.data.id].push(action.data.payload)
            return {contacts:state.contacts, chat:state.chat, messages:temp1, sockets:state.sockets, host:state.host}

        default:
            return state

            
    }

}

export default MessageReducer