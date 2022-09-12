import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React,{Component} from 'react'
class LandRecordReport extends Component {
    constructor(props) {
        super(props)
        this.state={data:null,selectedRecord:[],headerSelected:false};

    }
    componentWillReceiveProps(nextProps) {
        if(this.props.data != nextProps.data) {
            this.setState({data: nextProps.data});
			if(nextProps.data.length>0) {

				//this.props.onSelected(nextProps.data.map(p=>p.doc_record_id));
				this.setState({selectedRecord:nextProps.data.map(p=>p.doc_record_id)});
			}
        }
    }
    componentDidMount() {

    }
    render() {
        const {data }= this.props;
        if(data == null || data.length == 0) {
            return <div>No Record Found</div>
        }
        return <section className="row" style={{overflowY:'auto',maxHeight:'350px'}}>
                 
        <Table class="table"  >
            <TableHead>
        <TableRow>
			{/* <th><input type="checkbox" name="landrecord" onChange={()=>{
				let selectedRecord = this.state.selectedRecord;
				if(selectedRecord.length > 0) {
					selectedRecord = [];
				} else {
					selectedRecord = data.map(p=>p.doc_record_id);
				}
				this.setState({selectedRecord:selectedRecord},()=>{
					//this.props.onSelected(selectedRecord);
				});
			}}  checked={this.state.selectedRecord.length === data.length}/></th> */}
        	<TableCell></TableCell>
            <TableCell component={'th'}>Parcel
            </TableCell>
            <TableCell component={'th'}>Doc No
            </TableCell>
            <TableCell component={'th'}>Doc Type
            </TableCell>
            <TableCell component={'th'}>Grantor
            </TableCell>
            
            <TableCell component={'th'}>Grantee 
            </TableCell>
            <TableCell component={'th'}>Date </TableCell>
        </TableRow></TableHead>
        <TableBody>
        {(data != undefined && data.length>0 ) &&
            data.map((element,i) => {
                let imgelement = null;
                if(element.transaction_class === 'OWNERSHIP' || element.transaction_class === 'MORTGAGE') {
                     imgelement = require(`../../assets/images/${element.transaction_class}.png`);
                }
                
            return <TableRow>
					{/* <td><input type="checkbox" name="landrecord-checkbox" value={element.doc_record_id}
					onChange={()=>{
						let selectedRecord = this.state.selectedRecord;
						if(selectedRecord.includes(element.doc_record_id)) {
							selectedRecord = selectedRecord.filter(p=>p!==element.doc_record_id);
						} else {
							selectedRecord.push(element.doc_record_id);
						}
						this.setState({selectedRecord:selectedRecord},()=>{
							//this.props.onSelected(selectedRecord);
						});
					}} checked={this.state.selectedRecord.indexOf(element.doc_record_id)>-1}/></td>
                 */}
                    <TableCell>  {imgelement !== null &&
                    <img src={imgelement} title={element.transaction_class} alt={element.transaction_class} height="24px" width="24px" />
                    }</TableCell>
                    <TableCell style={{whiteSpace:'nowrap'}}>
                    
                    {element.parcel_sea}
                    
                    </TableCell>
                    <TableCell>
                      <a target='_blank' >{element.docno}</a>
                    </TableCell>
                    <TableCell>
                        {element.doc_type}
                    </TableCell>
                    <TableCell>
                        {element.grantor}
                    </TableCell>
                    <TableCell>
                        {element.grantee}
                    </TableCell>
                    <TableCell style={{whiteSpace:'nowrap'}}>
                        {element.recorded_date}
                    </TableCell>
                </TableRow>
            })
        }
        {(data == undefined || data.length == 0 ) &&
           <TableRow>
               <TableCell component={'td'} colspan="6" style={{textAlign:'center', fontWeight:'bold',fontSize:'larger'}}>
                   No Record Found</TableCell>
            </TableRow>
        }
        </TableBody>
        </Table>
        </section>
        
    }

}

export default LandRecordReport