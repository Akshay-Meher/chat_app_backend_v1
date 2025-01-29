const { Group, User, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { sendResponse } = require('../utils/responseHandler');

exports.createGroup = async (req, res) => {

    // const { group_name, admin_id, user_ids } = req.body;
    // try {
    //     const group = await Group.create({
    //         group_name,
    //         admin_id,
    //         user_ids: JSON.parse(user_ids),
    //     });

    //     // return res.status(201).json({ message: 'Group created successfully', group });
    //     return sendResponse(res, "CREATED", 'Group created successfully', group);
    // } catch (error) {
    //     console.error(error);
    //     return sendResponse(res, "INTERNAL_SERVER_ERROR",);
    //     // return res.status(500).json({ error: 'Failed to create group' });
    // }

    const { group_name, admin_id, user_ids } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // Step 1: Create the group
        const group = await Group.create(
            {
                group_name,
                admin_id,
                user_ids: JSON.parse(user_ids),
            },
            { transaction }
        );

        // Step 2: Prepare user-group relationships
        const userIdsArray = JSON.parse(user_ids);
        const groupUsers = userIdsArray.map((userId) => ({
            group_id: group.id,
            user_id: userId,
        }));

        // Include admin as a group member
        groupUsers.push({ group_id: group.id, user_id: admin_id });

        await sequelize.models.GroupUsers.bulkCreate(groupUsers, { transaction });
        // Commit transaction
        await transaction.commit();
        // Return the response
        return sendResponse(res, 'CREATED', 'Group created successfully', group);
    } catch (error) {
        console.error(error);
        // Rollback transaction in case of error
        await transaction.rollback();
        return sendResponse(res, 'INTERNAL_SERVER_ERROR', 'Failed to create group');
    }

};


exports.getGroupsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch groups for the user
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Group,
                    as: 'Groups',
                    attributes: ['id', 'group_name', 'admin_id', 'profile_image'],
                },
            ],
        });

        if (!user) {
            // return res.status(404).json({ message: 'User not found' });
            return sendResponse(res, "NOT_FOUND", 'User not found');
        }

        // return res.status(200).json({ groups: user.Groups });
        return sendResponse(res, "OK", null, user.Groups);
    } catch (error) {
        console.error(error);
        // return res.status(500).json({ error: 'Failed to fetch groups for the user' });
        return sendResponse(res, "INTERNAL_SERVER_ERROR", 'Failed to fetch groups for the user');
    }
};


exports.getUsersByGroupId = async (req, res) => {
    const { groupId } = req.params;

    try {
        // Fetch the group and include users
        const group = await Group.findByPk(groupId, {
            include: [
                {
                    model: User,
                    as: 'Users',
                    attributes: ['id', 'name', 'email', 'profile_image'], // Include specific fields
                },
            ],
        });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        return res.status(200).json({ users: group.Users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch users for the group' });
    }
};