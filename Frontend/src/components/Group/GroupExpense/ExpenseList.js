import React, { Component } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment, deleteComment, } from '../../../redux/actions/group/expenseGroupAction';
import { dateTimeFormat } from '../../../utils/utils';

class ExpenseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenseIdx: 0,
      expenseSelect: false,
      addComment: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  addComment = () => {
    const data = {
      expense: this.props.expenses[this.state.expenseIdx]._id,
      comment: this.state.addComment,
      userId: this.props.user._id,
      userName: this.props.user.name,
      group: this.props.group._id,
    }
    this.props.addComment(data);
    this.setState({
      addComment: '',
    });
  }

  deleteComment = (e) => {
    const data = {
      expenseId: this.props.expenses[this.state.expenseIdx]._id,
      commentId: e.target.value,
      group: this.props.group._id,
    }
    if (confirm("Please confirm to delete the note!")) {
      this.props.deleteComment(data);
    }
  }


  displayNotes = (e) => {
    // console.log(e.target.value);
    const idx = e.target.value;
    this.setState({
      expenseIdx: idx,
      // expenseDisplayNote: this.props.expenses[idx],
      expenseSelect: true,
      // notesDisplay: [...this.state.expenses.notes],
    });
  }

  render() {
    const currency = this.props.user.currency;
    const timezone = this.props.user.timezone;
    // console.log(this.props.expenses);
    let expenses = this.props.expenses.map((expense, index) => {
      return(
          <tr>
            {/* <td>{expense.date}</td> */}
            <td>{dateTimeFormat(expense.date, timezone)}</td>
            <td>{expense.description}</td>
            <td>{expense.payor.name} paid</td>
            <td>{numeral(expense.amount).format('0,0.00')} {currency}</td>
            {/* <td><a href={"/group/expense/notes/"+ expense._id}><button type="button" class="btn btn-secondary btn-sm" value={expense._id}>Notes</button></a></td> */}
            <td><button class="btn btn-secondary btn-sm" data-toggle="collapse" data-target="#notes" value={index} onClick={(e)=>this.displayNotes(e)}>Display Notes</button></td>
          </tr>
      )      
    }); 

    return (
      <>
        <h5>Expenses</h5>
        { this.props.expenses.length === 0 && <div class="alert alert-info">No expenses.</div>}
        <table class="table">
          <tbody>
            {expenses}
          </tbody>
        </table>

        {/* collapse to display and add comments */}
        <div id="notes" class="collapse">
          {this.state.expenseSelect ? (
            <div>
              <div class="card">
                <div class="card-header">{this.props.expenses[this.state.expenseIdx].description} {numeral(this.props.expenses[this.state.expenseIdx].amount).format('0,0.00')} {currency}</div>
                {this.props.expenses[this.state.expenseIdx].notes.map(note => 
                  <div class="card-body">
                    <p>{note.comment}</p>
                    <p><i>{note.userName} added on {dateTimeFormat(note.date, timezone)}</i></p>
                    {note.userId === this.props.user._id? (<button class="btn btn-secondary btn-sm" value={note._id} onClick={(e)=>this.deleteComment(e)}>Delete</button>):(<div />)}
                    </div>)}
              </div>
              <form>
                <textarea class="form-control" rows="3" id="comment" name="addComment" onChange={this.handleChange} placeholder="Add a comment.."/>
                <button type="button" className="btn btn-primary" onClick={this.addComment}>Add</button>
              </form>
            </div>
          ) : (<div />)
          }
        </div>
      </>
    );
  }
}

ExpenseList.propTypes = {
  addComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  expenses: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  expenses: state.groupExpense.expenses,
  group: state.groupExpense.group,
  message: state.groupExpense.message,
  user: state.login.user,
});

export default connect(mapStateToProps, { addComment, deleteComment })(ExpenseList);