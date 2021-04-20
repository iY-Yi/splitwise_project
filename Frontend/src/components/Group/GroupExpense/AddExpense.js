import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExpense, getExpense } from '../../../redux/actions/group/expenseGroupAction';

class AddExpense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      amount: -1,
    };
  } 

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  addExpense = () => {
    const data = {
      group: this.props.group._id,
      description: this.state.description,
      amount: this.state.amount,
      payor: this.props.user._id,
      // groupId : this.props.group._id,
      // userId : this.props.user._id,
    }
    this.props.addExpense(data);

    // const groupInfo = {
    //   groupId : this.props.group._id,
    //   userId : this.props.user._id,
    // }
    // this.props.getExpense(groupInfo);
    
    this.setState({
      description: '',
      amount: -1,
    });    
  }


  render() {
    let authorized = true;
    if (this.props.message === 'UNAUTHORIZED') {
      authorized = false;
    }
  
    return (
      <>

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addExpenseModal" disabled={!authorized}>
          Add an expense
        </button>

        {/* Modal to add expense */}
        <div className="modal" id="addExpenseModal">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Add an expense</h5>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>

              <div className="modal-body">
                <form>
                  <label for="group">With you and: </label>
                  <input className="form-control" type="text" id="group" name="group" value={this.props.group.name} disabled />
                  <label>Description</label>
                  <input className="form-control" type="text" id="description" name="description" onChange={this.handleChange} />
                  <label>Amount</label>
                  <input className="form-control" type="number" id="amount" name="amount" onChange={this.handleChange} />
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={this.addExpense} data-dismiss="modal">Save</button>
                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }
}

AddExpense.propTypes = {
  addExpense: PropTypes.func.isRequired,
  getExpense: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  group: state.groupExpense.group,
  message: state.groupExpense.message,
  user: state.login.user,
});

export default connect(mapStateToProps, { addExpense, getExpense })(AddExpense);