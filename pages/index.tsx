import React from "react"
import {GetStaticProps} from "next"
import prisma from "../lib/prisma"
import {Corresponds, Document, Executor} from "../types/Document"
import {Checkbox, DatePicker, Table, Tabs, Tag} from "antd"
import styles from "./styles.module.css"
import moment, {Moment} from "moment"
import {ColumnsType} from "antd/es/table"

interface BlogProps {
    docs: Document[]
    executors: Executor[]
    corresponds: any[]
}

const Blog: React.FC<BlogProps> = ({docs, executors, corresponds}) => {
    const {RangePicker} = DatePicker
    const [date, setDate] = React.useState<[Moment, Moment]>([undefined, undefined])
    const [finishDate, setFinishDate] = React.useState<[Moment, Moment]>([undefined, undefined])
    const [onlyFinished, setOnlyFinished] = React.useState<boolean>(false)

    const columns: ColumnsType<Document> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Название",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Содержание",
            dataIndex: "description",
            key: "description"
        },
        {
            title: "Дата создания",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => moment(text).format("DD.MM.YYYY, HH:mm")
        },
        {
            title: "Должен быть выполнен",
            dataIndex: "must_be_finished_at",
            key: "must_be_finished_at",
            render: (text: string) => moment(text).format("DD.MM.YYYY, HH:mm")
        },
        {
            title: "Выполнен",
            dataIndex: "finished_at",
            key: "finished_at",
            render: (text: string) => {
                console.log()
                return text ? <Tag color={"green"}>{moment(text).format("DD.MM.YYYY, HH:MM")}</Tag> :
                    <Tag color={"red"}>Не выполнен</Tag>
            },
            filters: [
                {
                    text: "Выполнен",
                    value: "finished"
                },
                {
                    text: "Не выполнен",
                    value: "not_finished"
                }
            ],
            // @ts-ignore
            onFilter: (value: string, record) => {
                return value === "finished" ? record.finished_at : !record.finished_at
            }
        },
        {
            title: "Имя исполнителя",
            dataIndex: "executor_id",
            key: "executor_id",
            render: (text: string) => {
                const executor = executors.find(executor => executor.id === text)
                return executor?.name
            }
        },
        {
            title: "Наименование организации",
            dataIndex: "executor_id",
            key: "executor_id",
            render: (text: string) => {
                const executor = executors.find(executor => executor.id === text)
                return executor?.name
            }
        }
    ]

    const correspondsCol: ColumnsType<Corresponds> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Имя департамента",
            dataIndex: "name_of_department",
            key: "name_of_department"
        },
        {
            title: "Должность",
            dataIndex: "position",
            key: "position"
        },
        {
            title: "Документы",
            dataIndex: "id",
            key: "id",
            render: (id: string) => {
                const documents = docs.filter(doc => doc.correspond_id === id)
                return documents.map(doc => <Tag style={{marginBottom: "5px"}} color={"blue"}>{doc.name}</Tag>)
            }
        },
        {
            title: "Должен быть выполнен",
            dataIndex: "id",
            key: "id",
            render: (id: string) => {
                const documents = docs.filter(doc => doc.correspond_id === id && onlyFinished ? doc.finished_at : true)
                return documents.map(doc => <Tag
                    style={{marginBottom: "5px"}}
                    color={doc.finished_at ? "green" : "red"}>{moment(doc.must_be_finished_at).format("DD.MM.YYYY, HH:MM")}</Tag>)
            }
        },
        {
            title: "Исполнитель",
            dataIndex: "executorId",
            key: "executorId",
            render: (id: string) => {
                const executor = executors.filter(executor => executor.id === id)
                return executor.map(executor => <Tag
                    style={{marginBottom: "5px"}}
                    color={"blue"}>{executor.name}</Tag>)
            }
        }
    ]

    return (
        <div className={styles.mainWrapper}>
            <Tabs>
                <Tabs.TabPane tab="Документы" key="item-1">
                    Дата создания документа <br/>
                    <RangePicker onChange={(val) => setDate(val)}/>
                    <br/>
                    <br/>
                    Должен быть выполнен до <br/>
                    <RangePicker onChange={(val) => setFinishDate(val)}/>
                    <br/> <br/>
                    <Table columns={columns} dataSource={docs.filter((i) => {
                        if (date[0] && date[1]) {
                            return moment(i.created_at).isBetween(date[0], date[1])
                        } if (finishDate[0] && finishDate[1]) {
                            return moment(i.must_be_finished_at).isBetween(finishDate[0], finishDate[1])
                        }
                        else {
                            return i
                        }
                    })}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Корреспонденты" key="item-2">
                    <Table columns={correspondsCol} dataSource={corresponds}/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default Blog

export const getStaticProps: GetStaticProps = async () => {
    const docs = await prisma.document.findMany({})
    const executors = await prisma.executor.findMany({})
    const corresponds = await prisma.corresponds.findMany({})
    return {
        props: {
            executors: JSON.parse(JSON.stringify(executors)),
            docs: JSON.parse(JSON.stringify(docs)),
            corresponds: JSON.parse(JSON.stringify(corresponds))
        },
        revalidate: 10
    }
}
