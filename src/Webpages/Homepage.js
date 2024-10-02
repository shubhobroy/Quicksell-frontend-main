import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Homepage.css';
import Header from '../Components/Header';
import Card from '../Components/Card';

const Homepage = () => {
  const [grouping, setGrouping] = useState(() => localStorage.getItem('grouping') || 'status');
  const [ordering, setOrdering] = useState(() => localStorage.getItem('ordering') || 'priority');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeDropdown);
    return () => {
      document.removeEventListener('mousedown', closeDropdown);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('grouping', grouping);
  }, [grouping]);

  useEffect(() => {
    localStorage.setItem('ordering', ordering);
  }, [ordering]);

  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((response) => response.json())
      .then((data) => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleGroupingChange = (event) => setGrouping(event.target.value);
  const handleOrderingChange = (event) => setOrdering(event.target.value);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const sortTickets = (tickets) => {
    return tickets.sort((a, b) => {
      if (ordering === 'priority') return b.priority - a.priority;
      if (ordering === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  };

  const groupedTickets = useMemo(() => {
    let groupedTickets = { col1: [], col2: [], col3: [], col4: [], col5: [] };

    const groupByField = (tickets, field, values) => {
      values.forEach((value, idx) => {
        groupedTickets[`col${idx + 1}`] = sortTickets(tickets.filter((ticket) => ticket[field] === value));
      },);
    };

    if (grouping === 'status') {
      groupByField(tickets, 'status', ['Backlog', 'Todo', 'In progress', 'Done', 'Cancelled']);
    } else if (grouping === 'user') {
      groupByField(tickets, 'userId', ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5']);
    } else if (grouping === 'priority') {
      groupByField(tickets, 'priority', [0, 4, 3, 2, 1]);
    }

    return groupedTickets;
  }, [tickets, grouping, ordering]);

  const getUserNameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const renderColumn = (columnTickets, title, imagePath) => (
    <div className="ticket-column">
      <Header imagePath={imagePath} title={title} length={columnTickets.length} />
      {columnTickets.map((ticket) => (
        <Card key={ticket.id} id={ticket.id} title={ticket.title} tag={ticket.tag[0]} />
      ))}
    </div>
  );

  const headerData = {
    status: [
      { title: 'Backlog', icon: '/images/icons/Backlog.svg' },
      { title: 'Todo', icon: '/images/icons/To-do.svg' },
      { title: 'In Progress', icon: '/images/icons/in-progress.svg' },
      { title: 'Done', icon: '/images/icons/Done.svg' },
      { title: 'Cancelled', icon: '/images/icons/Cancelled.svg' }
    ],
    user: [
      { title: getUserNameById('usr-1'), icon: '/images/icons/profileicon.svg' },
      { title: getUserNameById('usr-2'), icon: '/images/icons/profileicon.svg' },
      { title: getUserNameById('usr-3'), icon: '/images/icons/profileicon.svg' },
      { title: getUserNameById('usr-4'), icon: '/images/icons/profileicon.svg' },
      { title: getUserNameById('usr-5'), icon: '/images/icons/profileicon.svg' }
    ],
    priority: [
      { title: 'No Priority', icon: '/images/icons/No-Priority.svg' },
      { title: 'Urgent', icon: '/images/icons/SVG - Urgent Priority colour.svg' },
      { title: 'High', icon: '/images/icons/Img - High Priority.svg' },
      { title: 'Medium', icon: '/images/icons/Img - Medium Priority.svg' },
      { title: 'Low', icon: '/images/icons/Img - Low Priority.svg' }
    ]
  };

  const currentHeaderData = headerData[grouping];

  return (
    <div className="homepage">
      <div className="selectors" ref={dropdownRef}>
        <div className="display-button" onClick={toggleDropdown}>
          <img src="/images/icons/Display.svg" alt="logo" className="button-icon" />
          <span>Display</span>
          <img src="/images/icons/down.svg" alt="dropdown" className="button-icon" />
        </div>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="selector">
              <label>Grouping</label>
              <select value={grouping} onChange={handleGroupingChange}>
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div className="selector">
              <label>Ordering</label>
              <select value={ordering} onChange={handleOrderingChange}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="ticket-lists">
        {Object.keys(groupedTickets).map((col, index) =>
          renderColumn(groupedTickets[col], currentHeaderData[index].title, currentHeaderData[index].icon)
        )}
      </div>
    </div>
  );
};

export default Homepage;
