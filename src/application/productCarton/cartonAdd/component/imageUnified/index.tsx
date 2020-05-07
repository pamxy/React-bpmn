import * as React from 'react';
import {Panel} from 'rsuite'
import {ImageUploaderLibraryGroup} from '@common/imageUploader';
import {IFormValue} from '../../../index.types';

interface IProps {

    formValue: IFormValue

    /**
     * 文件改变
     * @param type
     * @param fileUrl
     */
    onChange?(type: 'main' | 'details', fileUrl: Array<string>): void
}

export default class CartonAddImageUnified extends React.Component<IProps> {

    public state = {}

    public render() {
        const {onChange, formValue} = this.props
        return (
            <>
                <Panel header={'商品主图'} bordered={false} bodyFill={false}>
                    <ImageUploaderLibraryGroup maxSize={5}
                                               onChange={(fileUrl) => {
                                                   onChange?.('main', fileUrl)
                                               }}
                                               fileUrl={formValue?.images?.main ?? []}/>
                </Panel>
                <Panel header={'商品详情'} bordered={false} bodyFill={false}>
                    <ImageUploaderLibraryGroup maxSize={10}
                                               onChange={(fileUrl) => {
                                                   onChange?.('details', fileUrl)
                                               }}
                                               fileUrl={formValue?.images?.details ?? []}/>
                </Panel>
            </>
        )
    }

}
