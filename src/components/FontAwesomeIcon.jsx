import React from 'react';



const FontAwesomeicon = ({icon,tone="duotone",size='lg'}) => {
	return <i className={`fa-${tone} fa-${size} fa-${icon}`} style={{"--fa-primary-color": 'blue', "--fa-secondary-color": 'green',marginRight:'3px'}} />
}

export default FontAwesomeicon;