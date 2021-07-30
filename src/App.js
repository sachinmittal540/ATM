import React, { Component } from 'react';
import { Card, Tag, Input, Checkbox, Select, message, Table } from 'antd';
import 'antd/dist/antd.css';

const { Search } = Input;
const { Option } = Select;
const { Column } = Table;

const availableNotes = [1000, 500, 200, 100, 50, 20, 10];

export class App extends Component {
  state = {
    denomination: false,
    denominationAmount: 0,
    totalAmount: 100000,
    dispatchAmount: 0,
    dispatchedNotes: {},
    indexOfDenominator: 0
  }

  onChange = (e) => {
    this.setState({denomination: e.target.checked, denominationAmount: 0, indexOfDenominator: 0});
  }

  handleChange = (value) => {
    this.setState(
      {
        denominationAmount: parseInt(value),
        indexOfDenominator: availableNotes.indexOf(parseInt(value))
      });
  }

  onDispatch = (value) => {
    const {indexOfDenominator} = this.state;
    let numericValue = parseInt(value);
    this.setState({dispatchAmount: numericValue});
    const newValue = [];
    if (numericValue < 10 || numericValue % 10 !== 0) {
      message.error('Invalid Input, Please retry with a new amount');
      return;
    }
    
    for(let i=indexOfDenominator; i<availableNotes.length; i++) {
      if(numericValue >= availableNotes[i]) {
        const notes = {};
        while(numericValue >=10 && numericValue >= availableNotes[i]) {
          if(newValue.length > 0 && newValue[newValue.length-1].denomination === availableNotes[i]) {
            newValue[newValue.length-1].numberOfNotes += 1;
          } else {
            notes.denomination = availableNotes[i];
            notes.numberOfNotes = 1;
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
      <Card type="inner" style={{ width: 350, textAlign: "center", margin: "20px auto", border: "2px solid black"}}>
        <h2 style={{background: "#1790FF", color: "white"}}>ATM Machine</h2>
        <h4>Available Amount: {totalAmount-dispatchAmount}</h4>

        <p>Available Notes :</p>
        <Tag color="magenta">10</Tag>
        <Tag color="red">20</Tag>
        <Tag color="cyan">50</Tag>
        <br />
        <Tag color="blue">100</Tag>
        <Tag color="green">200</Tag>
        <Tag color="lime">500</Tag>
        <Tag color="purple">1000</Tag>

        <Checkbox onChange={this.onChange} style={{margin: "50px 0"}}>Denomination</Checkbox>
        <Select style={{ width: 80 }} onChange={this.handleChange} size="small" disabled={!denomination}>
          <Option value="10">10</Option>
          <Option value="20">20</Option>
          <Option value="50">50</Option>
          <Option value="100">100</Option>
          <Option value="200">200</Option>
          <Option value="500">500</Option>
          <Option value="1000">1000</Option>
        </Select>

        <Search type="number" placeholder="Amount" allowClear enterButton="Dispatch" size="small" onSearch={this.onDispatch} />

        {
          dispatchedNotes.length > 0 &&
          <Table dataSource={dispatchedNotes} size="small" pagination={false} style={{marginTop: "10px"}}>
            <Column title="Denomination" dataIndex="denomination" key="denomination" />
            <Column title="Number of notes" dataIndex="numberOfNotes" key="numberOfNotes" />
          </Table>
        }
      </Card>
    )
  }
}

export default App