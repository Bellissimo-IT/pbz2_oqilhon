import React from "react"
import {GetStaticProps} from "next"
import prisma from '../lib/prisma';
import Plan from "../types/plan";
import User from "../types/user";

interface BlogProps {
    plans: Plan[]
    users: User[]
}

const Blog: React.FC<BlogProps> = ({users}) => {

    return (
        <div>
            {users.map(i => (
                <div>
                    <p>
                        User: {i.name}
                    </p>
                    <p>
                        Plan: {i.planName}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default Blog

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
