import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './style.scss';

import EmployeeTableHeader from './Header';
import EmployeeTableRow from './Row';
import Spinner from '../Spinner';
import { fetchEmployees, toggleSelectAll, toggleSelectOneRow } from './actions';

class EmployeeTable extends React.Component {
  componentDidMount() {
    this.props.fetchEmployees();
  }

  handleCheckBox = (e, employeeId) => {
    this.props.toggleSelectOneRow(employeeId);
  }

  toggleSelectAll = () => {
    this.props.toggleSelectAll();
  }

  handleRowClick = (id) => {
    this.props.history.push(`/employees/${id}`);
  }

  render() {
    const { isFetching, employees, isFilter, filters, isSelectColumns, isSelectAll } = this.props
    let table;

    if (isFetching) {
      table = (
        <div className='EmployeeTable__spinner-wrap'>
          <Spinner />
        </div>
      )
    } else if (employees && employees.length > 0) {
      let fields = Object.keys(employees[0].data);
      let renderEmployees = employees;

      if (isFilter) {
        renderEmployees = renderEmployees.filter(employee => {
          let check = true;
          const { data } = employee;
          if (filters.name !== '' && !data['Name'].match(new RegExp(filters.name, 'gi')))
            check = false;
          if (filters.employeeid !== '' && !data['Employee ID'].match(new RegExp(filters.employeeid, 'gi')))
            check = false;
          if (filters.positions !== 'Any' && filters.positions !== data['Position'])
            check = false;
          if (filters.departments !== 'Any' && filters.departments !== data['Department'])
            check = false;

          return check;
        })
      }

      table = (
        <>
          <EmployeeTableHeader
            fields={fields}
            showCheckBox={isSelectColumns}
            toggleSelectAll={this.toggleSelectAll}
            isSelectAll={isSelectAll}
          />
          {renderEmployees.map(employee => (
            <EmployeeTableRow
              key={employee.data['Employee ID']}
              employee={employee.data}
              showCheckBox={isSelectColumns}
              handleCheckBox={this.handleCheckBox}
              isSelected={employee.isSelected}
              handleRowClick={this.handleRowClick}
            />
          ))}
        </>
      )
    }

    return (
      <div className='EmployeeTable' >
        {table}
      </div>
    )
  }
}

const mapState = state => ({
  employees: state.EmployeeTable.listEmployees,
  isFetching: state.EmployeeTable.isFetching,
  isSelectColumns: state.EmployeeTable.isSelectColumns,
  isSelectAll: state.EmployeeTable.isSelectAll,
  isFilter: state.SideFilter.showSideFilter,
  filters: state.SideFilter.filters
});

const mapDispatch = dispatch => ({
  fetchEmployees: () => dispatch(fetchEmployees()),
  toggleSelectOneRow: (employeeId) => dispatch(toggleSelectOneRow(employeeId)),
  toggleSelectAll: () => dispatch(toggleSelectAll())
});

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(EmployeeTable)
);
