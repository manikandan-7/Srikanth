import React, { Component } from 'react';
import '../index.css';
var t;
// import { wait } from '@testing-library/react';
class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = { action:[], temp:'', trash:'',undoButton:'none', }
        // this.handleadd=this.handleadd.bind(this);
    
    }

    
    handleChange=(e)=>{
        this.setState({
            temp:e.target.value
        })
        
    }
    addElement=(e)=>{
        if (this.state.temp.length>0){
            var temp = this.state.temp;
            var arr = this.state.action;
            arr.push(temp)
            this.setState({
               action:arr,
               temp:''
            })

        }
        else{
            alert('Please enter event and then submit')
        }
    }

    timeout= (e)=>{
        var arr = this.state.action;
        var ind= e.target.id

        if(this.state.trash!==''){
            console.log('force deleting '+this.state.trash)
            var pos=arr.indexOf(this.state.trash)
            arr.splice(pos,1)
        }
        this.setState({
            trash:ind,
            undoButton:'block'
        })
       t = setTimeout(()=>{
        console.log('deleting '+ind)
            ind = arr.indexOf(ind)
            if(ind >=0){
                arr.splice(ind,1)
                this.setState({
                    action:arr
                })
                this.setState({
                    trash:'',
                    undoButton:'none'
                })

            }
        },4000)
        
    }
    clrtimeout=(e)=>{
        this.setState({
            trash:'',
            undoButton:'none'
        })
        console.log('undo',e.target.value)
        clearTimeout(t);
    }
    render() { 
        return (
            <div>
                <input type='text' onChange={this.handleChange} value = {this.state.temp}placeholder='Enter a plan'></input>
                <button onClick={this.addElement}>Add</button>
                <div className='todo-container'>
                    <h3>Your Todo List</h3>
                    <button className="undoButton" id={this.state.trash} onClick={this.clrtimeout} style={{display:this.state.undoButton}}>undo</button> 
                    {this.state.action.map((item) => (
                        <div className='todo-element' id={item} style={{display:item!==this.state.trash ? '':'none'}}>
                            <div className='content'>
                                {item}
                            </div>
                        <button className='del-button' value='' id={item} onClick={this.timeout}>Del</button>
                        
                        </div>
                    ))}
                </div>
                
            </div> 
        );
    }
}
 
export default Todo;