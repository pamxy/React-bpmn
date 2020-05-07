import * as React from 'react';
import {
    ImageCardView,
    ImageCardViewSelectDelte,
    ImageCardViewUpdataDelete,
    ImageCardViewUploader,
    ImageViewer
} from '@imageManager/index';
import {LoadPanel} from '@component/loadPanel';
import LongPanel from '@component/longPanel';
import {ImageUploaderLibraryGroup, ImageUploaderCard} from '@common/imageUploader';


export default class Index extends React.Component {
    public state = {
        loader: true,
        baz: ''
    }

    public obj = {
        foo: {
            bar: {
                baz: 42
            }
        }
    };

    public componentDidMount(): void {
        const baz = this.obj?.foo?.bar?.baz;
        setTimeout(() => {
            this.setState({
                loader: false,
                baz
            })
        }, 950000)
    }

    public render() {
        return (
            <LoadPanel hideLoader={this.state.loader}>
                <LongPanel>
                    <span>查看器-加载显示图片</span>
                    <div style={{height: 380, width: 380}}>
                        <ImageViewer ImageUrl={'https://www.isofts.org/wp-content/uploads/001-1099.jpg'}/>
                    </div>
                    <span>查看器-加载图片</span>
                    <div style={{height: 280, width: 280}}>
                        <ImageViewer/>
                    </div>

                    <span>基础控件 ImageCardViewSelectDelte</span>
                    <div style={{height: 550, width: 480}}>
                        <ImageCardViewSelectDelte fileUrl={'https://www.isofts.org/wp-content/uploads/001-1099.jpg'}/>
                        <ImageCardViewSelectDelte fileUrl={''}/>
                    </div>

                    <span>基础控件ImageCardViewUploader</span>
                    <div style={{height: 550, width: 480}}>
                        <ImageCardViewUploader fileUrl={'https://www.isofts.org/wp-content/uploads/001-1099.jpg'}/>
                        <ImageCardViewUpdataDelete/>
                    </div>

                    <span>基础控件</span>
                    <div style={{height: 550, width: 480}}>
                        <ImageCardView fileUrl={'https://www.isofts.org/wp-content/uploads/001-1099.jpg'}/>
                        <ImageCardView/>
                    </div>

                    <span>封装的上传组件</span>
                    <div style={{height: 550, width: 680}}>
                        <ImageUploaderCard width={450} height={250}/>
                        <ImageUploaderLibraryGroup maxSize={1}
                                                   isDragDisabled={true}
                                                   fileUrl={['https://www.isofts.org/wp-content/uploads/001-1099.jpg']}/>
                        <ImageUploaderLibraryGroup maxSize={5}
                                                   fileUrl={['https://www.isofts.org/wp-content/uploads/001-1099.jpg']}/>
                    </div>


                </LongPanel>
            </LoadPanel>
        )
    }
}
