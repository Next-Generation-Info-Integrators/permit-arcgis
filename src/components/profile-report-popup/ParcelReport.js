// import React,{Component} from 'react'
// import p1 from '../../images/p1.png'
// import full from '../../images/full.png'
// import logo from '../../images/logo.png';
// import parcelIcon from '../../images/parcel.png'

// class ParcelReport extends Component {
//     constructor(props) {
//         super(props)
//         this.state={data: null}
//     }
//     componentWillReceiveProps(nextProps) {
//         // if(this.props.data != nextProps.data) {
//         //     this.setState({data: nextProps.data});
//         // }
//     }
//     componentDidMount() {

//     }
//     render() {
//         const {data }= this.props;
		
//         if(data == null) {
//             return <div></div>
//         }
//         return <>
//         <section className="row" >
//          <table className="table" style={{margin:'0px',padding:'0px'}}>
//             <tr>
//                 <td >
//                 <table class="table table-scriped" style={{margin:'0px',padding:'0px'}} >
//                 <tbody>
// 						<tr>
//                         <th>Parcel:</th>
//                         <td colspan="3">{data.description}</td>
//                     </tr>
// 				    <tr>
//                         <th>Owner Name:</th>
//                         <td colspan="3">{data.ownerName}</td>
//                     </tr>
//                     <tr>
//                         <th>Area SM:</th>
//                         <td>{data.area==''?'N/A':data.area}</td>
                        
//                         <th>Zoning:</th>
//                         <td>{data.zoning}</td>
//                     </tr>
//                     <tr>
                    
//                         <th>Assessed Tax Imp Value:</th>
//                         <td>{data.appraisedImpLandValue==''?'N/A':''+new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2,  style: 'currency', currency: 'USD', currencyDisplay: 'symbol'  }).format(data.appraisedImpLandValue)}</td>
//                         <th>Assessed Tax Land Value:</th>
//                         <td>{data.appraisedLandValue==''?'N/A':''+new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2,  style: 'currency', currency: 'USD', currencyDisplay: 'symbol'  }).format(data.appraisedLandValue) }</td>
//                     </tr>
//                     <tr><th>Survey plan:</th>
//                         <td colspan="3">{data.survayPlan==''?'N/A':data.survayPlan}</td>
//                     </tr>
//                 </tbody>
//             </table>
//                 </td>
//             </tr>
//         </table>
//         </section>
//         {(data.features != null && data.features.length > 0) &&
//         <section className="row" style={{overflowY:'auto',maxHeight:'200px'}}>
//         <table class="table table-scriped">
//                             <thead>
//                                 <tr>
//                                     <th style={{width:'30px'}}>S.No.</th>
//                                     <th>Feature</th>
//                                 </tr>    
//                             </thead>
//                             <tbody>
//                             {(data.features!=null) &&
//                                 data.features.map((element,i) => {
//                                     const img = require(`../../images/${element.icon}`)
//                                     return <tr>
//                                     <td>
//                                         {i+1}
//                                     </td>
//                                     <td>
//                                         <img alt={element.featureTypeName} title={element.featureTypeName} src={img} height="24" width="24" />
//                                         {element.feature}
//                                     </td>
//                                 </tr>
//                                 })
//                                 }
//                             </tbody>
//                         </table>
                   
//         </section>
//                     }
        
//         </>
        
//     }

// }

// export default ParcelReport 