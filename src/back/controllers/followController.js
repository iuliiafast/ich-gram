import Follow from '../models/followModel.js';
import User from '../models/userModel.js';
export const getUserFollowers = async (req, res) => {
    try {
        const followers = await Follow.find({ followerUserId: req.params.userId }).populate('followerUserId', 'userName');
        res.status(200).json(followers);
    }
    catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).json({ error: 'Ошибка при получении подписчиков' });
    }
};
export const getUserFollowing = async (req, res) => {
    try {
        console.log(req.params.userId);
        const following = await Follow.find({ followedUserId: req.params.userId }).populate('followedUserId', 'userName');
        res.status(200).json(following);
    }
    catch (error) {
        console.error('Error fetching subscription list:', error);
        res.status(500).json({ error: 'Ошибка при получении списка подписок' });
    }
};
export const followUser = async (req, res) => {
    const { userId, targetUserId } = req.params;
    try {
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);
        if (!user || !targetUser) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const existingFollow = await Follow.findOne({ followerUserId: userId, followedUserId: targetUserId });
        if (existingFollow) {
            return res.status(400).json({ error: 'Вы уже подписаны на этого пользователя' });
        }
        const follow = new Follow({
            followerUserId: userId,
            followedUserId: targetUserId,
            userId: userId,
            createdAt: new Date(),
        });
        user.followingCount += 1;
        targetUser.followersCount += 1;
        await user.save();
        await targetUser.save();
        await follow.save();
        res.status(201).json(follow);
    }
    catch (error) {
        console.error('Error subscribing to user:', error);
        res.status(500).json({ error: 'Ошибка при подписке на пользователя' });
    }
};
export const unfollowUser = async (req, res) => {
    const { userId, targetUserId } = req.params;
    try {
        const follow = await Follow.findOne({ followerUserId: userId, followedUserId: targetUserId });
        if (!follow) {
            return res.status(404).json({ error: 'Вы не подписаны на этого пользователя' });
        }
        await Follow.findByIdAndDelete(follow._id);
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);
        user.followingCount -= 1;
        targetUser.followersCount -= 1;
        await user.save();
        await targetUser.save();
        res.status(200).json({ message: 'Вы отписались от пользователя' });
    }
    catch (error) {
        console.error('Error unsubscribing from user:', error);
        res.status(500).json({ error: 'Ошибка при отписке от пользователя' });
    }
};
