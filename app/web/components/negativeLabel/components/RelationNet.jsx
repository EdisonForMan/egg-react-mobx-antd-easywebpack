import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Form, Table } from 'antd';
import { toJS } from 'mobx';
export const RELATIONNET_TABLE_HASH = Symbol('relationnet');

@observer
class RelationNet extends Component {
  state = {
    countMap: {
      degreeAll1: '1维关联人数',
      degreeBlacklist1: '1维关联黑名单',
      degreeLoan1: '1维关联放款人数',
      degreeYuqi1: '1维关联逾期人数',
      degreeBad1: '1维关联坏人个数',
      degreeZj1: '1维关联中介标签个数',
      degreeSd1: '1维关联涉毒标签个数',
      degreeQz1: '1维关联欺诈标签个数',
      degreeXy1: '1维关联信用标签个数',
      degreeXd1: '1维关联吸毒标签个数',
      degreeCs1: '1维关联催收标签个数',
      degreeTx1: '1维关联套现表现个数',
      degreeCp1: '1维关联彩票标签个数',
      degreeAll2: '2维关联人数',
      degreeBlacklist2: '2维关联黑名单',
      degreeLoan2: '2维关联放款数',
      degreeYuqi2: '2维关联逾期数',
      degreeBad2: '2维关联坏人个数',
      degreeZj2: '2维关联中介标签个数',
      degreeSd2: '2维关联涉毒标签个数',
      degreeQz2: '2维关联欺诈标签个数',
      degreeXy2: '2维关联信用标签个数',
      degreeXd2: '2维关联吸毒标签个数',
      degreeCs2: '2维关联催收标签个数',
      degreeTx2: '2维关联套现标签个数',
      degreeCp2: '2维关联彩票标签个数',
      cdegreeAll: '群体关联人数',
      cdegreeBlacklist: '群体关联黑名单',
      cdegreeLoan: '群体关联放款数',
      cdegreeYuqi: '群体关联逾期数',
      cdegreeBad: '群体关联坏人个数',
      cdegreeZj: '群体关联中介标签个数',
      cdegreeSd: '群体关联涉毒标签个数',
      cdegreeQz: '群体关联欺诈标签个数',
      cdegreeXy: '群体关联信用标签个数',
      cdegreeXd: '群体关联吸毒标签个数',
      cdegreeCs: '群体关联催收标签个数',
      cdegreeTx: '群体关联套现标签个数',
      cdegreeCp: '群体关联彩票标签个数'
    },
    list: []
  };

  componentDidMount() {
    const { target } = this.props;
    const { countMap } = this.state;
    let list = [];
    for (let t in target) {
      if (countMap[t]) {
        list.push({
          key: countMap[t],
          value: target[t]
        });
      }
    }
    this.setState({ list });
  }

  columns() {
    return [
      {
        title: '统计指标',
        dataIndex: 'key'
      },
      {
        title: '值',
        dataIndex: 'value'
      }
    ];
  }

  render() {
    const { list } = this.state;
    return (
      <div>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={r => r.key}
        />
      </div>
    );
  }
}

export default Form.create()(RelationNet);
