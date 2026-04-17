const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/errorHandler');

const prisma = new PrismaClient();
const PAGE_SIZE = 20;

const create = async (ownerId, data) => {
    const { title, description, category, condition } = data;
    return prisma.item.create({
        data: { ownerId, title, description: description || '', category, condition },
        select: { id: true, title: true, description: true, category: true, condition: true, status: true, createdAt: true }
    });
};

const list = async ({ category, page = 1 }) => {
    const where = { status: 'available' };
    if (category) where.category = category;

    const skip = (page - 1) * PAGE_SIZE;

    const [items, total] = await Promise.all([
        prisma.item.findMany({
            where,
            select: {
                id: true, title: true, description: true, category: true,
                condition: true, status: true, createdAt: true,
                owner: { select: { id: true, name: true, city: true } }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: PAGE_SIZE
        }),
        prisma.item.count({ where })
    ]);

    return { items, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
};

const getById = async (id) => {
    const item = await prisma.item.findUnique({
        where: { id },
        select: {
            id: true, title: true, description: true, category: true,
            condition: true, status: true, createdAt: true,
            owner: { select: { id: true, name: true, city: true } }
        }
    });
    if (!item) throw new AppError('Item not found', 404);
    return item;
};

const listMine = async (ownerId) => {
    return prisma.item.findMany({
        where: { ownerId },
        select: {
            id: true, title: true, description: true, category: true,
            condition: true, status: true, createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

const update = async (id, userId, data) => {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) throw new AppError('Item not found', 404);
    if (item.ownerId !== userId) throw new AppError('Not authorized', 403);
    if (item.status === 'swapped') throw new AppError('Cannot edit a swapped item', 400);

    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.category !== undefined) updateData.category = data.category;
    if (data.condition !== undefined) updateData.condition = data.condition;

    return prisma.item.update({
        where: { id },
        data: updateData,
        select: { id: true, title: true, description: true, category: true, condition: true, status: true }
    });
};

const remove = async (id, userId, isAdmin) => {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) throw new AppError('Item not found', 404);
    if (item.ownerId !== userId && !isAdmin) throw new AppError('Not authorized', 403);

    await prisma.item.delete({ where: { id } });
};

module.exports = { create, list, getById, listMine, update, remove };
