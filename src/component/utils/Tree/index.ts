export interface INode {
    children?: Array<INode>

    [x: string]: any
}

export interface IAction {
    success: boolean,
    data: any
}

export default class TreeUtils {
    /**
     * 进行动作记录
     * 将受到改变的节点进行查询对比从而进行插入
     * @param props
     */
    public static insertActionTree(props: { treeData: Array<INode>, insertNode: INode, getNodeKey: (node: INode) => string | number }): IAction {
        const {treeData, insertNode, getNodeKey} = props;
        const newtreeData: Array<INode> = JSON.parse(JSON.stringify(treeData));
        if (newtreeData && newtreeData.length) {
            newtreeData.some((k, i, a) => {
                if (getNodeKey(k) === getNodeKey(insertNode)) {
                    return true
                } else if (a.length - 1 === i) {
                    newtreeData.push(insertNode)
                }
                return false;
            })
        } else {
            newtreeData.push(insertNode)
        }
        return {
            success: true,
            data: newtreeData
        }
    }

    /**
     * 进行动作记录
     * 将受到改变的节点进行查询对比从而进行删除
     * @param props
     */
    public static deleteActionTree(props: { treeData: Array<INode>, nodeid: string, getNodeKey: (node: INode) => string | number }): IAction {
        const {treeData, nodeid, getNodeKey} = props;
        const newtreeData: Array<INode> = JSON.parse(JSON.stringify(treeData));
        let deleteIndex = -1;
        if (newtreeData && newtreeData.length) {
            newtreeData.some((k, i, a) => {
                if (getNodeKey(k) === nodeid) {
                    deleteIndex = i
                    return true
                }
                return false;
            })
            if (deleteIndex > -1) {
                newtreeData.splice(deleteIndex, 1)
            }
        }
        return {
            success: deleteIndex > -1,
            data: newtreeData
        }
    }

    /**
     * 进行动作记录查询
     * @param props
     */
    public static findActionTree(props: { treeData: Array<INode>, nodeid: string, getNodeKey: (node: INode) => string | number }) {
        const {treeData, nodeid, getNodeKey} = props;
        const newtreeData: Array<INode> = JSON.parse(JSON.stringify(treeData));
        let deleteIndex = -1;
        if (newtreeData && newtreeData.length) {
            newtreeData.some((k, i, a) => {
                if (getNodeKey(k) === nodeid) {
                    deleteIndex = i
                    return true
                }
                return false;
            })
        }
        return {
            success: deleteIndex > -1,
            data: newtreeData
        }
    }

    /**
     * 插入子节点
     * @param props.parentKey 父节点值
     * @param props.treeData 数据
     * @param props.parentKey 父节点
     */
    public static insertChildNode(props: { treeData?: Array<INode>, parentKey: string | number, insertNode: (peersupid: INode) => INode, getNodeKey: (node: INode) => string | number }): any {
        const {treeData, parentKey, insertNode, getNodeKey} = props;
        const newtreeData = JSON.parse(JSON.stringify(treeData));
        const insertChildNodeItem = ({treeDataItem, parentKeyItem, insertNodeItem, getNodeKeyItem}: { treeDataItem?: Array<INode>, parentKeyItem: string | number, insertNodeItem: (peersupid: INode) => INode, getNodeKeyItem: (node: INode) => string | number }): any => {
            if (treeDataItem && treeDataItem.length) {
                treeDataItem.some((k, i, a) => {
                    if (parentKeyItem === getNodeKeyItem(k)) {
                        if (k.children && k.children.length) {
                            const length = k.children.length;
                            const iNode: any = insertNodeItem(k.children[length - 1]);
                            k.children = [
                                ...k.children,
                                ...iNode
                            ]
                        } else {
                            const iNode = insertNodeItem(k);
                            k?.children?.push(iNode)
                        }
                        return true;
                    }
                    if (k.children && k.children.length) {
                        insertChildNodeItem({
                            treeDataItem: k.children,
                            parentKeyItem,
                            insertNodeItem: insertNode,
                            getNodeKeyItem: getNodeKey
                        });
                    }
                    return false;
                })
            }
            return treeDataItem
        };

        return insertChildNodeItem({
            treeDataItem: newtreeData,
            parentKeyItem: parentKey,
            insertNodeItem: insertNode,
            getNodeKeyItem: getNodeKey
        });

    }

    /**
     * 移除子节点
     * @param props.treeData 数据
     * @param props.parentKey 父节点
     */
    public static removeChildNode(props: { treeData?: Array<INode>, removeNode: string | number, getNodeKey: (node: INode) => string | number }): any {
        const {treeData, removeNode, getNodeKey} = props;
        const newtreeData = JSON.parse(JSON.stringify(treeData));
        const removeChildNodeItem = ({treeDataItem, removeNodeItem, getNodeKeyItem}: { treeDataItem?: Array<INode>, removeNodeItem: string | number, getNodeKeyItem: (node: INode) => (string | number) }): any => {
            let deleteIndex = -1;
            if (treeDataItem && treeDataItem.length) {
                treeDataItem.some((k, i, a) => {
                    if (removeNodeItem === getNodeKeyItem(k)) {
                        deleteIndex = i;
                        return true;
                    }
                    if (k.children && k.children.length) {
                        removeChildNodeItem({
                            treeDataItem: k.children,
                            removeNodeItem: removeNode,
                            getNodeKeyItem: getNodeKey
                        })
                    }
                    return false;
                });
                if (deleteIndex > -1) {
                    treeDataItem.splice(deleteIndex, 1)
                }
            }
            return treeDataItem
        };
        return removeChildNodeItem({treeDataItem: newtreeData, removeNodeItem: removeNode, getNodeKeyItem: getNodeKey});
    }

    /**
     * 更新指定节点数据
     * @param props
     */
    public static updataChildNode(props: { treeData?: Array<INode>, updataNode: string | number, newNode: INode, getNodeKey: (node: INode) => string | number }): any {
        const {treeData, updataNode, newNode, getNodeKey} = props;
        const newtreeData = JSON.parse(JSON.stringify(treeData));
        const updataChildNodeItem = ({treeDataItem, updataNodeItem, newNodeItem, getNodeKeyItem}: { treeDataItem?: Array<INode>, updataNodeItem: string | number, newNodeItem: INode, getNodeKeyItem: (node: INode) => string | number }): any => {
            if (treeDataItem && treeDataItem.length) {
                let deleteIndex = -1;
                treeDataItem.forEach((k: any, i, a) => {
                    if (updataNodeItem === getNodeKeyItem(k)) {
                        deleteIndex = i;
                    } else if (k.children && k.children.length) {
                        updataChildNodeItem({
                            treeDataItem: k.children,
                            updataNodeItem: updataNode,
                            newNodeItem: newNode,
                            getNodeKeyItem: getNodeKey
                        })
                    }
                });
                if (deleteIndex > -1) {
                    treeDataItem[deleteIndex] = {
                        ...treeDataItem[deleteIndex],
                        ...newNodeItem
                    }
                }
            }
            return treeDataItem
        }
        return updataChildNodeItem({
            treeDataItem: newtreeData,
            updataNodeItem: updataNode,
            newNodeItem: newNode,
            getNodeKeyItem: getNodeKey
        })
    }

    /**
     * 获取到子节点数量
     */
    public static getChildNodeCount(props: { node?: INode }): number {
        const {node} = props;
        if (node) {
            if (node.children && node.children.length) {
                return node.children.length
            }
        }
        return 0
    }

    /**
     * 查找节点
     * @param props
     * @param props.id 所有id值
     * @param props.idField 匹配的字段
     * @param props.node 所有节点
     */
    public static findNode(props: { id: Array<string>, idField: string, node: Array<INode> }) {
        const {id, idField, node} = props
        const findnodes: any = []
        const find = (nodes: Array<INode> | undefined, idval: string) => {
            if (nodes !== undefined) {
                nodes.forEach((k, i, a) => {
                    if (k[idField] === idval) {
                        findnodes.push(k)
                    }
                    find(k.children, idval)
                })
            }
        }
        id.forEach((k, i, a) => {
            find(node, k)
        })
        return findnodes
    }

    /**
     * 构建 列表转换为树型结构
     * @param props.treeData 节点列表数据
     * @param props.getNodeKey function 节点自身id
     * @param props.getParentKey function 父节点id
     * @param props.getSortKey function 返回 1 或 -1
     */
    public static buildListToTree(props: { treeData: Array<INode>, getNodeKey: (node: INode) => string | number, getParentKey: (node: INode) => string | number, getSortKey: (node: INode, node2: INode) => number }) {
        const {treeData, getNodeKey, getParentKey, getSortKey} = props
        const map = new Map();
        treeData.forEach((k, i, a) => {
            map.set(getNodeKey(k), k);
        })
        treeData.every((k: any, i, a) => {
            const parentKey = getParentKey(k);
            const newVar = map.get(parentKey);
            if (newVar) {
                if (newVar.children && newVar.children.length) {
                    newVar.children = [
                        ...newVar.children,
                        ...k
                    ]
                    newVar.children.sort((i1: any, i2: any) => {
                        return getSortKey(i1, i2)
                    })
                } else {
                    newVar.children = [k]
                }
            }
            return true
        })
        return treeData;
    }


    /**
     * 构建 列表转换为树型结构
     * @param props.treeData 节点列表数据
     * @param props.getNodeKey function 节点自身id
     * @param props.getParentKey function 父节点id
     * @param props.getSortKey function 返回 1 或 -1
     */
    public static buildListToTreeSort(props: { treeData: Array<INode>, getNodeKey: (node: INode) => string | number, getParentKey: (node: INode) => string | number, getPrevId: string }) {
        const {treeData, getNodeKey, getParentKey, getPrevId} = props
        const TreeLinkSort = (id: string, prevId: string, node: Array<INode>): Array<INode> => {
            const map = new Map()
            let rootId = undefined
            node.forEach((k, i, a) => {
                if (k[prevId] === undefined || k[prevId] === '') {
                    rootId = k[prevId]
                }
                map.set(k[prevId], k)
            })
            const SortArray: Array<INode> = []
            const Sort = (prevNodeId?: string) => {
                if (prevNodeId) {
                    const findnode = map.get(prevNodeId)
                    SortArray.push(findnode)
                    Sort(findnode[id])
                }
            }
            Sort(rootId)
            return SortArray;
        }
        const map = new Map();
        treeData.forEach((k, i, a) => {
            map.set(getNodeKey(k), k);
        })
        treeData.every((k: any, i, a) => {
            const parentKey = getParentKey(k);
            const newVar = map.get(parentKey);
            if (newVar) {
                if (newVar.children && newVar.children.length) {
                    newVar.children = [
                        ...newVar.children,
                        ...k
                    ]
                    if (TreeLinkSort) {
                        newVar.children = TreeLinkSort(k.fId, k[getPrevId], newVar.children)
                    }
                } else {
                    newVar.children = [k]
                }
            }
            return true
        })
        return treeData;
    }
}

