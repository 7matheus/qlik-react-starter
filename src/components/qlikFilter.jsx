import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import qlikObject from './qlikObject';
import qlikPageScroll from './qlikPageScroll';

export default qlikObject(class qlikFilter extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    layout: PropTypes.object.isRequired,
    qPages: PropTypes.array.isRequired,
    setPages: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    beginSelections: PropTypes.func.isRequired,
    endSelections: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
    };
  }

  @autobind
  toggle() {
    if (!this.state.dropdownOpen) {
      this.props.beginSelections();
    }
    if (this.state.dropdownOpen) {
      this.props.endSelections(true);
    }
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
    const qPages = this.props.qPages.map(qPage => ({ ...qPage, qTop: 0 }));
    this.props.setPages(qPages);
  }

  @autobind
  select(e) {
    this.props.select(Number(e.target.dataset.qElemNumber));
  }

  render() {
    return (
      <Dropdown className="d-inline-block" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          Dropdown
        </DropdownToggle>
        <DropdownMenu onClick={this.select}>
          <SearchList />
          <DropdownItemList
            qMatrix={this.props.data[0].qMatrix}
            qSize={this.props.layout.qListObject.qSize}
            qPages={this.props.qPages}
            setPages={this.props.setPages}
          />
        </DropdownMenu>
        <StateCountsBar layout={this.props.layout} />
      </Dropdown>
    );
  }
});

const DropdownItemList = qlikPageScroll(props => (
  <div>
    {props.qMatrix.map(row =>
        (
          <DropdownItem
            className={`border border-light border-left-0 border-right-0 ${row[0].qState}`}
            key={row[0].qElemNumber}
            data-q-elem-number={row[0].qElemNumber}
            toggle={false}
          >
            {row[0].qText}
          </DropdownItem>
        ))}
  </div>
));
DropdownItemList.propTypes = {
  qMatrix: PropTypes.array.isRequired,
};

const SearchList = () => {
  
}

const StateCountsBar = (props) => {
  const stateCounts = props.layout.qListObject.qDimensionInfo.qStateCounts;
  const totalStateCounts = Object.values(stateCounts).reduce((a, b) => a + b);
  const fillWidth = `${((stateCounts.qOption + stateCounts.qSelected) * 100) / totalStateCounts}%`;
  const barStyle = { position: 'relative', height: '0.25rem' };
  const fillStyle = {
    position: 'absolute', width: fillWidth, height: '100%', transition: 'width .6s ease',
  };
  return (
    <div className="bg-qalternative" style={barStyle}>
      <div className="bg-qselected" style={fillStyle} />
    </div>
  );
};
StateCountsBar.propTypes = {
  layout: PropTypes.object.isRequired,
};
