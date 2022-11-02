import {PrismaClient} from '@prisma/client'
import {NextApiRequest, NextApiResponse} from "next";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).json({message: 'Method not allowed'})
    }

    const customerData = JSON.parse(req.body)
    const savedCustomer = await prisma.customer.create({
        data: customerData
    })

    res.json(savedCustomer)
}