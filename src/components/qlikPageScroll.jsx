import React from 'react';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';

export default class QlikPageScroll extends React.Component {
  static propTypes = {
    qSize: PropTypes.object.isRequired,
    qPages: PropTypes.array.isRequired,
    setPages: PropTypes.func.isRequired,
    viewportHeight: PropTypes.number,
    threshold: PropTypes.number,
    tail: PropTypes.number,
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
    viewportHeight: 200,
    threshold: 20,
    tail: 5,
  }

  constructor(props) {
    super(props);

    this.state = {
      scrollTop: 0,
    };
  }

  @autobind
  handleScroll(event) {
    this.setState({ scrollTop: event.target.scrollTop }, () => {
      const qTop = Math.floor(this.state.scrollTop / this.props.threshold);
      const qPages = this.props.qPages.map(qPage => ({ ...qPage, qTop }));
      this.props.setPages(qPages);
    });
  }

  render() {
    return (
      <div style={{ height: `${this.props.viewportHeight}px`, overflowY: 'auto' }} onScroll={this.handleScroll}>
        <div style={{ height: '100%', overflowY: 'hidden', transform: `translateY(${this.state.scrollTop}px)` }}>
          {this.props.children}
        </div>
        <div style={{ height: `${Math.max(0, this.props.threshold * (this.props.qSize.qcy - this.props.tail))}px` }} />
      </div>
    );
  }
}
