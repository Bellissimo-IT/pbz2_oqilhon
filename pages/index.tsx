import React from "react"
import {GetStaticProps} from "next"
import prisma from "../lib/prisma"
import {Document, Executor} from "../types/Document"
import {Checkbox, DatePicker, Table, Tabs, Tag} from "antd"
import styles from "./styles.module.css"
import moment, {Moment} from "moment"
import {ColumnsType} from "antd/es/table"

interface BlogProps {
    docs: Document[]
    executors: Executor[]
}

const Blog: React.FC<BlogProps> = ({docs, executors}) => {
    const {RangePicker} = DatePicker
    const [date, setDate] = React.useState<[Moment, Moment]>([undefined, undefined])
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
                return executor?.name_of_executor
            }
        },
        {
            title: "Наименование организации",
            dataIndex: "executor_id",
            key: "executor_id",
            render: (text: string) => {
                const executor = executors.find(executor => executor.id === text)
                return executor?.name_of_department
            }
        }
    ]

    const executorCol: ColumnsType<Executor> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Имя исполнителя",
            dataIndex: "name_of_executor",
            key: "name_of_executor"
        },
        {
            title: "Имя подразделения",
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
                const documents = docs.filter(doc => doc.executor_id === id)
                return documents.map(doc => <Tag style={{marginBottom: "5px"}} color={"blue"}>{doc.name}</Tag>)
            }
        },
        {
            title: "Должен быть выполнен",
            dataIndex: "id",
            key: "id",
            render: (id: string) => {
                const documents = docs.filter(doc => doc.executor_id === id && onlyFinished ? doc.finished_at : true)
                return documents.map(doc => <Tag
                    style={{marginBottom: "5px"}}
                    color={doc.finished_at ? "green" : "red"}>{moment(doc.must_be_finished_at).format("DD.MM.YYYY, HH:MM")}</Tag>)
            }
        }
    ]

    console.log(docs, "docs")
    console.log(executors, "executors")

    return (
        <div className={styles.mainWrapper}>
            <Tabs>
                <Tabs.TabPane tab="Документы | Мероприятия" key="item-1">
                    <RangePicker onChange={(val) => setDate(val)}/>
                    <br/> <br/>
                    <Table columns={columns} dataSource={docs.filter((i) => {
                        if (date[0] && date[1]) {
                            return moment(i.created_at).isBetween(date[0], date[1])
                        } else {
                            return i
                        }
                    })}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Исполнители" key="item-2">
                    <Checkbox onChange={(e) => setOnlyFinished(e.target.checked)}>Только выполненные</Checkbox>
                    <br/><br/>
                    <Table columns={executorCol} dataSource={executors}/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default Blog

export const getStaticProps: GetStaticProps = async () => {
    const docs = await prisma.document.findMany({})
    const executors = await prisma.executor.findMany({})
    return {
        props: {
            executors: JSON.parse(JSON.stringify(executors)),
            docs: JSON.parse(JSON.stringify(docs))
        },
        revalidate: 10
    }
}
