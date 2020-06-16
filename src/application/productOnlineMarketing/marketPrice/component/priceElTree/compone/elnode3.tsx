import * as React from 'react';
import {Col, Grid, Input, InputNumber, InputPicker, Row} from 'rsuite';

interface IProps {
    nodeData?: any

    treedata?: any

    onChange?(value: any): void
}

/**
 *
 * @author lk
 * @date 2020/6/15 21:21
 * @version 1.0
 */
const elnode2 = (props: IProps) => {
    return (
        <div style={{maxWidth: 600}}>
            <Grid fluid={true}>
                <Row>
                    <Col xs={6}>
                        <p>条件满足</p>
                        <InputPicker data={
                            [
                                {value: '继续', label: '继续'},
                                {value: '终止', label: '终止'}
                            ]
                        }/>
                    </Col>
                    <Col xs={9}>
                        <p>提示</p>
                        <Input postfix="%"/>
                    </Col>
                    <Col xs={4}>
                        <p>优先级</p>
                        <InputNumber/>
                    </Col>
                </Row>
            </Grid>
        </div>
    )
}

export default elnode2