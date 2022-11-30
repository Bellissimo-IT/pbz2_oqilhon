import React, {useState} from "react"
import {GetStaticProps} from "next"
import prisma from '../lib/prisma';
import Plan from "../types/plan";
import User from "../types/user";
import {City} from "../types/City";
import {Radio, Table, Tabs} from "antd";
import styles from "./styles.module.css"
import moment from "moment";

interface BlogProps {
    users: User[]
    cities: City[]
    plans: Plan[]
}

const Blog: React.FC<BlogProps> = ({users, cities, plans}) => {
    const [selectedCity, setSelectedCity] = useState<string>(cities[0].id)
    const [selectedMonth, setSelectedMonth] = useState<string>(moment(users[0].created_at).format("MM"))

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Second Name',
            dataIndex: 'second_name',
            key: 'secondName',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Plan',
            dataIndex: 'plan_id',
            key: 'plan',
        },
        {
            title: 'Date of creation',
            dataIndex: 'created_at',
            key: 'date',
        },
    ];

    const debtsColumn = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Second Name',
            dataIndex: 'second_name',
            key: 'secondName',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Plan',
            dataIndex: 'plan_id',
            key: 'plan',
        },
        {
            title: 'Debts',
            dataIndex: 'debts',
            key: 'debts',
        }
    ]

    const planColumn = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: "default_price",
            key: 'price',
        },
        {
            title: 'Created at',
            dataIndex: 'created_at',
            key: 'date',
        }
    ]

    return (
        <div className={styles.mainWrapper}>
            <Tabs>
                <Tabs.TabPane tab="Расчет количества абонентов с фильтром" key="item-1">
                    <Radio.Group style={{marginBottom: "25px"}}
                                 onChange={(event) => setSelectedCity(event.target.value)} value={selectedCity}>
                        {cities.map((city) => (<Radio.Button value={city.id}>{city.name}</Radio.Button>))}
                    </Radio.Group>
                    <Radio.Group style={{marginBottom: "25px"}}>
                        <Radio.Button onChange={() => setSelectedMonth(undefined)}>
                            All months
                        </Radio.Button>
                        {
                            moment.months().map((month, index) => {
                                return {
                                    month,
                                    index
                                }
                            }).map((month) => (<Radio.Button onChange={(e) => setSelectedMonth(e.target.value)}
                                                             value={month.index}>{month.month}</Radio.Button>))
                        }
                    </Radio.Group>
                    <div className={styles.dataWrapper}>
                        <Table dataSource={users.filter(
                            user => user.region_id === selectedCity && selectedMonth ? moment(user.created_at).format("MM") == selectedMonth + 1 : user.region_id === selectedCity).map(
                            user => {
                                return {
                                    ...user,
                                    created_at: moment(user.created_at).format('DD.MM.YYYY, HH:mm'),
                                    plan_id: plans.find(plan => plan.id === user.plan_id)?.name
                                }
                            }
                        )
                        } columns={columns}/>
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Просмотр списка абонентов, имеющих задолженности по оплате" key="item-2">
                    <div className={styles.dataWrapper}>
                        <Table dataSource={users.filter(
                            user => user.debts > 0).map(
                            user => {
                                return {
                                    ...user,
                                    created_at: moment(user.created_at).format('DD.MM.YYYY, HH:mm'),
                                    plan_id: plans.find(plan => plan.id === user.plan_id)?.name,
                                    debts: user.debts + " BYN"
                                }
                            }
                        )
                        } columns={debtsColumn}/>
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Стоимость оплаты одной минуты разговора" key="item-3">
                    <Radio.Group style={{marginBottom: "25px"}}>
                        <Radio.Button onChange={() => setSelectedMonth(undefined)} value="show_all">Show all</Radio.Button>
                        {
                            moment.months().map((month, index) => {
                                return {
                                    month,
                                    index
                                }
                            }).map((month) => (
                                <Radio.Button
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    value={month.index}>{month.month}</Radio.Button>
                            ))
                        }
                    </Radio.Group>
                    <div className={styles.dataWrapper}>
                        <Table
                            dataSource={
                                plans.filter(
                                    plan => selectedMonth ? moment(plan.created_at).format("MM") == selectedMonth + 1 : plan).map(
                                    plan => {
                                        return {
                                            ...plan,
                                            default_price: (plan.default_price).toFixed(2) + " BYN",
                                            created_at: moment(plan.created_at).format('DD.MM.YYYY, HH:mm')
                                        }
                                    }
                                )
                            } columns={planColumn}/>
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default Blog

export const getStaticProps: GetStaticProps = async () => {
    const users = await prisma.customer.findMany({})
    const cities = await prisma.region.findMany({})
    const plans = await prisma.plan.findMany({})
    return {
        props: {
            users: JSON.parse(JSON.stringify(users)),
            cities: JSON.parse(JSON.stringify(cities)),
            plans: JSON.parse(JSON.stringify(plans))
        },
        revalidate: 10,
    };
}
