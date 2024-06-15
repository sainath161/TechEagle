const Activity = require('../models/Activity');

exports.getActivities = async (req, res) => {
    const activities = await Activity.find({ user: req.user._id });
    res.json(activities);
};

exports.addActivity = async (req, res) => {
    const { name } = req.body;
    const activity = new Activity({ user: req.user._id, name });

    // Initial history entry for 'Start' action
    activity.history.push({ action: 'Start', timestamp: Date.now() });

    try {
        const createdActivity = await activity.save();
        // Select only necessary fields to return
        const activityToSend = createdActivity.toObject();
        delete activityToSend.__v; // Remove the version key
        res.status(201).json(activityToSend);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add activity' });
    }
};

exports.updateActivityStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        let activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Check if trying to start a new activity while another is ongoing
        if (status === 'Ongoing') {
            const ongoingActivity = await Activity.findOne({ user: req.user._id, status: 'Ongoing', _id: { $ne: id } });
            if (ongoingActivity) {
                return res.status(400).json({ message: 'Pause or end the ongoing activity first' });
            }
        }

        // Calculate duration
        if (activity.status === 'Ongoing' && (status === 'Paused' || status === 'Completed')) {
            const now = Date.now();
            const lastStart = activity.history.filter(h => h.action === 'Start' || h.action === 'Resume').pop().timestamp;
            activity.duration += Math.floor((now - new Date(lastStart).getTime()) / 60000); // Duration in minutes
        }

        // Update status
        activity.status = status;

        // Handle history
        if (status === 'Ongoing') {
            activity.history.push({ action: 'Start', timestamp: Date.now() });
        } else if (status === 'Paused') {
            activity.history.push({ action: 'Pause', timestamp: Date.now() });
        } else if (status === 'Resume') {
            activity.history.push({ action: 'Resume', timestamp: Date.now() });
        } else if (status === 'Completed') {
            activity.history.push({ action: 'End', timestamp: Date.now() });
        }

        // Save activity
        await activity.save();

        // Select only necessary fields to return
        const activityToSend = activity.toObject();
        delete activityToSend.__v; // Remove the version key

        // Return updated activity
        res.json(activityToSend);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getActivityDetails = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (activity) {
            // Select only necessary fields to return
            const activityToSend = activity.toObject();
            delete activityToSend.__v; // Remove the version key
            res.json(activityToSend);
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
