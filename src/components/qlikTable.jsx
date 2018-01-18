import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { Table } from 'reactstrap';
import QlikVirtualScroll from './QlikVirtualScroll';

const TableBody = ({ qMatrix, columnWidths }) => (
  <Table className="fixed-table w-100">
    <tbody className="d-block">
      {qMatrix.map(row => (
        <tr
          key={row.reduce((a, b) => (
            a.qElemNumber.toString().concat(b.qElemNumber.toString())))}
          className="d-block"
        >
          {row.map((col, i) => (
            <td key={col.qText} className="d-inline-block" style={{ height: '50px', width: `${columnWidths[i]}%` }}>
              {col.qText}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </Table>
);
TableBody.propTypes = {
  qMatrix: PropTypes.array.isRequired,
  columnWidths: PropTypes.array.isRequired,
};

export default class QlikTable extends React.Component {
  static propTypes = {
    qData: PropTypes.object.isRequired,
    qLayout: PropTypes.object.isRequired,
    offset: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    applyPatches: PropTypes.func.isRequired,
    columnWidths: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      sortColumn: 0,
    };
  }

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }
  componentDidUpdate() {
    this.resize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  @autobind
  async setSortColumn(event) {
    const index = Number(event.target.dataset.index);
    await this.props.applyPatches([{
      qOp: 'replace',
      qPath: '/qHyperCubeDef/qInterColumnSortOrder',
      qValue: JSON.stringify([index]),
    }]);
    this.setState({ sortColumn: index });
  }

  @autobind
  resize() {
    const thead = this.node.getElementsByTagName('thead')[0];
    const tbody = this.node.getElementsByTagName('tbody')[0];
    thead.style.width = `${tbody.clientWidth}px`;
  }

  @autobind
  select(e) {
    this.props.select(Number(e.target.dataset.qElemNumber));
  }

  render() {
    const {
      qData, qLayout, offset, columnWidths,
    } = this.props;
    const labels = [
      ...qLayout.qHyperCube.qDimensionInfo.map(dim => dim.qFallbackTitle),
      ...qLayout.qHyperCube.qMeasureInfo.map(measure => measure.qFallbackTitle),
    ];
    return (
      <div ref={(node) => { this.node = node; }}>
        <Table className="fixed-table w-100 mb-0">
          <thead className="d-block">
            <tr className="d-block">
              {labels.map((label, index) => (
                <th
                  className={`d-inline-block ${index === this.state.sortColumn ? 'active' : null}`}
                  style={{ width: `${columnWidths[index]}%` }}
                  key={label}
                  data-index={index}
                  onClick={this.setSortColumn}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
        </Table>
        <QlikVirtualScroll
          qData={qData}
          qcy={qLayout.qHyperCube.qSize.qcy}
          Component={TableBody}
          componentProps={{ columnWidths }}
          offset={offset}
          rowHeight={50}
          viewportHeight={400}
        />
      </div>
    );
  }
}

