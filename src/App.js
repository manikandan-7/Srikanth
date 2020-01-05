import React from 'react';
import './App.css';
import Header from './components/Header'
import Contents from './components/Contents'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state={weather:{},
        city:'Coimbatore, IN',
        key:localStorage.getItem('key')
        }
}
componentDidMount(){
    console.log(this.state.city)
    fetch('http://api.openweathermap.org/data/2.5/forecast?q=coimbatore,in&APPID='+this.state.key)
    .then(res => res.json())
    .then(res =>{
        this.setState({weather:res})
    })
}
componentDidUpdate(){
  fetch('http://api.openweathermap.org/data/2.5/forecast?q='+this.state.city+'&APPID='+this.state.key)
  .then(res => res.json())
  .then(res =>{
      this.setState({weather:res})
  })
}

Accept=(city)=>{
  console.log(city)
  this.setState({
    city:city
  })
}


  render()
  {
      return (
      <div className="App">
        <Header update={this.Accept} weather={this.state.weather}/>
        <Contents weather={this.state.weather}/>
      </div>
    );
  }
}

export default App;
