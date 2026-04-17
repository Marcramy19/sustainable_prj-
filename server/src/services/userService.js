const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, city: true, bio: true, isAdmin: true, createdAt: true }
    });
    if (!user) throw new AppError('User not found', 404);
    return user;
};

const updateMe = async (userId, data) => {
    const { name, city, bio } = data;
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (city !== undefined) updateData.city = city.trim();
    if (bio !== undefined) updateData.bio = bio.trim();

    const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: { id: true, email: true, name: true, city: true, bio: true, isAdmin: true }
    });
    return user;
};

const deleteMe = async (userId) => {
    await prisma.user.delete({ where: { id: userId } });
};

const listAll = async () => {
    return prisma.user.findMany({
        select: { id: true, email: true, name: true, city: true, isAdmin: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
    });
};

const deleteUser = async (userId) => {
    await prisma.user.delete({ where: { id: userId } });
};

const getStats = async () => {
    const [userCount, itemCount, swapCount] = await Promise.all([
        prisma.user.count(),
        prisma.item.count(),
        prisma.swapRequest.count({ where: { status: 'accepted' } })
    ]);
    return { users: userCount, items: itemCount, completedSwaps: swapCount };
};

module.exports = { getMe, updateMe, deleteMe, listAll, deleteUser, getStats };
