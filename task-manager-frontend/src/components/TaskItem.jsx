// src/components/TaskItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TaskItem = ({ task }) => {
    if (!task) return null; // Handle missing task data

    return (
        <Link
            to={`/tasks/${task._id}`} // Assuming a task detail route like /tasks/:id
            className="block bg-gray-50 border border-gray-200 rounded-md p-4 mb-3 hover:bg-gray-100 transition duration-200 ease-in-out"
        >
            <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{task.description ? task.description : 'No description'}</p> {/* Added line-clamp-2 */}
            <div className="flex items-center text-xs text-gray-500 mt-3 flex-wrap"> {/* Added flex-wrap */}
                 {task.dueDate && (
                     <span className="mr-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                 )}
                {task.priority && (
                     <span className={`mr-3 flex items-center font-medium ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-gray-500'}`}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zM4 13a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" clipRule="evenodd" />
                         </svg>
                         Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} {/* Capitalize priority */}
                     </span>
                )}
                 {task.status && (
                     <span className="mr-3 flex items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                         Status: {task.status.charAt(0).toUpperCase() + task.status.slice(1)} {/* Capitalize status */}
                     </span>
                 )}
                 {task.assignee && task.assignee.username && ( {/* Check if assignee and username exist */}
                     <span className="mr-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                         </svg>
                         Assignee: {task.assignee.username}
                     </span>
                 )}
                  {task.labels && task.labels.length > 0 && (
                    <span className="mr-3 flex items-center flex-wrap"> {/* Added flex-wrap */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l3-4m0 0l3 4m-3-4v16m2-16h4m2 0h4M7 15h.01M7 19h.01" />
                        </svg>
                        Labels: {task.labels.map(label => (
                            <span key={label._id} style={{ backgroundColor: label.color }} className={`ml-1 px-1 rounded text-white text-xs`} >{label.name}</span> // Basic label display
                        ))}
                    </span>
                  )}
            </div>
        </Link>
    );
};

export default TaskItem;