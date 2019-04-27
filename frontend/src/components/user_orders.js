import React, { Component } from 'react';
// import './userscreen.css'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setRestaurant } from '../actions/restaurant';
import { Link, Redirect } from 'react-router-dom';
import './user_orders.css'
import { Button, Modal, Table} from 'react-bootstrap';


class user_orders extends Component {
 	constructor(props){
 		super(props);

 		this.state={
 			orders:'',
            show:false,
 		    currItems: [],
            total:0,
            orderID: null,
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
 	}

    handleClose() {
        this.setState({ show: false, currItems:[], total: 0, orderID:null});
    }

    handleShow(items,id) {
        let total = 0
        for (var i = items.length - 1; i >= 0; i--) {
            total += items[i].price
        }
        this.setState({ show: true, currItems:items, orderID:id, total:total});

    }

    
	componentDidMount(){
        var email = String(this.props.auth.user.email)
        console.log(email);
		fetch('api/orders', {
          method: 'POST',
          body: JSON.stringify({email: email}),
          headers: {
            "Content-Type": "application/json",
          }
        })
	    .then(res => res.json())
	    .then(body =>{
	    	let t = ((body))
            this.setState({orders: t})
	    })
	}

    render() {
        
        var pending= []
        let check1 = true        
        for (var i = this.state.orders.length - 1; i >= 0; i--) {
            if (this.state.orders[i].status!=="delivered"){
                pending.push(this.state.orders[i])
            }
        }
        if (pending.length === 0){
            check1 = false
        }

        var doneOrders= []
        let check2 = true
        for (var i = this.state.orders.length - 1; i >= 0; i--) {
            if (this.state.orders[i].status==="delivered"){
                doneOrders.push(this.state.orders[i])
            }
        }
        if (doneOrders.length === 0){
            check2 = false
        }



        var ord= []
        for (var i = this.state.orders.length - 1; i >= 0; i--) {
            ord.push(this.state.orders[i])
        }
        console.log(ord)

        const pendingOrders = pending.map((d,i) => 
            <div id="orderdiv">
                <div id = "list" key={i}> 
                    <ul id = "uList">
                        <li id = "resName">{d.restaurant_name}&nbsp; Order#: {d.orderID}</li>
                        <li>&nbsp;&nbsp;&nbsp;Order Placed at: &nbsp; {(d.order_time).split('T')[0]} &nbsp;&nbsp; {(parseInt(d.order_time.split('T')[1].split('.')[0])+5)%24 }:{(d.order_time.split('T')[1]).split(':')[1]}:{(d.order_time.split('T')[1]).split(':')[2].split('.')[0]} </li>                            
                        <li>&nbsp;&nbsp;&nbsp;Location: &nbsp; {d.del_location}</li>
                        <li>&nbsp;&nbsp;&nbsp;Instructions: &nbsp;{d.instructions}</li>
                        &nbsp;&nbsp;&nbsp;
                        <div id="btnn">
                        <Button  variant="danger" title="View Bill" onClick={()=>{this.handleShow(d.items, d.orderID)}}>
                            View Bill
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button  variant="secondary" disabled={true} title="Order Status" onClick={this.handleShow}>
                            Status: {d.status}
                        </Button>
                        </div>
                    </ul>
                </div>
            </div>
        )
        const completedOrders = doneOrders.map((d,i) => 
            <div id="orderdiv">
                <div id = "list" key={i}> 
                        <ul id = "uList">
                            <li id = "resName">{d.restaurant_name}&nbsp; Order#: {d.orderID}</li>
                            <li>&nbsp;&nbsp;&nbsp;Order Placed at: &nbsp; {(d.order_time).split('T')[0]} &nbsp;&nbsp; {(parseInt(d.order_time.split('T')[1].split('.')[0])+5)%24 }:{(d.order_time.split('T')[1]).split(':')[1]}:{(d.order_time.split('T')[1]).split(':')[2].split('.')[0]} </li>                            
                            <li>&nbsp;&nbsp;&nbsp;Location: &nbsp; {d.del_location}</li>
                            <li>&nbsp;&nbsp;&nbsp;Instructions: &nbsp;{d.instructions}</li>
                            &nbsp;&nbsp;&nbsp;
                            <Button variant="danger" title="View Bill" onClick={()=>{this.handleShow(d.items, d.orderID)}}>
                                View Bill
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button variant="secondary" disabled={true} title="Order Status" onClick={this.handleShow}>
                                Status: {d.status}
                            </Button>
                        </ul>
                </div>
            </div>
        )


        const view_items = this.state.currItems.map((d,i)=>
            <tr>
                <td> {d.item_id} </td>
                <td> {d.name} </td>
                <td> {d.price} </td>
            </tr>
        )

        const none = (
            <div>
                <h6 id="none"> None </h6>
            </div>
        )

        return (
            <div id = "stuff">
                <div className = "borderx">
                    <h4 className = "heading3">Pending Orders</h4>
                    {check1 ? pendingOrders: none}
                </div>
                <div className = "borderx">
                    <h4 className = "heading3">Completed Orders</h4>
                    {check2 ? completedOrders: none}
                </div>

                <Modal show={this.state.show} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Order Bill for Order# {this.state.orderID}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Table>
                        <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                            <tbody>
                            {view_items}

                            <tr> 
                                <td> </td>
                                <td> <b>Total Order Price</b> </td>
                                <td> <b>{this.state.total}</b> </td>
                            </tr>
                            </tbody>
                    </Table>
                  </Modal.Body> 

                  <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export  default connect(mapStateToProps, {})(user_orders)