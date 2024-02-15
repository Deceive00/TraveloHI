// src/App.js
import { useState, useEffect } from 'react';
import styles from './UserDataTable.module.scss';
import { LuUnlock } from "react-icons/lu";
import axios from 'axios';
import { FaBan } from 'react-icons/fa'; 

const UserDataTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/get-all-users", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setUsers(response.data.users);
        console.log(response.data.users)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleBannedStatus = async (userId: any, isBanned : boolean) => {
    try {
      const mode = isBanned ? "unban" : "ban";
      const response = await axios.put(`http://localhost:8080/api/admin/${mode}/${userId}`, {},{
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log(response.data);
        setUsers(response.data.users)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.gender}</td>
              <td>{user.dob}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className={`${styles.statusContainer} ${user.isBanned ? styles.bgBanned : styles.bgActive}`}>
                  <div
                    className={`${styles.circle} ${user.isBanned ? styles.banned : styles.active}`}
                  />
                  <span className={`${user.isBanned ? styles.spanBanned : styles.spanActive}`}>{user.isBanned ? 'Banned' : 'Active'}</span>
                </div>
              </td>
              <td>
                <button className={styles.actionBtn} onClick={() => toggleBannedStatus(user.id, user.isBanned)}>
                  {user.isBanned ? <LuUnlock style={{color:'green'}} /> : <FaBan style={{color: 'red'}} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDataTable;
