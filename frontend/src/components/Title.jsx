import React from "react";

const Title = () => {
    return(
        <div style={{display: 'flex',}}>
            <div style={{
                marginBlock: 20,
                color: '#041200',
                fontWeight: 'bold',
                fontSize: 30,
                backgroundColor: '#68cc45',
                width: '200px',
                paddingInline: 20,
                paddingBlock: 30,
                borderRadius: '0 50px 50px 0',
            }}>
                Live Market
            </div>
            <div style={{
                position: 'absolute',
                right: '0px',
                marginBlock: 20,
                textAlign: 'end',
                color: '#000f28',
                fontWeight: 'bold',
                fontSize: 30,
                backgroundColor: '#3674d9',
                width: '200px',
                paddingInline: 20,
                paddingBlock: 30,
                borderRadius: '50px 0px 0px 50px',
            }}>Prediction</div>
        </div>
        
    )
}

export default Title;