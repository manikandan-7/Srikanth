import React from 'react'


class Header extends React.Component{
    constructor(props){
        super(props)
        this.state={search:'',clicked:false,places:[],place:[]}
    }

    FixLocation=(e)=>{
        console.log(e.element)
        this.setState({
            search:e.element,
            clicked:true
        })
    }

    StartSearch=(e)=>{

        console.log(this.state.search)
        this.props.update(this.state.search)
        // return(true)
    }

    componentDidMount(){
        if(!localStorage.getItem('places')){
            var arr = [];
            async function getweather(){
                let response = await fetch('res/city.list.json');
                let a= await response.json();
                return a;
    }
    
    getweather().then(data => action(data));
        function action(data){
            data.forEach(element =>{
                if (element.country.toLowerCase()==="in")

                arr.push(element.name+', '+element.country);
                

            })
            localStorage.setItem('places',JSON.stringify(arr));

            }
            }

            this.setState({
                places: JSON.parse(localStorage.getItem('places')),
                place:JSON.parse(localStorage.getItem('places'))
            })

    }

    handleChange=(e)=>{
        var a=[]
        this.state.places.forEach(element => {
            if (element.toLowerCase().includes(e.target.value.toLowerCase()))
            {
                a.push(element)
            }
        })
        this.setState({
            search:e.target.value,
            place:a,
            clicked:false
        })
    }

    render() {
        return (
            <div className='header'>
                <input type="search" id='search' autoFocus placeholder="enter city" value={this.state.search} onChange={this.handleChange}/>
                <button onClick={this.StartSearch}>search</button>
                <div className="search-res" id ="search-res"  style={{display:(this.state.search!=='' && !this.state.clicked)?'block':'none'}}>
                    {
                        this.state.place.map(element=><div  onClick={()=>{this.FixLocation({element})}} >{element}</div>)
                    }
                </div>
            </div>
        );
    }
}

export default Header