import * as React from 'react';
import {Button, Dropdown, Table} from 'rsuite';
import FlexCalcBox from '@component/flexCalcBox';
import {CellIndex} from '@component/table/cell';
import TextSpan from '@component/textSpan';
import HeadPanel from '@component/headPanel';
import './index.scss'
import MarketingOnePrice from './component/marketingOnePrice';
import MarketingLadderPrice from './component/marketingLadderPrice';

const {Column, HeaderCell, Cell} = Table;


export default class MarketingTypeTable extends React.Component {

    public _MarketingOnePrice: MarketingOnePrice | any

    public _MarketingLadderPrice: MarketingLadderPrice | any

    public Columns = [
        {
            HeaderCell: <HeaderCell>编号</HeaderCell>,
            Cell: <CellIndex dataKey="index"/>,
            width: 65,
            fixed: false,
            resizable: false
        },
        {
            HeaderCell: <HeaderCell>名称组合<br/>商品名称(辅助名称)用料名称</HeaderCell>,
            Cell: <Cell dataKey="describe">
                {(rowData: any) => (
                    <TextSpan>
                        限时优惠大礼相送,及时XXXXXX
                    </TextSpan>
                )}
            </Cell>,
            flexGrow: 1,
            width: 300,
            fixed: false,
            resizable: false
        },
        {
            HeaderCell: <HeaderCell>管理</HeaderCell>,
            Cell: <Cell dataKey="url">
                {(rowData: any) => (
                    <Button appearance="ghost">编辑</Button>
                )}
            </Cell>,
            width: 85,
            fixed: false,
            resizable: false
        }
    ]

    public render() {
        return (
            <>
                <MarketingOnePrice ref={ref => this._MarketingOnePrice = ref}/>
                <MarketingLadderPrice ref={ref => this._MarketingLadderPrice = ref}/>
                <HeadPanel hideBorderBottom={true} title={'营销类型列表'}>
                    <div style={{display: 'flex', flex: 1, justifyContent: 'flex-end'}}>
                        <Dropdown title={'产品管理'} trigger="click">
                            <Dropdown.Item onSelect={() => {
                                this._MarketingOnePrice.setShow()
                            }}>新增一口价方案</Dropdown.Item>
                            <Dropdown.Item onSelect={() => {
                                this._MarketingLadderPrice.setShow()
                            }}>新增阶梯价方案</Dropdown.Item>
                            <Dropdown.Item>分类排序</Dropdown.Item>
                        </Dropdown>
                    </div>
                </HeadPanel>
                <FlexCalcBox subHeight={125} Body={(e) => (
                    <Table
                        loading={false}
                        height={e}
                        rowHeight={155}
                        headerHeight={65}
                        autoHeight={false}
                        bordered={true}
                        cellBordered={true}
                        data={[
                            {
                                index: '1'
                            }, {
                                index: '2'
                            }
                        ]}
                    >
                        {
                            this.Columns.map((k: any, i, a) => (
                                <Column width={k.width} align="center" flexGrow={k.flexGrow} colSpan={k.colSpan}
                                        verticalAlign={'middle'} fixed={k.fixed} resizable={k.resizable}>
                                    {k.HeaderCell}
                                    {k.Cell}
                                </Column>
                            ))
                        }
                    </Table>
                )}/>
            </>
        )
    }
}
