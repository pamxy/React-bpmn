import * as React from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {Icon, Popover, Whisper, Dropdown, IconButton, Avatar, Badge} from 'rsuite';
import {RouterHistory, Routes} from '@router';
import Listener from '@listener';
import './tabs.scss'
import {utilsStorage} from '@utils/index';

interface IState {
    activeKey: string
    collapsed: boolean
    /**
     * 选择的Tab
     */
    selectItems: string
    items: Array<{
        id: string
        path: string
        content?: string
    }>
}

export default class HeadTabs extends React.Component<any> {

    public _deviceEventEmitter: any

    public wrapper: any;

    public wrapperheader: any;

    public state: IState = {
        activeKey: 'asd',
        collapsed: false,
        selectItems: '',
        items: []
    }

    private _listen = () => {
        const routerHistory = RouterHistory;
        routerHistory.listen((listener) => {
            const {items} = this.state
            const route = items.find((k, i, a) => k.path === listener.pathname);
            if (route) {
                this.onWheel(`header-tabs-tabitem${route.id}`, route.id)
            } else {
                Routes.every((k, i, a) => {
                    if (listener.pathname === k.path) {
                        items.push({
                            id: k.key,
                            path: listener.pathname,
                            content: k.title
                        })
                        this.setState({items, selectItems: k.key}, () => {
                            utilsStorage.setItem('tabs', JSON.stringify(items))
                        })
                        return false;
                    }
                    return true;
                })
            }
        })
    }

    private _initialization = () => {
        const routerHistory = RouterHistory;
        this._deviceEventEmitter = PubSub.subscribe(Listener.NavMenuSidenav, this._OnCollapsed.bind(this));
        const item = utilsStorage.getItem('tabs');
        const location = routerHistory.location;
        const parse: Array<any> = JSON.parse(item ?? '[]');
        let route = parse.find((k, i, a) => k.path === location.pathname);
        if (!route) {
            const find: any = Routes.find((k, i, a) => k.path === location.pathname);
            if (find) {
                const newroute = {
                    id: find.key,
                    path: find.path,
                    content: find.title
                }
                parse.push(newroute)
                route = newroute
            }
        }
        this.setState({
            items: parse
        }, () => {
            if (route) {
                this.onWheel(`header-tabs-tabitem${route.id}`, route.id)
            } else {

            }
        })
    }

    private _close = (id: string) => {
        const {items} = this.state
        const _items = items.filter((k, i, a) => k.id !== id);
        this.setState({
            items: _items
        }, () => {
            utilsStorage.setItem('tabs', JSON.stringify(_items))
        })
    }

    componentDidMount(): void {
        this._initialization();
        this._listen();
    }

    componentWillMount(): void {
        PubSub.unsubscribe(this._deviceEventEmitter);
    }


    /**
     * 打开关闭
     * @private
     */
    public _OnCollapsed() {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }


    /**
     * 拖动
     * @param result
     */
    public onDragEnd(result: any) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
            const fromarray: any = Array.from(list);
            const [removed] = fromarray.splice(startIndex, 1);
            fromarray.splice(endIndex, 0, removed);
            return fromarray;
        };
        const items = reorder(
            this.state.items,
            //来源index
            result.source.index,
            //放置index
            result.destination.index
        );

        this.setState({
            items
        });
    }

    /**
     * 拖动base样式
     * @param isDraggingOver
     */
    public getListStyle(isDraggingOver: boolean) {
        return (
            {
                background: isDraggingOver ? '#fafafa' : '#fff',
                display: 'flex',
                padding: '0 6px 0 0'
            }
        )
    }

    /**
     * 拖动样式
     * @param isDragging
     * @param draggableStyle
     */
    public getItemStyle(isDragging: boolean, draggableStyle: any) {
        return (
            {
                boxShadow: isDragging ? '5px 5px 10px #888888' : '',
                borderRadius: isDragging ? '4px' : '4px 4px 0 0',
                ...draggableStyle
            }
        )
    }

    /**
     * 滚动条 进行滚动到指定元素
     * @param classname
     * @param id
     */
    public onWheel(classname: string, id: string, callbackWheelEnd?: () => void) {

        const anchorElement: any = document.getElementsByClassName(classname)[0];
        anchorElement.scrollIntoView({block: 'center', inline: 'center', behavior: 'smooth'});
        this.setState({
            selectItems: id
        }, () => {
            callbackWheelEnd?.()
        })
    }

    /**
     * 前后选择
     */
    public onNextPrev(type: 'next' | 'prev') {
        const {selectItems, items} = this.state
        let index: number = -1;
        const tablength: number = items.length
        items?.some((k, i, a) => {
            if (k?.id === selectItems) {
                switch (type) {
                    case 'next':
                        if (i + 1 >= tablength) {
                            index = tablength - 1
                        } else {
                            index = i + 1
                        }
                        break;
                    case 'prev':
                        if (i - 1 <= 0) {
                            index = 0
                        } else {
                            index = i - 1
                        }
                        break
                    default:
                        break
                }
                return true
            }
            return false
        })
        if (index > -1) {
            RouterHistory.push(items[index].path)
            //this.onWheel(`header-tabs-tabitem${items[index].id}`, items[index].id)
        }


    }

    public render() {
        const {selectItems, items} = this.state
        return (
            <div className='header-tabs' ref={ref => {
                this.wrapper = ref;
            }} onContextMenu={(event: any) => {
                event.preventDefault()
                return false
            }}>
                <div className={'header-tabs-box'}>
                    <div style={{display: 'flex'}}>
                        <IconButton appearance="subtle" icon={<Icon icon="th-list"/>} placement="left"
                                    onClick={() => {
                                        Listener.EmitNavMenuSidenav()
                                    }}/>
                        <IconButton appearance="subtle" icon={<Icon icon="arrow-left"/>} placement="left"
                                    onClick={() => {
                                        this.onNextPrev('prev')
                                    }}/>
                    </div>
                    <div style={{display: 'flex', width: 'calc(100% - 162px)'}}>
                        <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                            <Droppable droppableId="droppable" direction="horizontal">
                                {(provided, snapshot) => (
                                    <div
                                        className={`header-tabs-base`}
                                        ref={ref => {
                                            provided.innerRef(ref);
                                            this.wrapperheader = ref
                                        }}
                                        style={this.getListStyle(snapshot.isDraggingOver)}
                                        {...provided.droppableProps}
                                    >
                                        {items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provideds, snapshots) => (
                                                    <div
                                                        className={`header-tabs-tabitem header-tabs-tabitem${item.id} ${selectItems === item.id ? 'header-tabs-tabitem-select' : ''}`}
                                                        role="button"
                                                        ref={provideds.innerRef}
                                                        {...provideds.draggableProps}
                                                        {...provideds.dragHandleProps}
                                                        style={this.getItemStyle(
                                                            snapshots.isDragging,
                                                            provideds.draggableProps.style
                                                        )}
                                                    >
                                                        <div
                                                            className={`header-tabs-tabitem-content header-tabs-tabitem-content${item.id}`}
                                                            onClick={() => {
                                                                RouterHistory.push(item.path)
                                                            }}>{item.content}</div>
                                                        <Icon className={'app-close'} icon={'warning'}
                                                              onClick={() => this._close(item.id)}/>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                    <div style={{display: 'flex'}}>
                        <IconButton appearance="subtle" icon={<Icon icon="arrow-right"/>}
                                    placement="right"
                                    onClick={() => {
                                        this.onNextPrev('next')
                                    }}/>
                        <Whisper
                            trigger="active"
                            placement='bottom'
                            speaker={
                                <Popover title="">
                                    <Dropdown.Menu
                                        style={{
                                            width: 200
                                        }}
                                    >
                                        <Dropdown.Item panel={true} style={{padding: 10, width: 160}}>
                                            <p>Signed in as</p>
                                            <strong>foobar</strong>
                                        </Dropdown.Item>
                                        {
                                            items.map((k, i, a) => (
                                                <>
                                                    {i === 0 ? <Dropdown.Item divider={true}/> : undefined}
                                                    <Dropdown.Item>{k.content}</Dropdown.Item>
                                                </>
                                            ))
                                        }
                                        <Dropdown.Item divider={true}/>
                                        <Dropdown.Item>Help</Dropdown.Item>
                                        <Dropdown.Item>Settings</Dropdown.Item>
                                        <Dropdown.Item>Sign out</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Popover>
                            }
                        >
                            <div className={'header-tabs-basetool'}>
                                <Badge content={55} maxCount={99}>
                                    <Avatar style={{backgroundColor: '#87d068'}} size={'sm'}>
                                        <Icon icon={'gear-circle'}/>
                                    </Avatar>
                                </Badge>
                            </div>
                        </Whisper>
                    </div>
                </div>
            </div>
        )
    }
}
