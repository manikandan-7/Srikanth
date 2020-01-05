import React from 'react'

function ImageSelect(props){
    var desc = props.desc;
    var source;
    if (desc.toLowerCase().includes('clear')){
        source = '/res/sunny.svg';
    }
    else if (desc.toLowerCase().includes('scattered')){
        source = '/res/sun.svg';
    }
    else if (desc.toLowerCase().includes('rain')){
        source = '/res/storm.svg';
    }
    else{
        source = '/res/cloud.svg';

    }
    return <img src={source} alt='cannot load'></img>
}
export default ImageSelect