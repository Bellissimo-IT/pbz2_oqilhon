import React, {useState} from "react"
import {GetStaticProps} from "next";
import prisma from "../lib/prisma";
import Plan from "../types/plan";
import User from "../types/user";

interface AdminProps {
    users: User[]
    plans: Plan[]
}

const Admin: React.FC<AdminProps> = ({users, plans}) => {
    const [name, setName] = useState('')
    const [secondName, setSecondName] = useState('')
    const [planName, setPlanName] = useState('')
    const [debt, setDebt] = useState(0)
    const [address, setAddress] = useState('')
    const [regionName, setRegionName] = useState('')
    return (
        <div>
            {plans.map(i => (
                <div>{i.name}</div>
            ))}
            <button>Add new plan</button>
        </div>
    )
}

export default Admin

async function savedCustomer(customer) {
    const response = await fetch('/api/customer', {
        method: 'POST',
        body: JSON.stringify(customer)
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return await response.json()
}

export const getStaticProps: GetStaticProps = async () => {
    const plans = await prisma.plan.findMany();
    const users = await prisma.customer.findMany()
    return {
        props: {
            plans,
            users
        },
        revalidate: 10,
    };
}