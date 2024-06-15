import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import '../styles/ActivityRow.css';

const ActivityRow = ({ activity, index }) => {
    const [status, setStatus] = useState(activity.status);
    const [duration, setDuration] = useState(activity.duration);
    const intervalRef = useRef(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (status === 'Ongoing') {
            intervalRef.current = setInterval(() => {
                setDuration((prev) => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [status]);

    useEffect(() => {
        const updateDuration = async () => {
            try {
                await api.put(`/activities/${activity._id}`, { duration });
            } catch (error) {
                console.error('Failed to update duration', error);
            }
        };

        if (intervalRef.current) {
            updateDuration();
        }
    }, [duration, activity._id]);

    const handleAction = async (newStatus) => {
        try {
            await api.put(`/activities/${activity._id}`, { status: newStatus });
            setStatus(newStatus);
            if (newStatus === 'Ongoing') {
                intervalRef.current = setInterval(() => {
                    setDuration((prev) => prev + 1);
                }, 1000);
            } else {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        } catch (error) {
            console.error(`Failed to ${newStatus.toLowerCase()} activity`, error);
        }
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    return (
        <tr>
            <td className='td'>{index + 1}</td>
            <td className='td'>{activity.name}</td>
            <td className='td'>{formatDuration(duration)}</td>
            <td className='td'>
                {status === 'Pending' && <button className='start' onClick={() => handleAction('Ongoing')}>Start</button>}
                {status === 'Ongoing' && <button className='pause' onClick={() => handleAction('Paused')}>Pause</button>}
                {status === 'Paused' && <button className='resume' onClick={() => handleAction('Ongoing')}>Resume</button>}
                {status === 'Paused' && <button className='end' onClick={() => handleAction('Completed')}>End</button>}
                {status === 'Completed' && <button className='show-details' onClick={toggleDetails}>Show Details</button>}
            </td>
            <td className='td'>{status}</td>
            {showDetails && (
                <td className="details-popup">
                    <div className="details-content">
                        <h3>Activity Details</h3>
                        <p><strong>Name:</strong> {activity.name}</p>
                        <p><strong>Status:</strong> {activity.status}</p>
                        <p><strong>Duration:</strong> {formatDuration(duration)}</p>
                        <button className='close' onClick={toggleDetails}>Close</button>
                    </div>
                </td>
            )}
        </tr>
    );
};

export default ActivityRow;
