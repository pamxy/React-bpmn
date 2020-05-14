import * as React from 'react';
import {
    Button,
    Col,
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    Grid,
    HelpBlock,
    Input,
    InputNumber,
    Modal,
    Row,
    Schema
} from 'rsuite';
import {BigDecimal, RoundingMode} from 'bigdecimal'
import {LoadPanel} from '@component/loadPanel';
import _HookDataConfigList from './compose/_DataConfigList';
import TextRequired from '@component/textRequired';
import {IArrayDatas, IFormValue, IStateFormValue} from '../../index.types';


interface IProps {
    valueKey?: string

    labelKey?: string

    show?: boolean

    /**
     * 编辑id
     */
    id?: string

    /**
     * 窗口显示事件
     * @param id
     * @param callbackData
     */
    onShow?(id?: string, callbackData?: (data: IFormValue, dataConfigList: Array<IArrayDatas>) => void): void

    /**
     * 编辑时间
     * @param id
     * @param data
     * @param callbackCloseLoading
     */
    onEdit?(id: string, data: IFormValue, callbackCloseLoading: () => void): void

    /**
     * 添加时间
     * @param data
     * @param callbackCloseLoading
     */
    onAdd?(data: IFormValue, callbackCloseLoading: () => void): void

    /**
     * 窗口关闭时间
     */
    onClose?(): void
}

interface IState {
    loading: boolean
    hideLoader: boolean
    formValue: IFormValue
    formError: { [x: string]: any },
    /**
     * 配置信息
     */
    dataConfigList?: Array<IArrayDatas>
}

export default class PaperAddEditModel extends React.Component<IProps> {

    private _Forms: any;

    private model = Schema.Model({
        supplier: Schema.Types.StringType()
            .isRequired('不能为空'),
        paperName: Schema.Types.StringType()
            .maxLength(20, '名称长度不大于20个字')
            .minLength(2, '不能最小不能少于2个字')
            .isRequired('名称不能为空'),
        level: Schema.Types.StringType().isRequired('不能为空'),
        type: Schema.Types.StringType().isRequired('不能为空'),
        buyPrice: Schema.Types.NumberType('必须为数值')
            .min(0, '最小值0')
            .max(999999, '最大值999999')
            .isRequired('不能为空'),
        weight: Schema.Types.NumberType('必须为数值')
            .min(0, '最小值0')
            .max(9999, '最大值9999')
            .isRequired('不能为空')
    });

    public state: IState = {
        loading: false,
        hideLoader: false,
        formValue: IStateFormValue,
        formError: {},
        dataConfigList: []
    }

    private _reset = () => {
        this.setState({
            loading: false,
            hideLoader: false,
            formValue: {},
            formError: {}
        })
    }

    private _onShow = () => {
        const {onShow, id} = this.props
        onShow?.(id, (formValue: IFormValue, dataConfigList: Array<IArrayDatas>) => {
            setTimeout(() => {
                this.setState({
                    formValue,
                    dataConfigList,
                    hideLoader: true
                })
            }, 500)
        })
    }


    private _onHide = () => {
        const {loading} = this.state;
        const {onClose} = this.props;
        if (!loading) {
            onClose?.()
        }
    }

    /**
     * {@link handlerPaperAddSave}
     * @private
     */
    private _onSave = () => {
        const {onAdd, onEdit, id} = this.props
        const {formValue} = this.state;
        const hide = () => {
            this.setState({
                loading: false
            }, () => {
                this._onHide()
            })
        }
        if (this._Forms?.check()) {
            this.setState({
                loading: true
            }, () => {
                if (id) {
                    onEdit?.(id, formValue, () => {
                        hide()
                    })
                } else {
                    onAdd?.(formValue, () => {
                        hide()
                    })
                }
            })
        }
    }

    /**
     * form 设置值
     * @param formValues
     * @private
     */
    private _onChangeFormValues = (formValues: any) => {
        /**
         * 计算平方价
         * @private
         */
        const _CalculaSquarePrice = (buyPrice: number = 0, weight: number = 0): string | number => {
            //（buyPrice/1000）×（weight/1000）=1.68（元/m2）
            try {
                const v = {
                    buyPrice: new BigDecimal(String(buyPrice)),
                    weight: new BigDecimal(String(weight)),
                    diff: new BigDecimal('1000')
                }
                const v1 = {
                    buyPrice: v.buyPrice.divide(v.diff, 2, RoundingMode.DOWN()),
                    weight: v.weight.divide(v.diff, 2, RoundingMode.DOWN())
                }
                return v1.weight.multiply(v1.buyPrice).setScale(2, BigDecimal.ROUND_HALF_UP).toString()
            } catch (e) {
                return 0
            }
        }
        const {buyPrice, weight} = formValues
        formValues.squarePrice = _CalculaSquarePrice(buyPrice, weight)
        this.setState({formValue: formValues});
    }

    public render() {
        const {loading, formValue, formError, dataConfigList, hideLoader} = this.state
        const {show} = this.props
        return (
            <Modal
                backdrop={'static'}
                size={'sm'}
                onShow={this._onShow}
                show={show}
                onHide={this._onHide}
                onExited={this._reset}
            >
                <Modal.Header>
                    <Modal.Title>原纸管理窗口</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoadPanel height={350} hideLoader={hideLoader} outrender={true}>
                        <Form
                            ref={(ref: any) => this._Forms = ref}
                            formValue={formValue}
                            formError={formError}
                            fluid={true}
                            model={this.model}
                            onCheck={(formErrors: any) => {
                                this.setState({formError: formErrors});
                            }}
                            onChange={this._onChangeFormValues}
                        >
                            <Grid fluid={true} className={'app-grid-from'}>
                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <_HookDataConfigList {...this.props}
                                                             dataConfigList={dataConfigList}
                                                             name={'supplier'}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={12} md={12}>
                                        <FormGroup>
                                            <TextRequired accepter={ControlLabel}>原纸名称</TextRequired>
                                            <FormControl name="paperName" accepter={Input} autocomplete="off"/>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} sm={12} md={12}>
                                        <FormGroup>
                                            <ControlLabel>卷轴幅宽</ControlLabel>
                                            <FormControl name="reelWidth"
                                                         postfix={'cm'}
                                                         accepter={InputNumber}/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <_HookDataConfigList {...this.props}
                                                             dataConfigList={dataConfigList}
                                                             name={'level'}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <_HookDataConfigList {...this.props}
                                                             dataConfigList={dataConfigList}
                                                             name={'type'}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={8} sm={8} md={8}>
                                        <FormGroup>
                                            <TextRequired accepter={ControlLabel}>进价/吨</TextRequired>
                                            <FormControl name="buyPrice"
                                                         prefix={'￥'}
                                                         postfix={'T'}
                                                         accepter={InputNumber}/>

                                        </FormGroup>
                                    </Col>
                                    <Col xs={8} sm={8} md={8}>
                                        <FormGroup>
                                            <TextRequired accepter={ControlLabel} title={'克重(定量)'}>
                                                <HelpBlock tooltip={true}>
                                                    定量是指纸和纸板单位面积的质量，以克每平方米表示（g/m2）
                                                </HelpBlock>
                                            </TextRequired>
                                            <FormControl name="weight"
                                                         postfix={'g/m²'}
                                                         accepter={InputNumber}/>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={8} sm={8} md={8}>
                                        <FormGroup>
                                            <ControlLabel>平方价
                                                <HelpBlock tooltip={true}>
                                                    进价4800元/吨的面层纸为350克/m2，其每平方价应为<br/>
                                                    （4800/1000）×（350/1000）=1.68（元/m2）<br/>
                                                    计算结果保留两位小数,四舍五入
                                                </HelpBlock>
                                            </ControlLabel>
                                            <FormControl name="squarePrice"
                                                         disabled={true}
                                                         postfix={'元/m2'}
                                                         accepter={InputNumber}/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6} sm={6} md={6}>
                                        <FormGroup>
                                            <ControlLabel>厚度</ControlLabel>
                                            <FormControl name="thickness"
                                                         postfix={'mm'}
                                                         accepter={InputNumber}/>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={6} sm={6} md={6}>
                                        <FormGroup>
                                            <ControlLabel>
                                                紧度
                                                <HelpBlock tooltip={true}>表观密度；紧度D=G/δ；G定量，δ厚度，结果精确到二位小数</HelpBlock>
                                            </ControlLabel>
                                            <FormControl name="density"
                                                         postfix={'g/cm²'}
                                                         accepter={InputNumber}/>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={6} sm={6} md={6}>
                                        <FormGroup>
                                            <ControlLabel>横向环压强度</ControlLabel>
                                            <FormControl name="horizontalPower"
                                                         postfix={'N'}
                                                         accepter={InputNumber}/>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={6} sm={6} md={6}>
                                        <FormGroup>
                                            <ControlLabel>纵向裂断长</ControlLabel>
                                            <FormControl name="verticalPower"
                                                         postfix={'km'}
                                                         accepter={InputNumber}/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Grid>
                        </Form>
                    </LoadPanel>
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="primary" disabled={!hideLoader} loading={loading}
                            onClick={this._onSave}>保存产品</Button>
                    <Button appearance="subtle" onClick={this._onHide}>关闭窗口</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}