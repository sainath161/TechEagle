const express = require('express');
const { protect } = require('../middlewares/auth');
const { getActivities, addActivity, updateActivityStatus, getActivityDetails } = require('../controllers/activityController');
const router = express.Router();

router.route('/').get(protect, getActivities).post(protect, addActivity);
router.route('/').put(protect, updateActivityStatus).get(protect, getActivityDetails);

module.exports = router;