import React, { Component } from 'react';
import { Card, Tag, Input, Checkbox, Select, message, Table } from 'antd';
import 'antd/dist/antd.css';
import data from './components/data.json';

const { Search } = Input;
const { Option } = Select;
const { Column } = Table;

const availableNotes = data.denomination.reverse();

export class App extends Component {
  state = {
    denomination: data.defaultDenomination,
    denominationAmount: data.defaultDenominationAmount,
    totalAmount: data.defaultTotalAmount,
    dispatchAmount: data.defaultdispatchAmount,
    dispatchedNotes: data.defaultDispatchedNotes,
    indexOfDenominator: data.defaultIndexOfDenominator
  }

  handleChange = (value) => {
    this.setState(
      {
        denominationAmount: parseInt(value),
        indexOfDenominator: availableNotes.indexOf(parseInt(value))
      });
  }

  onDispatch = (value) => {
    const {indexOfDenominator, denominationAmount} = this.state;
    let numericValue = parseInt(value);
    this.setState({dispatchAmount: numericValue});
    const newValue = [];

    if(denominationAmount > value) {
      message.warning('Warning: Amount is lower than denomination value');
      return;
    }

    if (numericValue < 10 || numericValue % 10 !== 0) {
      message.error('Invalid Input, Please retry with a new amount');
      return;
    }
    
    for(let i=indexOfDenominator; i<availableNotes.length; i++) {
      if(numericValue >= availableNotes[i]) {
        const notes = {};
        while(numericValue >= 10 && numericValue >= availableNotes[i]) {
          if(newValue.length > 0 && newValue[newValue.length-1].denomination === availableNotes[i]) {
            newValue[newValue.length-1].numberOfNotes += 1;
          } else {
            notes.denomination = availableNotes[i];
            notes.numberOfNotes = 1;
            notes.key = availableNotes[i]+notes.numberOfNotes;
            newValue.push(notes);
          }
          numericValue -= availableNotes[i];    
        }   
      }
    }
    this.setState({dispatchedNotes: newValue});
    return newValue;
  }

  render() {
    const {denomination, totalAmount, dispatchAmount, dispatchedNotes} = this.state;
    return (
      <div>
        <Card type="inner" style={{ width: 350, textAlign: "center", margin: "20px auto", border: "2px solid black"}}>
          <h2 style={{background: "#1790FF", color: "white"}}>ATM Machine</h2>
          <h3>Available Amount: {totalAmount-dispatchAmount}</h3>

          <h4>Available Notes :</h4>
          <div style={{display: "block"}}>
            {
              data.denomination.reverse().map((value, index) => {
                return <Tag color={data.tagColors[index]} key={index}>{value}</Tag>
              })
            }
          </div>

          <Checkbox 
            onChange={(e) => {this.setState({denomination: e.target.checked, denominationAmount: 0, indexOfDenominator: 0});}} 
            style={{margin: "50px 0"}} >Denomination</Checkbox>
          <Select style={{ width: 80 }} onChange={this.handleChange} size="small" disabled={!denomination}>
            {
              data.denomination.map((denomValue, i) => {
                return <Option value={denomValue} key={i}>{denomValue}</Option>
              })
            }
          </Select>

          <Search type="number" placeholder="Amount" enterButton="Withdraw" size="small" onSearch={this.onDispatch} />

          {
            dispatchedNotes.length > 0 &&
            <Table dataSource={dispatchedNotes} size="small" pagination={false} style={{marginTop: "10px"}}>
              <Column title="Denomination" dataIndex="denomination" key="denomination" />
              <Column title="Number of notes" dataIndex="numberOfNotes" key="numberOfNotes" />
            </Table>
          }
        </Card>
      </div>
      
    )
  }
}

export default App