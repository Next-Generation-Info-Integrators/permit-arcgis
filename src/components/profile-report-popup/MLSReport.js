// import React,{Component} from 'react'
// import moment from 'moment';
// import logo from '../../images/logo.png';
// import mlsicon from '../../images/mls.png';
// class MLSReport extends Component {
//     constructor(props) {
//         super(props)
//         this.state={data:null}
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
//         return <section className="row" style={{pageBreakAfter: 'always'}}>
//             <h3 className="bg-dark text-dark report-header" ><img src={mlsicon} height="32px"  /> eBLP Guam - MLS Info</h3>
                    
//         <div className="col-md-12">
//         <table class="table table-scriped">
//             <tbody>
//             <tr>
//                 <td rowSpan="7">
//                 <img src={data.url_photo==''?'N/A':data.url_photo} />
//                 </td>
//                 </tr>
//                 <tr>
//                    <th>Street Name:</th>
//                    <td >{data.street_name}</td>
//                 </tr>
//                 <tr>
//                     <th>Street Suffix:</th>
//                     <td >{data.street_suffix}</td>
//                 </tr>
//                 <tr>
//                     <th>Building/House Number:</th>
//                     <td>{data.building_house_no==''?'N/A':data.building_house_no}</td>
//                </tr>
//                <tr>
//                     <th>Living Area:</th>
//                     <td>{data.living_area_sqft}</td>
//                 </tr>
//                 <tr>
//                     <th>Total Bedrooms:</th>
//                     <td>{data.total_bedrooms==''?'N/A':data.total_bedrooms}</td>
//                </tr>
//                <tr> 
//                     <th>Total Bathrooms:</th>
//                     <td>{data.total_bathrooms==''?'N/A':data.total_bathrooms}</td>
//                 </tr>
//                 <tr>
//                     <th>Listing Agent:</th>
//                     <td>{data.listing_agent==''?'N/A':data.listing_agent}</td>
//                 </tr>
//                 <tr>  
//                     <th>Selling Agent:</th>
//                     <td>{data.selling_agent==''?'N/A':data.selling_agent}</td>
//                 </tr>
//                 <tr>
//                     <th>Property Type:</th>
//                     <td>{data.property_type==''?'N/A':data.property_type}</td>
                    
//                     <th>Sold Date:</th>
//                     <td>{data.sold_date==''?'N/A':moment(data.sold_date).format('YYYY/MM/DD')}</td>
//                 </tr>
//                 <tr>
                
//                     <th>List Price:</th>
//                     <td>{data.list_price==''?'N/A':''+new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2,  style: 'currency', currency: 'USD', currencyDisplay: 'symbol'  }).format(data.list_price)}</td>
//                     <th>Sold Price:</th>
//                     <td>{data.sold_price==''?'N/A':''+new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 ,  style: 'currency', currency: 'USD', currencyDisplay: 'symbol'}).format(data.sold_price) }</td>
//                 </tr>
//                 <tr>
//                     <th>Owner Listed on Property Tax:</th>
//                     <td>{data.owner==''?'N/A':data.owner}</td>
//                     <th>Land Area:</th>
//                     <td>{data.landarea==''?'N/A': new Intl.NumberFormat('en-US', ).format(data.landarea)}</td>
                    
//                 </tr>
//                 <tr>
//                     <th>Tax Assessed Improvement Value:</th>
//                     <td>{data.building_v==''?'N/A':new Intl.NumberFormat('en-US', ).format(data.building_v)}</td>
//                     <th>Tax Assessed Value:</th>
//                     <td>{data.land_value==''?'N/A':new Intl.NumberFormat('en-US', ).format(data.land_value)}</td>
                    
//                 </tr>
//                 <tr>
//                 <th>Year Built:</th>
//                     <td>{data.year_built==''?'N/A':data.year_built}</td>
//                     <th>Legal:</th>
//                     <td>{data.legal==''?'N/A':data.legal}</td>
                    
//                 </tr>
                
//             </tbody>
//         </table>
//         </div>
//         <h4 className="bg-dark text-dark report-footer" ><img src={logo} height="32px" /> </h4>
//         </section>
        
//     }

// }

// export default MLSReport