import * as React from 'react';
import HeadPanel from '@component/headPanel';
import './index.scss'
import FlexCalcBox from '@component/flexCalcBox';
import {utilsObject} from '@utils/index';
import _HookBuildPanelLists from './compose/_HookPanelLists';
import {IArrayDatas} from '../../index.types';

interface IProps {
    valueKey?: string

    labelKey?: string

    onLoad?(callback: (data: Array<IArrayDatas>) => void): void

    onDelItem?(label: string, value: string, reload: () => void): void

    onAddItem?(label: any, value: any, callbackCloseLoading: () => void, reload: () => void): void

    onEditSave?(data: Array<{
        id: string
        title: string
    }>, callbackCloseLoading: () => void, reload: () => void): void


    onLoadEditList?(id?: string, callback?: (v: Array<{
        id: string
        title: string
    }>) => void): void
}

interface IState {
    data: Array<IArrayDatas>
}

export default class BasePaperConfigPanelList extends React.Component<IProps> {

    public state: IState = {
        data: []
    }

    public componentDidMount(): void {
        this._onLoad()
    }

    /**
     * 初始化加载
     * @private
     */
    private _onLoad = () => {
        const {onLoad} = this.props
        onLoad?.((data: Array<IArrayDatas>) => {
            this.setState({
                data
            })
        });
    }

    private _onAddItem = (label: string, value: string, callbackCloseLoading: () => void) => {
        const {onAddItem} = this.props
        onAddItem?.(label, value, callbackCloseLoading, () => {
            this._onLoad();
        })
    }

    /**
     * 删除节点
     * @param label
     * @param value
     * @private
     */
    private _onDelItem = (label: string, value: string) => {
        const {onDelItem} = this.props
        onDelItem?.(label, value, () => {
            this._onLoad();
        })
    }

    /**
     * 保存配置
     * @param data
     * @param callbackCloseLoading
     */
    private _onEditSave = (data: Array<{
        id: string
        title: string
    }>, callbackCloseLoading: () => void) => {
        const {onEditSave} = this.props
        onEditSave?.(data, callbackCloseLoading, () => {
            this._onLoad();
        })
    }

    public _ArrayMerge() {
        const statedata = [
            {
                value: 1,
                label: '供应商',
                children: undefined
            },
            {
                value: 2,
                label: '纸张等级',
                children: undefined
            },
            {
                value: 3,
                label: '原纸类型',
                children: undefined
            }
        ]
        const {data: propsdatas} = this.state
        const {valueKey} = this.props
        if (propsdatas) {
            const map = statedata.map((k: any, i, a) => {
                const find = propsdatas?.find(x => {
                    const {_valueKey} = utilsObject.getLabeValuelKey(this.props, x)
                    k.children = []
                    if (_valueKey) {
                        return _valueKey === k.value
                    }
                    if (x.value) {
                        return x.value === k.value
                    }
                    return false
                });
                if (find && valueKey) {
                    k = {...k, ...find}
                } else if (valueKey) {
                    k[valueKey] = k.value
                }
                return k
            });
            return map;
        }
        return statedata;
    }

    public render() {
        const data = this._ArrayMerge()
        return (
            <div>
                <HeadPanel title={'分类管理'} tooltip={'分类管理'}/>
                <FlexCalcBox overflow={'auto'} Body={() => (
                    <_HookBuildPanelLists
                        {...this.props}
                        data={data}
                        onAddItem={this._onAddItem}
                        onDelItem={this._onDelItem}
                        onEditSave={this._onEditSave}/>
                )}/>
            </div>
        )
    }
}

