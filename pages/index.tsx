import React, {useState} from "react"
import {GetStaticProps} from "next"
import prisma from '../lib/prisma';
import Plan from "../types/plan";
import User from "../types/user";

interface BlogProps {
    plans: Plan[]
    users: User[]
}

const Blog: React.FC<BlogProps> = ({plans, users}) => {
    const [selectedPlan, setSelectedPlan] = useState<string>("cla7xjpqf0002xuq4g6fd1081")

    return (
        <div>
            <select onChange={(event) => setSelectedPlan(event.target.value)}>
                {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
            </select>
            <div>
                {plans.map((plan) => (
                    <div key={plan.id}>
                        <h3>{plan.name}</h3>
                        <p>{plan.default_price} BYN</p>
                    </div>
                ))}
            </div>
            <br/>
            {users.filter(id => id.plan_id === selectedPlan).map((user) => (
                <div key={user.id}>
                    <h3>{user.name}</h3>
                </div>
            ))}
        </div>
    )
}

export default Blog

export const getStaticProps: GetStaticProps = async () => {
    const plans = await prisma.plan.findMany({})
    const users = await prisma.customer.findMany({})
    return {
        props: {
            plans: JSON.parse(JSON.stringify(plans)),
            users: JSON.parse(JSON.stringify(users))
        },
        revalidate: 10,
    };
}
