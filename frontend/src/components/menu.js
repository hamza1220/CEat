import { Button, Modal, InputGroup, FormControl} from 'react-bootstrap';
import React, { Component } from 'react';
// import { setRestaurant } from '../actions/restaurant';
import { connect } from 'react-redux';
import './menu.css'
// import { Link} from 'react-router-dom';


class Menu extends Component {
 	constructor(props){
 		super(props);
 		this.handleShow = this.handleShow.bind(this);
    	this.handleClose = this.handleClose.bind(this);

 		this.state={
 			rest: '',
 			menu: [],
 			show: false,
 			cart: [],
 			location:'',
 			instructions: ''
 		};
 	}
 	handleClose() {
	    this.setState({ show: false });
	}

	handleShow() {
		console.log(this.state.cart)
	   this.setState({ show: true });
	}
	placeOrder(){
		
	}

    
	componentDidMount(){
        var y = String(this.props.location.state.id)
        this.setState({rest: String(this.props.location.state.id)})
        fetch('api/menu', {
	      method: 'POST',
	      body: JSON.stringify({rest: y}),
	      headers: {
	        "Content-Type": "application/json",
	      }
	    })
	    .then(res => {
	      	res.json().then(body => {
		   		let t = ((body))
		       	this.setState({menu: t})
		    }); 
	    })
	}

	addToCart(e,id,name,price)
	{	e.preventDefault()
		this.state.cart.push({item_id: id, name: name, price: price})
	}

	viewCart(e, cart)
	{
		e.preventDefault()
		console.log("Your Shopping Cart", cart)
	}

    render() {
    	var food= []
    	for (var i = this.state.menu.length - 1; i >= 0; i--) {
    		if (this.state.menu[i].category==="Food"){
    			food.push(this.state.menu[i])
    		}
    	}

    	var drinks = []
    	for (var j = this.state.menu.length - 1; j >= 0; j--) {
    		if (this.state.menu[j].category==="Drinks"){
    			drinks.push(this.state.menu[j])
    		}
    	}

    	let c = this.state.cart
    	let total_price = 0;
    	for (var i = c.length - 1; i >= 0; i--) {
    		total_price = total_price + c[i].price
    	}

    	const cart_items = c.map((d,i)=> 
    		<div>
    		{d.name} {d.price}
    		</div>
    		)


    	const food_items = food.map((d,i)=> 
    		<div>
    		<div id= "items" key={i}> 
	    		Name: {d.name} Price: Rs.{d.price}
	 			<button id="b1" onClick = {(e)=> {this.addToCart(e,d.item_id,d.name,d.price)}}> Add to Cart </button>  
    			<br/>
				<br/>
    		</div>
    		<br/>
    		<br/>
    		</div>
    	)

    	const drink_items = drinks.map((d,i)=> 
    		<div>
    		<div id= "items" key={i}> 
	    		Name: {d.name} Price: Rs.{d.price}
	 			<button id="b1" onClick = {(e)=> {this.addToCart(e,d.item_id,d.name,d.price)}}> Add to Cart </button>  
    			<br/>
				<br/>
    		</div>
    		<br/>
    		<br/>
    		</div>
    	)
        return (

            <div>
            <br/><br/><br/>
	            CATEGORY: Food
				{food_items}
				CATEGORY: Drinks
				{drink_items}

            	<Button variant="primary" onClick={this.handleShow}>
		          View Shopping Cart
		        </Button>

		        <Modal show={this.state.show} animation='true' onHide={this.handleClose}>
		          <Modal.Header closeButton>
		            <Modal.Title>Shopping cart for {this.state.rest}</Modal.Title>
		          </Modal.Header>
		          <Modal.Body>

		          {cart_items}
		          Total Order price: {total_price}
{/*Special instructions text box*/}
		         <InputGroup className="mb-3">
				    <InputGroup.Prepend>
				      <InputGroup.Text id="inputGroup-sizing-default">Delivery Location</InputGroup.Text>
				    </InputGroup.Prepend>
				    <FormControl
				    required
				      aria-label="Default"
				      aria-describedby="inputGroup-sizing-default"
				    />
				 </InputGroup>

{/*Deliver instructions text box*/}
		         <InputGroup className="mb-3">
				    <InputGroup.Prepend>
				      <InputGroup.Text id="inputGroup-sizing-default">Special Instructions</InputGroup.Text>
				    </InputGroup.Prepend>
				    <FormControl
				      aria-label="Default"
				      aria-describedby="inputGroup-sizing-default"
				    />
				 </InputGroup>

		          </Modal.Body>
		          <Modal.Footer>
		            <Button variant="secondary" onClick={this.handleClose}>
		              Close
		            </Button>
		            <Button variant="primary" onClick={this.handleClose}>
		              Place Order
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

export default connect(mapStateToProps,  {})(Menu)