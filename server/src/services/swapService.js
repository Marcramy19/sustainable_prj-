const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

const create = async (requesterId, { offeredItemId, requestedItemId }) => {
    // Fetch both items
    const [offeredItem, requestedItem] = await Promise.all([
        prisma.item.findUnique({ where: { id: offeredItemId } }),
        prisma.item.findUnique({ where: { id: requestedItemId } })
    ]);

    if (!offeredItem) throw new AppError('Offered item not found', 404);
    if (!requestedItem) throw new AppError('Requested item not found', 404);

    // Validate ownership
    if (offeredItem.ownerId !== requesterId) {
        throw new AppError('You can only offer your own items', 403);
    }
    if (requestedItem.ownerId === requesterId) {
        throw new AppError('Cannot swap with yourself', 400);
    }

    // Validate availability
    if (offeredItem.status !== 'available') {
        throw new AppError('Your offered item is no longer available', 400);
    }
    if (requestedItem.status !== 'available') {
        throw new AppError('The requested item is no longer available', 400);
    }

    return prisma.swapRequest.create({
        data: { offeredItemId, requestedItemId, requesterId },
        select: {
            id: true, status: true, createdAt: true,
            offeredItem: { select: { id: true, title: true } },
            requestedItem: { select: { id: true, title: true } }
        }
    });
};

const listMine = async (userId) => {
    // Get items owned by this user (to find incoming swaps)
    const [sent, received] = await Promise.all([
        // Swaps I sent (I'm the requester)
        prisma.swapRequest.findMany({
            where: { requesterId: userId },
            select: {
                id: true, status: true, createdAt: true,
                offeredItem: { select: { id: true, title: true, category: true } },
                requestedItem: {
                    select: {
                        id: true, title: true, category: true,
                        owner: { select: { id: true, name: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        }),
        // Swaps I received (someone wants my item)
        prisma.swapRequest.findMany({
            where: { requestedItem: { ownerId: userId } },
            select: {
                id: true, status: true, createdAt: true,
                offeredItem: {
                    select: {
                        id: true, title: true, category: true,
                        owner: { select: { id: true, name: true } }
                    }
                },
                requestedItem: { select: { id: true, title: true, category: true } }
            },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    return { sent, received };
};

const updateStatus = async (swapId, userId, newStatus) => {
    const swap = await prisma.swapRequest.findUnique({
        where: { id: swapId },
        include: {
            requestedItem: { select: { id: true, ownerId: true } },
            offeredItem: { select: { id: true, ownerId: true } }
        }
    });

    if (!swap) throw new AppError('Swap request not found', 404);

    // Only the owner of the requested item can accept/reject
    if (swap.requestedItem.ownerId !== userId) {
        throw new AppError('Not authorized', 403);
    }

    if (swap.status !== 'pending') {
        throw new AppError('Swap already processed', 400);
    }

    if (newStatus === 'rejected') {
        return prisma.swapRequest.update({
            where: { id: swapId },
            data: { status: 'rejected' },
            select: { id: true, status: true }
        });
    }

    // ACCEPT — use transaction
    // 1. Mark both items as swapped
    // 2. Accept this swap
    // 3. Auto-reject all other pending swaps involving either item
    return prisma.$transaction(async (tx) => {
        // Mark both items as swapped
        await tx.item.update({
            where: { id: swap.offeredItem.id },
            data: { status: 'swapped' }
        });
        await tx.item.update({
            where: { id: swap.requestedItem.id },
            data: { status: 'swapped' }
        });

        // Accept this swap
        const updated = await tx.swapRequest.update({
            where: { id: swapId },
            data: { status: 'accepted' },
            select: { id: true, status: true }
        });

        // Auto-reject all other pending swaps involving either item
        await tx.swapRequest.updateMany({
            where: {
                id: { not: swapId },
                status: 'pending',
                OR: [
                    { offeredItemId: { in: [swap.offeredItem.id, swap.requestedItem.id] } },
                    { requestedItemId: { in: [swap.offeredItem.id, swap.requestedItem.id] } }
                ]
            },
            data: { status: 'rejected' }
        });

        return updated;
    });
};

module.exports = { create, listMine, updateStatus };
