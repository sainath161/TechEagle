import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../api';
import ActivityRow from './ActivityRow';
import { Link } from 'react-router-dom';
import '../styles/ActivityList.css';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [newActivityName, setNewActivityName] = useState('');
    const { user, logout, loading } = useAuth();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const { data } = await api.get('/activities');
                setActivities(data);
            } catch (error) {
                console.error('Failed to fetch activities', error);
            }
        };
        fetchActivities();
    }, []);

    const handleAddActivity = async () => {
        setShowAddActivity(true);
    };

    const cancelAddActivity = () => {
        setShowAddActivity(false);
        setNewActivityName('');
    };

    const saveActivity = async () => {
        if (!newActivityName) return;

        try {
            const { data } = await api.post('/activities', { name: newActivityName });
            setActivities([...activities, data]);
            setShowAddActivity(false);
            setNewActivityName('');
        } catch (error) {
            console.error('Failed to add activity', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Activity List</h1>
            {user ? (
                <div>
                    <h2>Welcome, <span>{user.name}</span></h2>
                    <span className='buttons'>
                        <button className='add' onClick={handleAddActivity}>Add Activity</button>
                        <button className='logout' onClick={logout}>Logout</button>
                    </span>
                    <table>
                        <thead>
                            <tr>
                                <th className='serial'>S.No</th>
                                <th className='name'>Activity Name</th>
                                <th className='duration'>Activity Duration</th>
                                <th className='actions'>Actions</th>
                                <th className='status'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((activity, index) => (
                                <ActivityRow key={activity._id} activity={activity} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <h2>Please log in to view activities.</h2>
                    <Link className='login' to="/login">Login</Link>
                </div>
            )}

            {showAddActivity && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Add New Activity</h2>
                        <input
                            style={{
                                width: '80%',
                                padding: '10px',
                                marginBottom: '10px',
                                boxSizing: 'border-box',
                                borderRadius: '5px',
                                border: '1px solid #ccc'

                            }}
                            type="text"
                            placeholder="Activity Name"
                            value={newActivityName}
                            onChange={(e) => setNewActivityName(e.target.value)}
                        />
                        <div className='buttons'>
                            <button className='add' onClick={saveActivity}>Add</button>
                            <button className='logout' onClick={cancelAddActivity}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityList;
